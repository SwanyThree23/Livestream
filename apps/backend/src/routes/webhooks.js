import express from 'express';
import { createClient } from '@supabase/supabase-js';
import config from '../config/index.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import logger from '../utils/logger.js';

const router = express.Router();
const supabase = createClient(config.supabase.url, config.supabase.serviceKey);

/**
 * POST /api/webhooks/stripe
 * Handle Stripe webhooks
 */
router.post('/stripe', express.raw({ type: 'application/json' }), asyncHandler(async (req, res) => {
  const event = req.body;

  logger.info(`Stripe webhook received: ${event.type}`);

  // Log webhook
  await supabase.from('webhooks').insert({
    source: 'stripe',
    event_type: event.type,
    payload: event,
    processed: false,
  });

  // Handle specific events
  switch (event.type) {
    case 'checkout.session.completed':
      // Handle successful subscription
      break;
    case 'customer.subscription.updated':
      // Handle subscription updates
      break;
    case 'customer.subscription.deleted':
      // Handle subscription cancellation
      break;
  }

  res.json({ received: true });
}));

/**
 * POST /api/webhooks/:provider
 * Generic webhook handler for streaming platforms
 */
router.post('/:provider', asyncHandler(async (req, res) => {
  const { provider } = req.params;
  const payload = req.body;

  logger.info(`Webhook received from ${provider}`);

  // Log webhook
  await supabase.from('webhooks').insert({
    source: provider,
    event_type: payload.event || 'unknown',
    payload,
    processed: false,
  });

  res.json({ received: true });
}));

export default router;
