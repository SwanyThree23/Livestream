import express from 'express';
import { z } from 'zod';
import { WebsourceModel } from '../models/index.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticateToken } from '../middleware/auth.js';
import logger from '../utils/logger.js';

const router = express.Router();

/**
 * Validation schemas
 */
const createWebsourceSchema = z.object({
  name: z.string().min(1).max(255),
  url: z.string().url(),
  width: z.number().int().positive().default(1920),
  height: z.number().int().positive().default(1080),
  enabled: z.boolean().default(true),
});

const updateWebsourceSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  url: z.string().url().optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  enabled: z.boolean().optional(),
});

/**
 * GET /api/websources
 * List all websources for the authenticated user
 */
router.get('/', authenticateToken, asyncHandler(async (req, res) => {
  const websources = await WebsourceModel.findByUserId(req.userId);

  res.json({
    success: true,
    data: { websources },
  });
}));

/**
 * GET /api/websources/:id
 * Get a specific websource
 */
router.get('/:id', authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params;

  const websource = await WebsourceModel.findById(id, req.userId);

  if (!websource) {
    return res.status(404).json({
      success: false,
      error: 'Websource not found',
    });
  }

  res.json({
    success: true,
    data: { websource },
  });
}));

/**
 * POST /api/websources
 * Create a new websource
 */
router.post('/', authenticateToken, asyncHandler(async (req, res) => {
  const validatedData = createWebsourceSchema.parse(req.body);

  const websource = await WebsourceModel.create({
    ...validatedData,
    user_id: req.userId,
  });

  logger.info(`Websource created: ${websource.id} by user ${req.userId}`);

  res.status(201).json({
    success: true,
    message: 'Websource created successfully',
    data: { websource },
  });
}));

/**
 * PATCH /api/websources/:id
 * Update a websource
 */
router.patch('/:id', authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const validatedData = updateWebsourceSchema.parse(req.body);

  const websource = await WebsourceModel.update(id, req.userId, validatedData);

  if (!websource) {
    return res.status(404).json({
      success: false,
      error: 'Websource not found',
    });
  }

  logger.info(`Websource updated: ${id} by user ${req.userId}`);

  res.json({
    success: true,
    message: 'Websource updated successfully',
    data: { websource },
  });
}));

/**
 * DELETE /api/websources/:id
 * Delete a websource
 */
router.delete('/:id', authenticateToken, asyncHandler(async (req, res) => {
  const { id } = req.params;

  await WebsourceModel.delete(id, req.userId);

  logger.info(`Websource deleted: ${id} by user ${req.userId}`);

  res.json({
    success: true,
    message: 'Websource deleted successfully',
  });
}));

export default router;
