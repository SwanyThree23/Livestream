import { createClient } from '@supabase/supabase-js';
import config from '../config/index.js';
import logger from '../utils/logger.js';

const supabase = createClient(config.supabase.url, config.supabase.serviceKey);

/**
 * Setup Notification WebSocket namespace
 * Handles real-time notification delivery
 */
export function setupNotificationSocket(io) {
  io.on('connection', (socket) => {
    logger.info(`Notification socket connected: ${socket.userId}`);

    // Join user's personal notification room
    socket.join(`notifications:${socket.userId}`);

    /**
     * Fetch unread notifications
     */
    socket.on('notifications:fetch', async ({ limit = 50 }) => {
      const { data: notifications, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', socket.userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        logger.error('Failed to fetch notifications:', error);
        socket.emit('notifications:error', { message: 'Failed to fetch notifications' });
        return;
      }

      const unreadCount = notifications.filter(n => !n.is_read).length;

      socket.emit('notifications:list', {
        notifications,
        unreadCount,
      });
    });

    /**
     * Mark notification as read
     */
    socket.on('notifications:read', async ({ notificationId }) => {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('user_id', socket.userId);

      if (!error) {
        socket.emit('notifications:read:success', { notificationId });

        // Send updated unread count
        const { count } = await supabase
          .from('notifications')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', socket.userId)
          .eq('is_read', false);

        socket.emit('notifications:unread:count', { count });
      }
    });

    /**
     * Mark all notifications as read
     */
    socket.on('notifications:read:all', async () => {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', socket.userId)
        .eq('is_read', false);

      if (!error) {
        socket.emit('notifications:read:all:success');
        socket.emit('notifications:unread:count', { count: 0 });
      }
    });

    socket.on('disconnect', () => {
      logger.info(`Notification socket disconnected: ${socket.userId}`);
    });
  });

  /**
   * Helper function to send notification to user
   * Can be called from other parts of the application
   */
  io.sendNotification = async (userId, notification) => {
    // Save to database
    const { data: savedNotification, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        ...notification,
      })
      .select()
      .single();

    if (!error && savedNotification) {
      // Emit to user's notification room
      io.to(`notifications:${userId}`).emit('notifications:new', {
        notification: savedNotification,
      });

      // Update unread count
      const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      io.to(`notifications:${userId}`).emit('notifications:unread:count', { count });
    }
  };
}
