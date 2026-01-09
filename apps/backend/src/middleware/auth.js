import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(config.supabase.url, config.supabase.serviceKey);

/**
 * Custom error class for authentication errors
 */
export class AuthError extends Error {
  constructor(message, statusCode = 401) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AuthError';
  }
}

/**
 * Middleware to verify JWT token and attach user to request
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next function
 */
export const authenticateToken = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : null;

    if (!token) {
      throw new AuthError('No token provided');
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, config.jwt.secret);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new AuthError('Token expired', 401);
      }
      throw new AuthError('Invalid token', 401);
    }

    // Fetch user from database
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, username, role, subscription_tier, is_active, created_at')
      .eq('id', decoded.userId)
      .single();

    if (error || !user) {
      throw new AuthError('User not found', 404);
    }

    if (!user.is_active) {
      throw new AuthError('Account is inactive', 403);
    }

    // Attach user to request
    req.user = user;
    req.userId = user.id;

    next();
  } catch (error) {
    if (error instanceof AuthError) {
      return res.status(error.statusCode).json({
        success: false,
        error: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      error: 'Authentication failed',
    });
  }
};

/**
 * Middleware to check if user has required role
 * @param {string[]} allowedRoles - Array of allowed roles
 * @returns {Function} Express middleware function
 */
export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
      });
    }

    next();
  };
};

/**
 * Middleware to check if user has required subscription tier
 * @param {string[]} requiredTiers - Array of required subscription tiers
 * @returns {Function} Express middleware function
 */
export const requireSubscription = (requiredTiers) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    const tierHierarchy = ['free', 'basic', 'pro', 'enterprise'];
    const userTierIndex = tierHierarchy.indexOf(req.user.subscription_tier);
    const requiredTierIndex = Math.min(...requiredTiers.map(t => tierHierarchy.indexOf(t)));

    if (userTierIndex < requiredTierIndex) {
      return res.status(403).json({
        success: false,
        error: 'Subscription upgrade required',
        required_tier: tierHierarchy[requiredTierIndex],
        current_tier: req.user.subscription_tier,
      });
    }

    next();
  };
};

/**
 * Optional authentication - attaches user if token is valid, but doesn't require it
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : null;

    if (token) {
      const decoded = jwt.verify(token, config.jwt.secret);
      const { data: user } = await supabase
        .from('users')
        .select('id, email, username, role, subscription_tier')
        .eq('id', decoded.userId)
        .single();

      if (user) {
        req.user = user;
        req.userId = user.id;
      }
    }
  } catch (error) {
    // Silently fail for optional auth
  }

  next();
};

/**
 * WebSocket authentication middleware
 * @param {Socket} socket - Socket.io socket object
 * @param {Function} next - Next function
 */
export const authenticateSocket = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.query.token;

    if (!token) {
      return next(new Error('Authentication token required'));
    }

    const decoded = jwt.verify(token, config.jwt.secret);

    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, username, role, subscription_tier')
      .eq('id', decoded.userId)
      .single();

    if (error || !user) {
      return next(new Error('User not found'));
    }

    socket.user = user;
    socket.userId = user.id;

    next();
  } catch (error) {
    next(new Error('Authentication failed'));
  }
};
