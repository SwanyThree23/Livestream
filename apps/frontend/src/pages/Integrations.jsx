import { useState, useEffect } from 'react';
import { usersAPI } from '../lib/api';
import { Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

function Integrations() {
  const [connections, setConnections] = useState([]);

  const platforms = [
    { id: 'twitch', name: 'Twitch', color: 'purple' },
    { id: 'youtube', name: 'YouTube', color: 'red' },
    { id: 'facebook', name: 'Facebook', color: 'blue' },
    { id: 'twitter', name: 'Twitter', color: 'sky' },
    { id: 'tiktok', name: 'TikTok', color: 'pink' },
    { id: 'instagram', name: 'Instagram', color: 'pink' },
    { id: 'linkedin', name: 'LinkedIn', color: 'blue' },
  ];

  useEffect(() => {
    loadConnections();
  }, []);

  const loadConnections = async () => {
    try {
      const { data } = await usersAPI.getOAuthConnections();
      setConnections(data.data.connections);
    } catch (error) {
      console.error('Failed to load connections:', error);
    }
  };

  const isConnected = (platformId) => {
    return connections.some(c => c.provider === platformId && c.is_active);
  };

  const handleConnect = (platformId) => {
    toast.success(`Redirecting to ${platformId} authentication...`);
    // In production, redirect to OAuth flow
  };

  const handleDisconnect = (platformId) => {
    toast.success(`Disconnected from ${platformId}`);
    setConnections(connections.filter(c => c.provider !== platformId));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Integrations</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Connect your social media accounts to stream across multiple platforms
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {platforms.map((platform) => {
          const connected = isConnected(platform.id);

          return (
            <div key={platform.id} className="card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{platform.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {connected ? 'Connected' : 'Not connected'}
                  </p>
                </div>
                {connected ? (
                  <Check className="text-green-600" size={24} />
                ) : (
                  <X className="text-gray-400" size={24} />
                )}
              </div>

              {connected ? (
                <button
                  onClick={() => handleDisconnect(platform.id)}
                  className="w-full btn-secondary"
                >
                  Disconnect
                </button>
              ) : (
                <button
                  onClick={() => handleConnect(platform.id)}
                  className="w-full btn-primary"
                >
                  Connect {platform.name}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="card bg-blue-50 dark:bg-blue-900/20">
        <h3 className="font-semibold mb-2">Security Note</h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Your credentials are encrypted and stored securely. We never share your data with third parties.
          You can disconnect any platform at any time.
        </p>
      </div>
    </div>
  );
}

export default Integrations;
