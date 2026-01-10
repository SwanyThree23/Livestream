import express from 'express';
import { z } from 'zod';
import { RtmpConfigModel } from '../models/index.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticateToken } from '../middleware/auth.js';
import logger from '../utils/logger.js';

const router = express.Router();

/**
 * Validation schemas
 */
const createRtmpConfigSchema = z.object({
  name: z.string().min(1).max(255),
  server: z.string().url().or(z.string().startsWith('rtmp://')).or(z.string().startsWith('rtmps://')),
  stream_key: z.string().min(1),
  token: z.string().optional(),
  enabled: z.boolean().default(true),
});

const updateRtmpConfigSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  server: z.string().url().or(z.string().startsWith('rtmp://')).or(z.string().startsWith('rtmps://')).optional(),
  stream_key: z.string().min(1).optional(),
  token: z.string().optional().nullable(),
  enabled: z.boolean().optional(),
});

/**
 * GET /api/rtmp-configs
 * List all RTMP configurations for the authenticated user
 */
router.get('/', authenticateToken, asyncHandler(async (req, res) => {
  const configs = await RtmpConfigModel.findByUserId(req.userId);

  res.json({
    success: true,
    data: { configs },
  });
}));

/**
 * GET /api/rtmp-configs/:id
 * Get a specific RTMP configuration
 */
router.get('/:id', authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params;

  const config = await RtmpConfigModel.findById(id, req.userId);

  if (!config) {
    return res.status(404).json({
      success: false,
      error: 'RTMP configuration not found',
    });
  }

  res.json({
    success: true,
    data: { config },
  });
}));

/**
 * POST /api/rtmp-configs
 * Create a new RTMP configuration
 */
router.post('/', authenticateToken, asyncHandler(async (req, res) => {
  const validatedData = createRtmpConfigSchema.parse(req.body);

  const config = await RtmpConfigModel.create({
    ...validatedData,
    user_id: req.userId,
  });

  logger.info(`RTMP config created: ${config.id} by user ${req.userId}`);

  res.status(201).json({
    success: true,
    message: 'RTMP configuration created successfully',
    data: { config },
  });
}));

/**
 * PATCH /api/rtmp-configs/:id
 * Update an RTMP configuration
 */
router.patch('/:id', authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const validatedData = updateRtmpConfigSchema.parse(req.body);

  const config = await RtmpConfigModel.update(id, req.userId, validatedData);

  if (!config) {
    return res.status(404).json({
      success: false,
      error: 'RTMP configuration not found',
    });
  }

  logger.info(`RTMP config updated: ${id} by user ${req.userId}`);

  res.json({
    success: true,
    message: 'RTMP configuration updated successfully',
    data: { config },
  });
}));

/**
 * DELETE /api/rtmp-configs/:id
 * Delete an RTMP configuration
 */
router.delete('/:id', authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params;

  await RtmpConfigModel.delete(id, req.userId);

  logger.info(`RTMP config deleted: ${id} by user ${req.userId}`);

  res.json({
    success: true,
    message: 'RTMP configuration deleted successfully',
  });
}));

export default router;
