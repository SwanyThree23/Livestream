import { useState, useEffect } from 'react';
import { streamsAPI } from '../lib/api';
import { useStreamSocket } from '../hooks/useSocket';
import { Plus, Play, StopCircle } from 'lucide-react';
import toast from 'react-hot-toast';

function LiveStudio() {
  const [streams, setStreams] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    platforms: [],
  });
  const { socket } = useStreamSocket();

  const platforms = ['twitch', 'youtube', 'facebook', 'twitter', 'tiktok', 'instagram', 'linkedin'];

  useEffect(() => {
    loadStreams();
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on('stream:status:update', loadStreams);
    return () => socket.off('stream:status:update');
  }, [socket]);

  const loadStreams = async () => {
    try {
      const { data } = await streamsAPI.list({});
      setStreams(data.data.streams);
    } catch (error) {
      console.error('Failed to load streams:', error);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await streamsAPI.create(formData);
      toast.success('Stream created!');
      setShowModal(false);
      setFormData({ title: '', description: '', platforms: [] });
      loadStreams();
    } catch (error) {
      toast.error('Failed to create stream');
    }
  };

  const handleStart = async (id) => {
    try {
      await streamsAPI.start(id);
      toast.success('Stream started!');
      loadStreams();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to start stream');
    }
  };

  const handleStop = async (id) => {
    try {
      await streamsAPI.stop(id);
      toast.success('Stream stopped!');
      loadStreams();
    } catch (error) {
      toast.error('Failed to stop stream');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Live Studio</h1>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center space-x-2">
          <Plus size={20} />
          <span>Create Stream</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {streams.map((stream) => (
          <div key={stream.id} className="card">
            <h3 className="font-semibold text-lg mb-2">{stream.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{stream.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {stream.platforms.map((platform) => (
                <span key={platform} className="px-2 py-1 bg-brand-primary/10 text-brand-primary text-xs rounded capitalize">
                  {platform}
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              {stream.status !== 'live' ? (
                <button onClick={() => handleStart(stream.id)} className="btn-primary flex-1 flex items-center justify-center space-x-2">
                  <Play size={16} />
                  <span>Start</span>
                </button>
              ) : (
                <button onClick={() => handleStop(stream.id)} className="btn-accent flex-1 flex items-center justify-center space-x-2">
                  <StopCircle size={16} />
                  <span>Stop</span>
                </button>
              )}
            </div>
            <span className={`mt-2 inline-block px-3 py-1 rounded-full text-sm ${
              stream.status === 'live' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {stream.status}
            </span>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">Create Stream</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="label">Title</label>
                <input type="text" required className="input" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea className="input" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={3} />
              </div>
              <div>
                <label className="label">Platforms</label>
                <div className="grid grid-cols-2 gap-2">
                  {platforms.map((platform) => (
                    <label key={platform} className="flex items-center space-x-2">
                      <input type="checkbox" checked={formData.platforms.includes(platform)} onChange={(e) => {
                        const newPlatforms = e.target.checked ? [...formData.platforms, platform] : formData.platforms.filter(p => p !== platform);
                        setFormData({...formData, platforms: newPlatforms});
                      }} />
                      <span className="capitalize">{platform}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex space-x-2">
                <button type="submit" className="btn-primary flex-1">Create</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default LiveStudio;
