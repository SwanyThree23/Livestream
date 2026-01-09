import express from 'express';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import config from '../config/index.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const supabase = createClient(config.supabase.url, config.supabase.serviceKey);

const createContentSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  type: z.enum(['video', 'audio', 'image', 'document']),
  file_url: z.string().url(),
  thumbnail_url: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
});

/**
 * GET /api/content
 * List user content
 */
router.get('/', authenticateToken, asyncHandler(async (req, res) => {
  const { type, status = 'active', page = 1, limit = 20 } = req.query;

  let query = supabase
    .from('content')
    .select('*', { count: 'exact' })
    .eq('user_id', req.userId)
    .eq('status', status)
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (type) {
    query = query.eq('type', type);
  }

  const { data: content, error, count } = await query;

  if (error) {
    return res.status(500).json({ success: false, error: 'Failed to fetch content' });
  }

  res.json({
    success: true,
    data: {
      content,
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
 * POST /api/content
 * Create content item
 */
router.post('/', authenticateToken, asyncHandler(async (req, res) => {
  const validatedData = createContentSchema.parse(req.body);

  const { data: content, error } = await supabase
    .from('content')
    .insert({ ...validatedData, user_id: req.userId, status: 'active' })
    .select()
    .single();

  if (error) {
    return res.status(500).json({ success: false, error: 'Failed to create content' });
  }

  res.status(201).json({ success: true, data: { content } });
}));

/**
 * DELETE /api/content/:id
 * Delete content item
 */
router.delete('/:id', authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('content')
    .update({ status: 'deleted' })
    .eq('id', id)
    .eq('user_id', req.userId);

  if (error) {
    return res.status(500).json({ success: false, error: 'Failed to delete content' });
  }

  res.json({ success: true, message: 'Content deleted successfully' });
}));

export default router;
