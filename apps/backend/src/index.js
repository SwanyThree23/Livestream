import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import config from './config/index.js';
import logger from './utils/logger.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { metricsMiddleware } from './middleware/metrics.js';

// Import routes
import authRoutes from './routes/auth.js';
import streamsRoutes from './routes/streams.js';
import aiRoutes from './routes/ai.js';
import usersRoutes from './routes/users.js';
import contentRoutes from './routes/content.js';
import monetizationRoutes from './routes/monetization.js';
import webhooksRoutes from './routes/webhooks.js';
import vdoninjaRoutes from './routes/vdoninja.js';

// Import socket handlers
import { setupStreamSocket } from './sockets/streamSocket.js';
import { setupChatSocket } from './sockets/chatSocket.js';
import { setupNotificationSocket } from './sockets/notificationSocket.js';
import { authenticateSocket } from './middleware/auth.js';

/**
 * Initialize Express app
 */
const app = express();
const httpServer = createServer(app);

/**
 * Initialize Socket.io with CORS
 */
const io = new Server(httpServer, {
  cors: {
    origin: config.cors.origins,
    credentials: config.cors.credentials,
  },
  transports: ['websocket', 'polling'],
});

/**
 * Security Middleware - Helmet.js with CSP policies
 */
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", ...config.cors.origins],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

/**
 * CORS Configuration
 */
app.use(cors({
  origin: config.cors.origins,
  credentials: config.cors.credentials,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

/**
 * Compression Middleware
 */
app.use(compression());

/**
 * Body Parsing Middleware (10MB limit)
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/**
 * Metrics Middleware - Track request/response times
 */
app.use(metricsMiddleware);

/**
 * Rate Limiting - 100 requests per 15 minutes
 */
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

/**
 * Health Check Endpoint
 */
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.nodeEnv,
  });
});

/**
 * API Routes
 */
app.use('/api/auth', authRoutes);
app.use('/api/streams', streamsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/monetization', monetizationRoutes);
app.use('/api/webhooks', webhooksRoutes);
app.use('/api/vdoninja', vdoninjaRoutes);

/**
 * Root endpoint
 */
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'SwanyThree Ultimate API',
    version: '1.0.0',
    documentation: '/api/docs',
  });
});

/**
 * WebSocket Authentication Middleware
 */
io.use(authenticateSocket);

/**
 * Setup WebSocket Namespaces
 */
const streamNamespace = io.of('/streams');
const chatNamespace = io.of('/chat');
const notificationNamespace = io.of('/notifications');

// Apply authentication to all namespaces
streamNamespace.use(authenticateSocket);
chatNamespace.use(authenticateSocket);
notificationNamespace.use(authenticateSocket);

// Setup socket handlers
setupStreamSocket(streamNamespace);
setupChatSocket(chatNamespace);
setupNotificationSocket(notificationNamespace);

/**
 * 404 Not Found Handler
 */
app.use(notFoundHandler);

/**
 * Error Handler - Must be last
 */
app.use(errorHandler);

/**
 * Graceful Shutdown Handler
 */
const gracefulShutdown = async (signal) => {
  logger.info(`${signal} received, shutting down gracefully`);

  // Close HTTP server
  httpServer.close(() => {
    logger.info('HTTP server closed');

    // Close WebSocket connections
    io.close(() => {
      logger.info('WebSocket server closed');

      // Exit process
      process.exit(0);
    });
  });

  // Force shutdown after 30 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 30000);
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

/**
 * Start Server
 */
const PORT = config.port;

httpServer.listen(PORT, () => {
  logger.info(`🚀 SwanyThree Ultimate Backend started`);
  logger.info(`📡 Server: http://localhost:${PORT}`);
  logger.info(`🌍 Environment: ${config.nodeEnv}`);
  logger.info(`🔌 WebSocket: ws://localhost:${PORT}`);
  logger.info(`💡 Health Check: http://localhost:${PORT}/health`);
});

// Export for testing
export { app, io };
