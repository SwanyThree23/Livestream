import { useState, useEffect } from 'react';
import { useChatSocket } from '../hooks/useSocket';
import { Send } from 'lucide-react';

function UniversalChat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { socket, isConnected, sendMessage } = useChatSocket();

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    sendMessage('demo-room', newMessage);
    setMessages([...messages, { content: newMessage, isOwn: true, timestamp: new Date() }]);
    setNewMessage('');
  };

  useEffect(() => {
    if (!socket) return;

    socket.on('chat:message:new', ({ message }) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off('chat:message:new');
    };
  }, [socket]);

  return (
    <div className="flex h-[calc(100vh-12rem)] space-x-6">
      <div className="w-64 card">
        <h2 className="text-lg font-semibold mb-4">Rooms</h2>
        <div className="space-y-2">
          <div className="p-3 bg-brand-primary text-white rounded-lg cursor-pointer">
            <p className="font-medium">General</p>
            <p className="text-sm opacity-80">15 members</p>
          </div>
        </div>
      </div>

      <div className="flex-1 card flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>No messages yet. Start chatting!</p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] p-3 rounded-lg ${
                  msg.isOwn ? 'bg-brand-primary text-white' : 'bg-gray-100 dark:bg-gray-700'
                }`}>
                  <p>{msg.content}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSend} className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="input flex-1"
          />
          <button type="submit" className="btn-primary">
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default UniversalChat;
