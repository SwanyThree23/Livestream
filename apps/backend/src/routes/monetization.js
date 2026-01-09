import express from 'express';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import config from '../config/index.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticateToken } from '../middleware/auth.js';
import logger from '../utils/logger.js';

const router = express.Router();
const supabase = createClient(config.supabase.url, config.supabase.serviceKey);
const stripe = config.stripe.secretKey ? new Stripe(config.stripe.secretKey) : null;

/**
 * GET /api/monetization/subscription
 * Get current subscription
 */
router.get('/subscription', authenticateToken, asyncHandler(async (req, res) => {
  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', req.userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    return res.status(500).json({ success: false, error: 'Failed to fetch subscription' });
  }

  res.json({ success: true, data: { subscription: subscription || null } });
}));

/**
 * POST /api/monetization/create-checkout
 * Create Stripe checkout session
 */
router.post('/create-checkout', authenticateToken, asyncHandler(async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ success: false, error: 'Stripe not configured' });
  }

  const { plan } = req.body;
  const priceIds = {
    basic: 'price_basic', // Replace with actual Stripe price IDs
    pro: 'price_pro',
    enterprise: 'price_enterprise',
  };

  if (!priceIds[plan]) {
    return res.status(400).json({ success: false, error: 'Invalid plan' });
  }

  const session = await stripe.checkout.sessions.create({
    customer_email: req.user.email,
    payment_method_types: ['card'],
    line_items: [{ price: priceIds[plan], quantity: 1 }],
    mode: 'subscription',
    success_url: `${config.frontendUrl}/monetization?success=true`,
    cancel_url: `${config.frontendUrl}/monetization?cancelled=true`,
    metadata: { user_id: req.userId, plan },
  });

  res.json({ success: true, data: { url: session.url } });
}));

/**
 * POST /api/monetization/cancel-subscription
 * Cancel subscription
 */
router.post('/cancel-subscription', authenticateToken, asyncHandler(async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ success: false, error: 'Stripe not configured' });
  }

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('stripe_subscription_id')
    .eq('user_id', req.userId)
    .single();

  if (!subscription || !subscription.stripe_subscription_id) {
    return res.status(404).json({ success: false, error: 'No active subscription found' });
  }

  await stripe.subscriptions.update(subscription.stripe_subscription_id, {
    cancel_at_period_end: true,
  });

  await supabase
    .from('subscriptions')
    .update({ cancel_at_period_end: true })
    .eq('user_id', req.userId);

  res.json({ success: true, message: 'Subscription will be cancelled at period end' });
}));

export default router;
