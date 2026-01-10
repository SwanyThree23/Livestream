import express from 'express';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import config from '../config/index.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticateToken } from '../middleware/auth.js';
import logger from '../utils/logger.js';

const router = express.Router();
const supabase = createClient(config.supabase.url, config.supabase.serviceKey);

/**
 * Validation schema for VDO.Ninja room
 */
const createRoomSchema = z.object({
  name: z.string().min(3).max(50),
  workflow: z.string(),
  links: z.object({
    hostDirector: z.string().url().optional(),
    guestLink: z.string().url().optional(),
    guestLinks: z.array(z.object({
      label: z.string(),
      url: z.string().url(),
    })).optional(),
    obsViewer: z.string().url().optional(),
    obsVideoViewer: z.string().url().optional(),
    obsAudioViewer: z.string().url().optional(),
  }),
  instructions: z.array(z.string()).optional(),
});

/**
 * GET /api/vdoninja/rooms
 * List user's VDO.Ninja rooms
 */
router.get('/rooms', authenticateToken, asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  const { data: rooms, error, count } = await supabase
    .from('vdoninja_rooms')
    .select('*', { count: 'exact' })
    .eq('user_id', req.userId)
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (error) {
    logger.error('Failed to fetch VDO.Ninja rooms:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch rooms',
    });
  }

  res.json({
    success: true,
    data: {
      rooms,
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
 * GET /api/vdoninja/rooms/:id
 * Get specific room
 */
router.get('/rooms/:id', authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { data: room, error } = await supabase
    .from('vdoninja_rooms')
    .select('*')
    .eq('id', id)
    .eq('user_id', req.userId)
    .single();

  if (error || !room) {
    return res.status(404).json({
      success: false,
      error: 'Room not found',
    });
  }

  res.json({
    success: true,
    data: { room },
  });
}));

/**
 * POST /api/vdoninja/rooms
 * Create new VDO.Ninja room
 */
router.post('/rooms', authenticateToken, asyncHandler(async (req, res) => {
  const validatedData = createRoomSchema.parse(req.body);

  const { data: room, error } = await supabase
    .from('vdoninja_rooms')
    .insert({
      ...validatedData,
      user_id: req.userId,
      is_active: true,
    })
    .select()
    .single();

  if (error) {
    logger.error('Failed to create VDO.Ninja room:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create room',
    });
  }

  logger.info(`VDO.Ninja room created: ${room.id} by user ${req.userId}`);

  res.status(201).json({
    success: true,
    message: 'Room created successfully',
    data: { room },
  });
}));

/**
 * PUT /api/vdoninja/rooms/:id
 * Update VDO.Ninja room
 */
router.put('/rooms/:id', authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const { data: room, error } = await supabase
    .from('vdoninja_rooms')
    .update(updates)
    .eq('id', id)
    .eq('user_id', req.userId)
    .select()
    .single();

  if (error) {
    logger.error('Failed to update VDO.Ninja room:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update room',
    });
  }

  res.json({
    success: true,
    message: 'Room updated successfully',
    data: { room },
  });
}));

/**
 * DELETE /api/vdoninja/rooms/:id
 * Delete VDO.Ninja room
 */
router.delete('/rooms/:id', authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('vdoninja_rooms')
    .delete()
    .eq('id', id)
    .eq('user_id', req.userId);

  if (error) {
    logger.error('Failed to delete VDO.Ninja room:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete room',
    });
  }

  logger.info(`VDO.Ninja room deleted: ${id} by user ${req.userId}`);

  res.json({
    success: true,
    message: 'Room deleted successfully',
  });
}));

/**
 * GET /api/vdoninja/templates
 * Get available VDO.Ninja templates and workflows
 */
router.get('/templates', asyncHandler(async (req, res) => {
  // Return predefined templates
  const templates = {
    guest: {
      professionalGuest: {
        name: 'Professional Guest',
        description: 'High quality, low latency for professional interviews',
        params: { quality: 2, stereo: 1, bitrate: 5000 }
      },
      gamingGuest: {
        name: 'Gaming Stream',
        description: 'Optimized for high-motion gaming content',
        params: { quality: 2, framerate: 60, bitrate: 8000 }
      },
      podcastGuest: {
        name: 'Podcast Guest',
        description: 'Audio-focused with optional screen share',
        params: { quality: 1, audiobitrate: 256, screenshare: 1 }
      },
      mobileGuest: {
        name: 'Mobile Guest',
        description: 'Optimized for mobile connections',
        params: { quality: 0, bitrate: 2500, framerate: 30 }
      },
    },
    workflows: {
      interview: {
        name: 'One-on-One Interview',
        description: 'Host interviews single guest',
      },
      panel: {
        name: 'Panel Discussion',
        description: 'Multiple guests in discussion',
      },
      podcast: {
        name: 'Podcast with Screen Share',
        description: 'Audio-focused with optional screen sharing',
      },
      gaming: {
        name: 'Gaming Stream Co-op',
        description: 'Gaming with remote co-host',
      },
    },
  };

  res.json({
    success: true,
    data: templates,
  });
}));

export default router;
