import express from 'express';
import { z } from 'zod';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import config from '../config/index.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authenticateToken, requireSubscription } from '../middleware/auth.js';
import logger from '../utils/logger.js';

const router = express.Router();
const supabase = createClient(config.supabase.url, config.supabase.serviceKey);
const anthropic = new Anthropic({
  apiKey: config.anthropic.apiKey,
});

/**
 * Validation schemas
 */
const podcastSchema = z.object({
  topic: z.string().min(1).max(500),
  duration: z.enum(['5', '10', '15', '20', '30']).default('10'),
  tone: z.enum(['professional', 'casual', 'entertaining', 'educational']).default('professional'),
  speakers: z.enum(['1', '2', '3']).default('2'),
});

const contentIdeasSchema = z.object({
  niche: z.string().min(1).max(200),
  platform: z.enum(['twitch', 'youtube', 'facebook', 'twitter', 'tiktok', 'instagram', 'linkedin']),
  count: z.number().min(1).max(20).default(10),
});

const optimizeSchema = z.object({
  content: z.string().min(1),
  platform: z.enum(['twitch', 'youtube', 'facebook', 'twitter', 'tiktok', 'instagram', 'linkedin']),
  goal: z.enum(['engagement', 'views', 'conversions', 'shares']).default('engagement'),
});

const chatSchema = z.object({
  message: z.string().min(1).max(2000),
  conversationId: z.string().uuid().optional(),
});

/**
 * POST /api/ai/podcast/generate
 * Generate podcast script using Claude Sonnet 4
 */
router.post('/podcast/generate', authenticateToken, requireSubscription(['basic', 'pro', 'enterprise']), asyncHandler(async (req, res) => {
  const validatedData = podcastSchema.parse(req.body);
  const { topic, duration, tone, speakers } = validatedData;

  const prompt = `You are a professional podcast script writer. Create a ${duration}-minute podcast script about "${topic}" with ${speakers} speaker(s) in a ${tone} tone.

Include:
1. Engaging intro with hook
2. Main content sections with dialogue
3. Natural transitions
4. Memorable outro

Format: Use [SPEAKER 1], [SPEAKER 2] labels. Include stage directions in (parentheses).`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [{
        role: 'user',
        content: prompt,
      }],
    });

    const generatedScript = message.content[0].text;
    const tokensUsed = message.usage.input_tokens + message.usage.output_tokens;

    // Save to database
    const { data: aiContent, error } = await supabase
      .from('ai_content')
      .insert({
        user_id: req.userId,
        type: 'podcast',
        prompt,
        generated_content: generatedScript,
        tokens_used: tokensUsed,
        model: 'claude-sonnet-4',
        metadata: { topic, duration, tone, speakers },
        status: 'completed',
      })
      .select()
      .single();

    if (error) {
      logger.error('Failed to save AI content:', error);
    }

    logger.info(`Podcast generated for user ${req.userId}, tokens: ${tokensUsed}`);

    res.json({
      success: true,
      data: {
        script: generatedScript,
        metadata: {
          topic,
          duration,
          tone,
          speakers,
          tokensUsed,
        },
      },
    });
  } catch (error) {
    logger.error('Claude API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate podcast script',
    });
  }
}));

/**
 * POST /api/ai/content/ideas
 * Generate content ideas for specific niche and platform
 */
router.post('/content/ideas', authenticateToken, asyncHandler(async (req, res) => {
  const validatedData = contentIdeasSchema.parse(req.body);
  const { niche, platform, count } = validatedData;

  const prompt = `Generate ${count} viral content ideas for ${platform} in the ${niche} niche. For each idea, provide:
1. Title/Hook
2. Brief description (2-3 sentences)
3. Target audience
4. Expected engagement potential (high/medium/low)

Format as JSON array.`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: prompt,
      }],
    });

    const generatedIdeas = message.content[0].text;
    const tokensUsed = message.usage.input_tokens + message.usage.output_tokens;

    // Save to database
    await supabase
      .from('ai_content')
      .insert({
        user_id: req.userId,
        type: 'idea',
        prompt,
        generated_content: generatedIdeas,
        tokens_used: tokensUsed,
        model: 'claude-sonnet-4',
        metadata: { niche, platform, count },
        status: 'completed',
      });

    logger.info(`Content ideas generated for user ${req.userId}`);

    res.json({
      success: true,
      data: {
        ideas: generatedIdeas,
        metadata: { niche, platform, count },
      },
    });
  } catch (error) {
    logger.error('Claude API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate content ideas',
    });
  }
}));

/**
 * POST /api/ai/content/optimize
 * Optimize content for specific platform
 */
router.post('/content/optimize', authenticateToken, asyncHandler(async (req, res) => {
  const validatedData = optimizeSchema.parse(req.body);
  const { content, platform, goal } = validatedData;

  const prompt = `Optimize this content for ${platform} to maximize ${goal}:

"${content}"

Provide:
1. Optimized version
2. Key changes made
3. Platform-specific tips
4. Hashtag/keyword recommendations`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [{
        role: 'user',
        content: prompt,
      }],
    });

    const optimizedContent = message.content[0].text;
    const tokensUsed = message.usage.input_tokens + message.usage.output_tokens;

    // Save to database
    await supabase
      .from('ai_content')
      .insert({
        user_id: req.userId,
        type: 'optimization',
        prompt,
        generated_content: optimizedContent,
        tokens_used: tokensUsed,
        model: 'claude-sonnet-4',
        metadata: { platform, goal },
        status: 'completed',
      });

    logger.info(`Content optimized for user ${req.userId}`);

    res.json({
      success: true,
      data: {
        optimized: optimizedContent,
        original: content,
        metadata: { platform, goal },
      },
    });
  } catch (error) {
    logger.error('Claude API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to optimize content',
    });
  }
}));

/**
 * POST /api/ai/chat
 * Conversational AI with Claude
 */
router.post('/chat', authenticateToken, asyncHandler(async (req, res) => {
  const validatedData = chatSchema.parse(req.body);
  const { message, conversationId } = validatedData;

  let conversation;
  let messages = [];

  // Get existing conversation or create new
  if (conversationId) {
    const { data } = await supabase
      .from('ai_conversations')
      .select('*')
      .eq('id', conversationId)
      .eq('user_id', req.userId)
      .single();

    if (data) {
      conversation = data;
      messages = data.messages || [];
    }
  }

  // Add user message
  messages.push({
    role: 'user',
    content: message,
    timestamp: new Date().toISOString(),
  });

  try {
    // Call Claude API
    const claudeMessages = messages.map(m => ({
      role: m.role,
      content: m.content,
    }));

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: claudeMessages,
    });

    const assistantMessage = response.content[0].text;
    const tokensUsed = response.usage.input_tokens + response.usage.output_tokens;

    // Add assistant message
    messages.push({
      role: 'assistant',
      content: assistantMessage,
      timestamp: new Date().toISOString(),
    });

    // Save conversation
    if (conversation) {
      const { data: updated } = await supabase
        .from('ai_conversations')
        .update({
          messages,
          total_tokens: (conversation.total_tokens || 0) + tokensUsed,
        })
        .eq('id', conversationId)
        .select()
        .single();

      conversation = updated;
    } else {
      const { data: created } = await supabase
        .from('ai_conversations')
        .insert({
          user_id: req.userId,
          title: message.substring(0, 100),
          messages,
          total_tokens: tokensUsed,
        })
        .select()
        .single();

      conversation = created;
    }

    res.json({
      success: true,
      data: {
        message: assistantMessage,
        conversationId: conversation.id,
        tokensUsed,
      },
    });
  } catch (error) {
    logger.error('Claude API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to process chat message',
    });
  }
}));

/**
 * GET /api/ai/usage
 * Get AI usage statistics (30-day window)
 */
router.get('/usage', authenticateToken, asyncHandler(async (req, res) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: content, error } = await supabase
    .from('ai_content')
    .select('tokens_used, type, created_at')
    .eq('user_id', req.userId)
    .gte('created_at', thirtyDaysAgo.toISOString());

  if (error) {
    logger.error('Failed to fetch AI usage:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch usage statistics',
    });
  }

  const stats = content.reduce((acc, item) => ({
    totalTokens: acc.totalTokens + (item.tokens_used || 0),
    totalRequests: acc.totalRequests + 1,
    byType: {
      ...acc.byType,
      [item.type]: (acc.byType[item.type] || 0) + 1,
    },
  }), {
    totalTokens: 0,
    totalRequests: 0,
    byType: {},
  });

  // Estimate cost (Claude pricing: ~$3/million input tokens, ~$15/million output tokens)
  // Using average estimate
  const estimatedCost = (stats.totalTokens / 1000000) * 9; // $9 per million tokens average

  res.json({
    success: true,
    data: {
      period: '30 days',
      ...stats,
      estimatedCost: estimatedCost.toFixed(2),
    },
  });
}));

export default router;
