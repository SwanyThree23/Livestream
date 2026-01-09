import express from 'express';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import config from '../config/index.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticateToken } from '../middleware/auth.js';
import logger from '../utils/logger.js';

const router = express.Router();
const supabase = createClient(config.supabase.url, config.supabase.serviceKey);

const updateProfileSchema = z.object({
  username: z.string().min(3).max(50).optional(),
  bio: z.string().max(500).optional(),
  avatar_url: z.string().url().optional(),
});

/**
 * GET /api/users/profile
 * Get current user profile
 */
router.get('/profile', authenticateToken, asyncHandler(async (req, res) => {
  const { data: user, error } = await supabase
    .from('users')
    .select('id, email, username, role, subscription_tier, avatar_url, bio, created_at, last_login')
    .eq('id', req.userId)
    .single();

  if (error) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }

  res.json({ success: true, data: { user } });
}));

/**
 * PUT /api/users/profile
 * Update user profile
 */
router.put('/profile', authenticateToken, asyncHandler(async (req, res) => {
  const validatedData = updateProfileSchema.parse(req.body);

  const { data: user, error } = await supabase
    .from('users')
    .update(validatedData)
    .eq('id', req.userId)
    .select('id, email, username, role, subscription_tier, avatar_url, bio')
    .single();

  if (error) {
    logger.error('Failed to update profile:', error);
    return res.status(500).json({ success: false, error: 'Failed to update profile' });
  }

  res.json({ success: true, message: 'Profile updated successfully', data: { user } });
}));

/**
 * GET /api/users/oauth-connections
 * Get user's OAuth connections
 */
router.get('/oauth-connections', authenticateToken, asyncHandler(async (req, res) => {
  const { data: connections, error } = await supabase
    .from('oauth_connections')
    .select('id, provider, is_active, created_at')
    .eq('user_id', req.userId);

  if (error) {
    return res.status(500).json({ success: false, error: 'Failed to fetch connections' });
  }

  res.json({ success: true, data: { connections } });
}));

export default router;
