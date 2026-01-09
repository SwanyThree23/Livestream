import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Environment variable schema with Zod validation
 * Ensures all required configuration is present before app starts
 */
const envSchema = z.object({
  // Server Config
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).pipe(z.number().positive()).default('3001'),

  // Supabase Config (Required)
  SUPABASE_URL: z.string().url('Invalid Supabase URL'),
  SUPABASE_ANON_KEY: z.string().min(1, 'Supabase anon key required'),
  SUPABASE_SERVICE_KEY: z.string().min(1, 'Supabase service key required'),

  // JWT Config (Required)
  JWT_SECRET: z.string().min(32, 'JWT secret must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),

  // Anthropic Claude Config (Required)
  ANTHROPIC_API_KEY: z.string().startsWith('sk-ant-', 'Invalid Anthropic API key'),

  // Stripe Config (Optional)
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  // Redis Config (Optional)
  REDIS_URL: z.string().url().optional(),

  // CORS & Frontend Config
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),
  CORS_ORIGINS: z.string().default('http://localhost:5173'),

  // OAuth Providers (Optional)
  TWITCH_CLIENT_ID: z.string().optional(),
  TWITCH_CLIENT_SECRET: z.string().optional(),
  YOUTUBE_CLIENT_ID: z.string().optional(),
  YOUTUBE_CLIENT_SECRET: z.string().optional(),
  FACEBOOK_APP_ID: z.string().optional(),
  FACEBOOK_APP_SECRET: z.string().optional(),
  TWITTER_API_KEY: z.string().optional(),
  TWITTER_API_SECRET: z.string().optional(),
  TIKTOK_CLIENT_KEY: z.string().optional(),
  TIKTOK_CLIENT_SECRET: z.string().optional(),
  INSTAGRAM_CLIENT_ID: z.string().optional(),
  INSTAGRAM_CLIENT_SECRET: z.string().optional(),
  LINKEDIN_CLIENT_ID: z.string().optional(),
  LINKEDIN_CLIENT_SECRET: z.string().optional(),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('900000'), // 15 min
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default('100'),

  // File Upload
  MAX_FILE_SIZE: z.string().transform(Number).default('10485760'), // 10MB
});

/**
 * Parse and validate environment variables
 * Throws an error if validation fails
 */
let config;
try {
  config = envSchema.parse(process.env);
} catch (error) {
  console.error('❌ Environment variable validation failed:');
  console.error(error.errors);
  process.exit(1);
}

/**
 * Typed configuration object
 * All values are validated and type-safe
 */
export default {
  // Server
  nodeEnv: config.NODE_ENV,
  port: config.PORT,
  isDevelopment: config.NODE_ENV === 'development',
  isProduction: config.NODE_ENV === 'production',

  // Supabase
  supabase: {
    url: config.SUPABASE_URL,
    anonKey: config.SUPABASE_ANON_KEY,
    serviceKey: config.SUPABASE_SERVICE_KEY,
  },

  // JWT
  jwt: {
    secret: config.JWT_SECRET,
    expiresIn: config.JWT_EXPIRES_IN,
    refreshExpiresIn: config.JWT_REFRESH_EXPIRES_IN,
  },

  // Anthropic
  anthropic: {
    apiKey: config.ANTHROPIC_API_KEY,
  },

  // Stripe
  stripe: {
    secretKey: config.STRIPE_SECRET_KEY,
    webhookSecret: config.STRIPE_WEBHOOK_SECRET,
  },

  // Redis
  redis: {
    url: config.REDIS_URL,
  },

  // CORS
  cors: {
    origins: config.CORS_ORIGINS.split(',').map(o => o.trim()),
    credentials: true,
  },

  // Frontend
  frontendUrl: config.FRONTEND_URL,

  // OAuth
  oauth: {
    twitch: {
      clientId: config.TWITCH_CLIENT_ID,
      clientSecret: config.TWITCH_CLIENT_SECRET,
      redirectUri: `${config.FRONTEND_URL}/auth/callback/twitch`,
    },
    youtube: {
      clientId: config.YOUTUBE_CLIENT_ID,
      clientSecret: config.YOUTUBE_CLIENT_SECRET,
      redirectUri: `${config.FRONTEND_URL}/auth/callback/youtube`,
    },
    facebook: {
      appId: config.FACEBOOK_APP_ID,
      appSecret: config.FACEBOOK_APP_SECRET,
      redirectUri: `${config.FRONTEND_URL}/auth/callback/facebook`,
    },
    twitter: {
      apiKey: config.TWITTER_API_KEY,
      apiSecret: config.TWITTER_API_SECRET,
      redirectUri: `${config.FRONTEND_URL}/auth/callback/twitter`,
    },
    tiktok: {
      clientKey: config.TIKTOK_CLIENT_KEY,
      clientSecret: config.TIKTOK_CLIENT_SECRET,
      redirectUri: `${config.FRONTEND_URL}/auth/callback/tiktok`,
    },
    instagram: {
      clientId: config.INSTAGRAM_CLIENT_ID,
      clientSecret: config.INSTAGRAM_CLIENT_SECRET,
      redirectUri: `${config.FRONTEND_URL}/auth/callback/instagram`,
    },
    linkedin: {
      clientId: config.LINKEDIN_CLIENT_ID,
      clientSecret: config.LINKEDIN_CLIENT_SECRET,
      redirectUri: `${config.FRONTEND_URL}/auth/callback/linkedin`,
    },
  },

  // Rate Limiting
  rateLimit: {
    windowMs: config.RATE_LIMIT_WINDOW_MS,
    max: config.RATE_LIMIT_MAX_REQUESTS,
  },

  // File Upload
  maxFileSize: config.MAX_FILE_SIZE,
};
