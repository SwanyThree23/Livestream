import logger from '../utils/logger.js';

/**
 * Setup Stream WebSocket namespace
 * Handles real-time stream updates and metrics
 */
export function setupStreamSocket(io) {
  io.on('connection', (socket) => {
    logger.info(`Stream socket connected: ${socket.userId}`);

    /**
     * Join user's personal stream room
     */
    socket.on('stream:join', ({ streamId }) => {
      socket.join(`stream:${streamId}`);
      socket.join(`user:${socket.userId}`);
      logger.info(`User ${socket.userId} joined stream ${streamId}`);

      socket.emit('stream:joined', { streamId });
    });

    /**
     * Leave stream room
     */
    socket.on('stream:leave', ({ streamId }) => {
      socket.leave(`stream:${streamId}`);
      logger.info(`User ${socket.userId} left stream ${streamId}`);
    });

    /**
     * Broadcast stream status change
     */
    socket.on('stream:status', ({ streamId, status, data }) => {
      io.to(`stream:${streamId}`).emit('stream:status:update', {
        streamId,
        status,
        data,
        timestamp: new Date().toISOString(),
      });
      logger.info(`Stream ${streamId} status updated: ${status}`);
    });

    /**
     * Broadcast real-time metrics
     */
    socket.on('stream:metrics', ({ streamId, metrics }) => {
      io.to(`stream:${streamId}`).emit('stream:metrics:update', {
        streamId,
        metrics,
        timestamp: new Date().toISOString(),
      });
    });

    socket.on('disconnect', () => {
      logger.info(`Stream socket disconnected: ${socket.userId}`);
    });
  });
}
