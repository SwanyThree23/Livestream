import { createClient } from '@supabase/supabase-js';
import config from '../config/index.js';
import logger from '../utils/logger.js';

const supabase = createClient(config.supabase.url, config.supabase.serviceKey);

/**
 * Setup Chat WebSocket namespace
 * Handles real-time messaging, typing indicators, read receipts
 */
export function setupChatSocket(io) {
  // Track online users
  const onlineUsers = new Map();

  io.on('connection', (socket) => {
    logger.info(`Chat socket connected: ${socket.userId}`);

    // Mark user as online
    onlineUsers.set(socket.userId, socket.id);
    io.emit('user:online', { userId: socket.userId });

    /**
     * Join chat room
     */
    socket.on('chat:join', async ({ roomId }) => {
      // Verify user is participant
      const { data: participant } = await supabase
        .from('chat_participants')
        .select('id')
        .eq('room_id', roomId)
        .eq('user_id', socket.userId)
        .single();

      if (participant) {
        socket.join(`room:${roomId}`);
        logger.info(`User ${socket.userId} joined chat room ${roomId}`);
        socket.emit('chat:joined', { roomId });
      } else {
        socket.emit('chat:error', { message: 'Not authorized to join room' });
      }
    });

    /**
     * Send message
     */
    socket.on('chat:message', async ({ roomId, content, type = 'text' }) => {
      // Save message to database
      const { data: message, error } = await supabase
        .from('chat_messages')
        .insert({
          room_id: roomId,
          user_id: socket.userId,
          content,
          type,
        })
        .select(`
          *,
          users:user_id (id, username, avatar_url)
        `)
        .single();

      if (error) {
        logger.error('Failed to save message:', error);
        socket.emit('chat:error', { message: 'Failed to send message' });
        return;
      }

      // Broadcast to room
      io.to(`room:${roomId}`).emit('chat:message:new', { message });

      // Update room's updated_at
      await supabase
        .from('chat_rooms')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', roomId);
    });

    /**
     * Typing indicator
     */
    socket.on('chat:typing', ({ roomId, isTyping }) => {
      socket.to(`room:${roomId}`).emit('chat:typing:update', {
        userId: socket.userId,
        username: socket.user.username,
        roomId,
        isTyping,
      });
    });

    /**
     * Mark messages as read
     */
    socket.on('chat:read', async ({ messageId }) => {
      await supabase
        .from('chat_read_receipts')
        .upsert({
          message_id: messageId,
          user_id: socket.userId,
          read_at: new Date().toISOString(),
        });

      // Get room from message
      const { data: message } = await supabase
        .from('chat_messages')
        .select('room_id')
        .eq('id', messageId)
        .single();

      if (message) {
        io.to(`room:${message.room_id}`).emit('chat:read:update', {
          messageId,
          userId: socket.userId,
        });
      }
    });

    /**
     * Add reaction
     */
    socket.on('chat:reaction', async ({ messageId, emoji }) => {
      const { data: reaction, error } = await supabase
        .from('chat_reactions')
        .upsert({
          message_id: messageId,
          user_id: socket.userId,
          emoji,
        })
        .select()
        .single();

      if (!error) {
        const { data: message } = await supabase
          .from('chat_messages')
          .select('room_id')
          .eq('id', messageId)
          .single();

        if (message) {
          io.to(`room:${message.room_id}`).emit('chat:reaction:new', {
            messageId,
            userId: socket.userId,
            emoji,
          });
        }
      }
    });

    socket.on('disconnect', () => {
      onlineUsers.delete(socket.userId);
      io.emit('user:offline', { userId: socket.userId });
      logger.info(`Chat socket disconnected: ${socket.userId}`);
    });
  });
}
