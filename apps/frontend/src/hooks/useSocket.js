import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';

/**
 * Base WebSocket hook
 */
export function useSocket(namespace = '') {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectTimeoutRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const socketInstance = io(`${WS_URL}${namespace}`, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketInstance.on('connect', () => {
      setIsConnected(true);
      console.log(`Connected to ${namespace || 'default'} socket`);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
      console.log(`Disconnected from ${namespace || 'default'} socket`);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      socketInstance.disconnect();
    };
  }, [namespace]);

  return { socket, isConnected };
}

/**
 * Stream WebSocket hook
 */
export function useStreamSocket() {
  const { socket, isConnected } = useSocket('/streams');

  const joinStream = (streamId) => {
    if (socket) {
      socket.emit('stream:join', { streamId });
    }
  };

  const leaveStream = (streamId) => {
    if (socket) {
      socket.emit('stream:leave', { streamId });
    }
  };

  const updateStreamStatus = (streamId, status, data) => {
    if (socket) {
      socket.emit('stream:status', { streamId, status, data });
    }
  };

  return {
    socket,
    isConnected,
    joinStream,
    leaveStream,
    updateStreamStatus,
  };
}

/**
 * Chat WebSocket hook
 */
export function useChatSocket() {
  const { socket, isConnected } = useSocket('/chat');

  const joinRoom = (roomId) => {
    if (socket) {
      socket.emit('chat:join', { roomId });
    }
  };

  const sendMessage = (roomId, content, type = 'text') => {
    if (socket) {
      socket.emit('chat:message', { roomId, content, type });
    }
  };

  const sendTyping = (roomId, isTyping) => {
    if (socket) {
      socket.emit('chat:typing', { roomId, isTyping });
    }
  };

  const markAsRead = (messageId) => {
    if (socket) {
      socket.emit('chat:read', { messageId });
    }
  };

  const addReaction = (messageId, emoji) => {
    if (socket) {
      socket.emit('chat:reaction', { messageId, emoji });
    }
  };

  return {
    socket,
    isConnected,
    joinRoom,
    sendMessage,
    sendTyping,
    markAsRead,
    addReaction,
  };
}

/**
 * Notification WebSocket hook
 */
export function useNotificationSocket() {
  const { socket, isConnected } = useSocket('/notifications');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!socket) return;

    socket.on('notifications:list', ({ notifications, unreadCount }) => {
      setNotifications(notifications);
      setUnreadCount(unreadCount);
    });

    socket.on('notifications:new', ({ notification }) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    socket.on('notifications:unread:count', ({ count }) => {
      setUnreadCount(count);
    });

    // Fetch notifications on connect
    socket.emit('notifications:fetch', { limit: 50 });

    return () => {
      socket.off('notifications:list');
      socket.off('notifications:new');
      socket.off('notifications:unread:count');
    };
  }, [socket]);

  const markAsRead = (notificationId) => {
    if (socket) {
      socket.emit('notifications:read', { notificationId });
    }
  };

  const markAllAsRead = () => {
    if (socket) {
      socket.emit('notifications:read:all');
    }
  };

  return {
    socket,
    isConnected,
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  };
}
