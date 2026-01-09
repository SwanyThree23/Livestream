import express from 'express';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import config from '../config/index.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticateToken, requireSubscription } from '../middleware/auth.js';
import logger from '../utils/logger.js';

const router = express.Router();
const supabase = createClient(config.supabase.url, config.supabase.serviceKey);

/**
 * Validation schemas
 */
const createStreamSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  platforms: z.array(z.enum(['twitch', 'youtube', 'facebook', 'twitter', 'tiktok', 'instagram', 'linkedin'])).min(1),
  scheduled_at: z.string().datetime().optional(),
  tags: z.array(z.string()).optional(),
  category: z.string().optional(),
  is_public: z.boolean().default(true),
});

/**
 * GET /api/streams
 * List user streams with filters
 */
router.get('/', authenticateToken, asyncHandler(async (req, res) => {
  const { status, platform, page = 1, limit = 20 } = req.query;

  let query = supabase
    .from('streams')
    .select('*', { count: 'exact' })
    .eq('user_id', req.userId)
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (status) {
    query = query.eq('status', status);
  }

  if (platform) {
    query = query.contains('platforms', [platform]);
  }

  const { data: streams, error, count } = await query;

  if (error) {
    logger.error('Failed to fetch streams:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch streams',
    });
  }

  res.json({
    success: true,
    data: {
      streams,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
      },
    },
  });
}));

/**
 * GET /api/streams/:id
 * Get stream by ID
 */
router.get('/:id', authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { data: stream, error } = await supabase
    .from('streams')
    .select('*')
    .eq('id', id)
    .eq('user_id', req.userId)
    .single();

  if (error || !stream) {
    return res.status(404).json({
      success: false,
      error: 'Stream not found',
    });
  }

  res.json({
    success: true,
    data: { stream },
  });
}));

/**
 * POST /api/streams
 * Create new stream (requires basic+ subscription)
 */
router.post('/', authenticateToken, requireSubscription(['basic', 'pro', 'enterprise']), asyncHandler(async (req, res) => {
  const validatedData = createStreamSchema.parse(req.body);

  const { data: stream, error } = await supabase
    .from('streams')
    .insert({
      ...validatedData,
      user_id: req.userId,
      status: 'draft',
    })
    .select()
    .single();

  if (error) {
    logger.error('Failed to create stream:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create stream',
    });
  }

  logger.info(`Stream created: ${stream.id} by user ${req.userId}`);

  res.status(201).json({
    success: true,
    message: 'Stream created successfully',
    data: { stream },
  });
}));

/**
 * POST /api/streams/:id/start
 * Start stream on selected platforms
 */
router.post('/:id/start', authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Get stream
  const { data: stream, error: streamError } = await supabase
    .from('streams')
    .select('*')
    .eq('id', id)
    .eq('user_id', req.userId)
    .single();

  if (streamError || !stream) {
    return res.status(404).json({
      success: false,
      error: 'Stream not found',
    });
  }

  if (stream.status === 'live') {
    return res.status(400).json({
      success: false,
      error: 'Stream is already live',
    });
  }

  // Get OAuth connections for platforms
  const { data: oauthConnections } = await supabase
    .from('oauth_connections')
    .select('*')
    .eq('user_id', req.userId)
    .in('provider', stream.platforms);

  if (!oauthConnections || oauthConnections.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'No connected platforms found. Please connect platforms first.',
    });
  }

  // Update stream status
  const { data: updatedStream, error: updateError } = await supabase
    .from('streams')
    .update({
      status: 'live',
      started_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (updateError) {
    logger.error('Failed to start stream:', updateError);
    return res.status(500).json({
      success: false,
      error: 'Failed to start stream',
    });
  }

  logger.info(`Stream started: ${id} by user ${req.userId}`);

  // TODO: Implement platform-specific streaming logic here
  // This would involve calling Twitch, YouTube, Facebook, etc. APIs

  res.json({
    success: true,
    message: 'Stream started successfully',
    data: {
      stream: updatedStream,
      platforms: oauthConnections.map(c => c.provider),
    },
  });
}));

/**
 * POST /api/streams/:id/stop
 * Stop stream
 */
router.post('/:id/stop', authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { data: stream, error } = await supabase
    .from('streams')
    .update({
      status: 'ended',
      ended_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', req.userId)
    .select()
    .single();

  if (error) {
    logger.error('Failed to stop stream:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to stop stream',
    });
  }

  logger.info(`Stream stopped: ${id} by user ${req.userId}`);

  res.json({
    success: true,
    message: 'Stream stopped successfully',
    data: { stream },
  });
}));

/**
 * GET /api/streams/:id/analytics
 * Get stream analytics
 */
router.get('/:id/analytics', authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Verify stream ownership
  const { data: stream } = await supabase
    .from('streams')
    .select('id')
    .eq('id', id)
    .eq('user_id', req.userId)
    .single();

  if (!stream) {
    return res.status(404).json({
      success: false,
      error: 'Stream not found',
    });
  }

  // Get metrics
  const { data: metrics, error } = await supabase
    .from('stream_metrics')
    .select('*')
    .eq('stream_id', id)
    .order('recorded_at', { ascending: false });

  if (error) {
    logger.error('Failed to fetch stream metrics:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics',
    });
  }

  // Aggregate metrics
  const aggregated = metrics.reduce((acc, m) => ({
    total_viewers: acc.total_viewers + m.viewers_total,
    peak_viewers: Math.max(acc.peak_viewers, m.viewers_peak),
    total_likes: acc.total_likes + m.likes,
    total_shares: acc.total_shares + m.shares,
    total_comments: acc.total_comments + m.comments,
    total_watch_time: acc.total_watch_time + m.watch_time_minutes,
    total_revenue: acc.total_revenue + parseFloat(m.revenue_amount),
  }), {
    total_viewers: 0,
    peak_viewers: 0,
    total_likes: 0,
    total_shares: 0,
    total_comments: 0,
    total_watch_time: 0,
    total_revenue: 0,
  });

  res.json({
    success: true,
    data: {
      aggregated,
      metrics,
    },
  });
}));

/**
 * DELETE /api/streams/:id
 * Delete stream
 */
router.delete('/:id', authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('streams')
    .delete()
    .eq('id', id)
    .eq('user_id', req.userId);

  if (error) {
    logger.error('Failed to delete stream:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete stream',
    });
  }

  logger.info(`Stream deleted: ${id} by user ${req.userId}`);

  res.json({
    success: true,
    message: 'Stream deleted successfully',
  });
}));

export default router;
