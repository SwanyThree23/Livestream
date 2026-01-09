import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import config from '../config/index.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticateToken } from '../middleware/auth.js';
import logger from '../utils/logger.js';

const router = express.Router();
const supabase = createClient(config.supabase.url, config.supabase.serviceKey);

/**
 * Validation schemas
 */
const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password required'),
});

/**
 * Generate JWT token
 */
const generateToken = (userId) => {
  return jwt.sign({ userId }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, config.jwt.secret, {
    expiresIn: config.jwt.refreshExpiresIn,
  });
};

/**
 * POST /api/auth/register
 * Register new user account
 */
router.post('/register', asyncHandler(async (req, res) => {
  // Validate request body
  const validatedData = registerSchema.parse(req.body);
  const { email, username, password } = validatedData;

  // Check if user already exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .or(`email.eq.${email},username.eq.${username}`)
    .single();

  if (existingUser) {
    return res.status(400).json({
      success: false,
      error: 'Email or username already exists',
    });
  }

  // Hash password (12 rounds)
  const passwordHash = await bcrypt.hash(password, 12);

  // Create user
  const { data: user, error } = await supabase
    .from('users')
    .insert({
      email,
      username,
      password_hash: passwordHash,
      role: 'user',
      subscription_tier: 'free',
      is_active: true,
    })
    .select('id, email, username, role, subscription_tier, created_at')
    .single();

  if (error) {
    logger.error('User registration failed:', error);
    return res.status(500).json({
      success: false,
      error: 'Registration failed',
    });
  }

  // Generate tokens
  const token = generateToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  logger.info(`New user registered: ${user.email}`);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user,
      token,
      refreshToken,
    },
  });
}));

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', asyncHandler(async (req, res) => {
  // Validate request body
  const validatedData = loginSchema.parse(req.body);
  const { email, password } = validatedData;

  // Find user
  const { data: user, error } = await supabase
    .from('users')
    .select('id, email, username, password_hash, role, subscription_tier, is_active')
    .eq('email', email)
    .single();

  if (error || !user) {
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials',
    });
  }

  // Check if account is active
  if (!user.is_active) {
    return res.status(403).json({
      success: false,
      error: 'Account is inactive',
    });
  }

  // Verify password
  const passwordMatch = await bcrypt.compare(password, user.password_hash);

  if (!passwordMatch) {
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials',
    });
  }

  // Update last login
  await supabase
    .from('users')
    .update({ last_login: new Date().toISOString() })
    .eq('id', user.id);

  // Generate tokens
  const token = generateToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  // Remove password hash from response
  delete user.password_hash;

  logger.info(`User logged in: ${user.email}`);

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user,
      token,
      refreshToken,
    },
  });
}));

/**
 * GET /api/auth/me
 * Get current user profile
 */
router.get('/me', authenticateToken, asyncHandler(async (req, res) => {
  const { data: user, error } = await supabase
    .from('users')
    .select('id, email, username, role, subscription_tier, avatar_url, bio, created_at')
    .eq('id', req.userId)
    .single();

  if (error || !user) {
    return res.status(404).json({
      success: false,
      error: 'User not found',
    });
  }

  res.json({
    success: true,
    data: { user },
  });
}));

/**
 * POST /api/auth/refresh
 * Refresh JWT token
 */
router.post('/refresh', asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      error: 'Refresh token required',
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, config.jwt.secret);

    // Generate new tokens
    const newToken = generateToken(decoded.userId);
    const newRefreshToken = generateRefreshToken(decoded.userId);

    res.json({
      success: true,
      data: {
        token: newToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Invalid refresh token',
    });
  }
}));

/**
 * POST /api/auth/logout
 * Logout user (client should clear tokens)
 */
router.post('/logout', authenticateToken, asyncHandler(async (req, res) => {
  logger.info(`User logged out: ${req.user.email}`);

  res.json({
    success: true,
    message: 'Logout successful',
  });
}));

/**
 * GET /api/auth/oauth/:provider/callback
 * OAuth callback handler (placeholder - implement specific provider logic)
 */
router.get('/oauth/:provider/callback', asyncHandler(async (req, res) => {
  const { provider } = req.params;
  const { code } = req.query;

  // This is a placeholder - implement specific OAuth logic for each provider
  logger.info(`OAuth callback received for ${provider}`);

  res.redirect(`${config.frontendUrl}/auth/callback?provider=${provider}&code=${code}`);
}));

export default router;
