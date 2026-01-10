import { useState, useEffect } from 'react';
import {
  Video, Copy, Eye, EyeOff, Key, RefreshCw, Save,
  ExternalLink, Plus, Trash2, Settings, Code, Palette
} from 'lucide-react';
import toast from 'react-hot-toast';
import { rtmpConfigsAPI, websourcesAPI } from '../lib/api';

/**
 * RTMP & Stream Setup Page
 * Comprehensive streaming configuration with RTMP servers, stream keys, and websources
 */
function StreamSetup() {
  const [rtmpConfigs, setRtmpConfigs] = useState([]);
  const [websources, setWebsources] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showStreamKey, setShowStreamKey] = useState({});
  const [newConfig, setNewConfig] = useState({
    name: '',
    server: '',
    streamKey: '',
  });

  const [newWebsource, setNewWebsource] = useState({
    name: '',
    url: '',
    width: 1920,
    height: 1080,
  });

  /**
   * Load data from API on mount
   */
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [configsRes, sourcesRes] = await Promise.all([
        rtmpConfigsAPI.list(),
        websourcesAPI.list(),
      ]);

      setRtmpConfigs(configsRes.data.data.configs || []);
      setWebsources(sourcesRes.data.data.websources || []);
    } catch (error) {
      console.error('Failed to load data:', error);
      toast.error('Failed to load configurations');
    } finally {
      setLoading(false);
    }
  };

  // Common RTMP servers
  const rtmpPresets = [
    { name: 'evmux US East', server: 'rtmp://rtmp1.us-east-1.evmux.com/live' },
    { name: 'evmux US West', server: 'rtmp://rtmp1.us-west-1.evmux.com/live' },
    { name: 'evmux Europe', server: 'rtmp://rtmp1.eu-west-1.evmux.com/live' },
    { name: 'YouTube', server: 'rtmp://a.rtmp.youtube.com/live2' },
    { name: 'Twitch', server: 'rtmp://live.twitch.tv/app' },
    { name: 'Facebook', server: 'rtmps://live-api-s.facebook.com:443/rtmp' },
    { name: 'Custom', server: '' },
  ];

  /**
   * Add new RTMP configuration
   */
  const handleAddConfig = async () => {
    if (!newConfig.name || !newConfig.server || !newConfig.streamKey) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const response = await rtmpConfigsAPI.create({
        name: newConfig.name,
        server: newConfig.server,
        stream_key: newConfig.streamKey,
        token: newConfig.token || null,
        enabled: true,
      });

      setRtmpConfigs([...rtmpConfigs, response.data.data.config]);
      setNewConfig({ name: '', server: '', streamKey: '', token: '' });
      toast.success('RTMP configuration added!');
    } catch (error) {
      console.error('Failed to add config:', error);
      toast.error('Failed to add configuration');
    }
  };

  /**
   * Delete RTMP configuration
   */
  const handleDeleteConfig = async (id) => {
    try {
      await rtmpConfigsAPI.delete(id);
      setRtmpConfigs(rtmpConfigs.filter(c => c.id !== id));
      toast.success('Configuration deleted');
    } catch (error) {
      console.error('Failed to delete config:', error);
      toast.error('Failed to delete configuration');
    }
  };

  /**
   * Toggle configuration enabled state
   */
  const toggleConfig = async (id) => {
    const config = rtmpConfigs.find(c => c.id === id);
    if (!config) return;

    try {
      const response = await rtmpConfigsAPI.update(id, {
        enabled: !config.enabled,
      });

      setRtmpConfigs(rtmpConfigs.map(c =>
        c.id === id ? response.data.data.config : c
      ));
    } catch (error) {
      console.error('Failed to toggle config:', error);
      toast.error('Failed to update configuration');
    }
  };

  /**
   * Copy to clipboard
   */
  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${label} copied!`);
    });
  };

  /**
   * Generate stream key
   */
  const generateStreamKey = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let key = 'app-';
    for (let i = 0; i < 32; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
  };

  /**
   * Add new websource
   */
  const handleAddWebsource = async () => {
    if (!newWebsource.name || !newWebsource.url) {
      toast.error('Please provide name and URL');
      return;
    }

    try {
      const response = await websourcesAPI.create({
        name: newWebsource.name,
        url: newWebsource.url,
        width: newWebsource.width,
        height: newWebsource.height,
        enabled: true,
      });

      setWebsources([...websources, response.data.data.websource]);
      setNewWebsource({ name: '', url: '', width: 1920, height: 1080 });
      toast.success('Websource added!');
    } catch (error) {
      console.error('Failed to add websource:', error);
      toast.error('Failed to add websource');
    }
  };

  /**
   * Delete websource
   */
  const handleDeleteWebsource = async (id) => {
    try {
      await websourcesAPI.delete(id);
      setWebsources(websources.filter(w => w.id !== id));
      toast.success('Websource deleted');
    } catch (error) {
      console.error('Failed to delete websource:', error);
      toast.error('Failed to delete websource');
    }
  };

  /**
   * Toggle websource enabled state
   */
  const toggleWebsource = async (id) => {
    const websource = websources.find(w => w.id === id);
    if (!websource) return;

    try {
      const response = await websourcesAPI.update(id, {
        enabled: !websource.enabled,
      });

      setWebsources(websources.map(w =>
        w.id === id ? response.data.data.websource : w
      ));
    } catch (error) {
      console.error('Failed to toggle websource:', error);
      toast.error('Failed to update websource');
    }
  };

  /**
   * Get full RTMP URL
   */
  const getFullRTMPUrl = (config) => {
    return `${config.server}/${config.stream_key || config.streamKey}${config.token ? `?token=${config.token}` : ''}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading configurations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center space-x-2">
          <Video className="text-brand-primary" />
          <span>Stream Setup</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Configure RTMP servers, stream keys, and websources for your broadcasts
        </p>
      </div>

      {/* RTMP Configuration Section */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
          <Key size={20} className="text-brand-primary" />
          <span>RTMP Configurations</span>
        </h2>

        {/* Existing Configurations */}
        <div className="space-y-4 mb-6">
          {rtmpConfigs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No RTMP configurations yet. Add one below.
            </div>
          ) : (
            rtmpConfigs.map((config) => (
              <div key={config.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={config.enabled}
                      onChange={() => toggleConfig(config.id)}
                      className="w-4 h-4"
                    />
                    <h3 className="font-semibold">{config.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      config.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {config.enabled ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteConfig(config.id)}
                    className="text-red-600 hover:bg-red-50 p-2 rounded"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="space-y-2">
                  {/* Server URL */}
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">RTMP Server</label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={config.server}
                        readOnly
                        className="input text-sm flex-1 font-mono"
                      />
                      <button
                        onClick={() => copyToClipboard(config.server, 'Server URL')}
                        className="btn-secondary p-2"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Stream Key */}
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Stream Key</label>
                    <div className="flex space-x-2">
                      <input
                        type={showStreamKey[config.id] ? 'text' : 'password'}
                        value={config.stream_key || config.streamKey}
                        readOnly
                        className="input text-sm flex-1 font-mono"
                      />
                      <button
                        onClick={() => setShowStreamKey({ ...showStreamKey, [config.id]: !showStreamKey[config.id] })}
                        className="btn-secondary p-2"
                      >
                        {showStreamKey[config.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button
                        onClick={() => copyToClipboard(config.stream_key || config.streamKey, 'Stream key')}
                        className="btn-secondary p-2"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Full URL */}
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Full RTMP URL (for OBS)</label>
                    <div className="flex space-x-2">
                      <input
                        type={showStreamKey[config.id] ? 'text' : 'password'}
                        value={getFullRTMPUrl(config)}
                        readOnly
                        className="input text-sm flex-1 font-mono"
                      />
                      <button
                        onClick={() => copyToClipboard(getFullRTMPUrl(config), 'Full RTMP URL')}
                        className="btn-secondary p-2"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* OBS Instructions */}
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded text-sm">
                  <p className="font-medium mb-1">OBS Setup:</p>
                  <ol className="text-xs space-y-1 list-decimal list-inside">
                    <li>Settings → Stream → Service: Custom</li>
                    <li>Server: <code className="bg-white dark:bg-gray-700 px-1 rounded">{config.server}</code></li>
                    <li>Stream Key: <code className="bg-white dark:bg-gray-700 px-1 rounded">***hidden***</code></li>
                  </ol>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add New Configuration */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h3 className="font-semibold mb-3">Add New RTMP Configuration</h3>

          {/* Preset Selector */}
          <div className="mb-3">
            <label className="label">Select Preset</label>
            <select
              className="input"
              onChange={(e) => {
                const preset = rtmpPresets.find(p => p.name === e.target.value);
                if (preset) {
                  setNewConfig({ ...newConfig, server: preset.server, name: preset.name });
                }
              }}
            >
              <option value="">Choose a platform...</option>
              {rtmpPresets.map((preset) => (
                <option key={preset.name} value={preset.name}>{preset.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Configuration Name</label>
              <input
                type="text"
                className="input"
                value={newConfig.name}
                onChange={(e) => setNewConfig({ ...newConfig, name: e.target.value })}
                placeholder="e.g., evmux Production"
              />
            </div>

            <div>
              <label className="label">RTMP Server</label>
              <input
                type="text"
                className="input font-mono text-sm"
                value={newConfig.server}
                onChange={(e) => setNewConfig({ ...newConfig, server: e.target.value })}
                placeholder="rtmp://server.com/live"
              />
            </div>

            <div>
              <label className="label">Stream Key</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  className="input font-mono text-sm flex-1"
                  value={newConfig.streamKey}
                  onChange={(e) => setNewConfig({ ...newConfig, streamKey: e.target.value })}
                  placeholder="your-stream-key"
                />
                <button
                  onClick={() => setNewConfig({ ...newConfig, streamKey: generateStreamKey() })}
                  className="btn-secondary"
                  title="Generate random key"
                >
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>

            <div>
              <label className="label">Token (optional)</label>
              <input
                type="text"
                className="input font-mono text-sm"
                value={newConfig.token || ''}
                onChange={(e) => setNewConfig({ ...newConfig, token: e.target.value })}
                placeholder="optional-token"
              />
            </div>
          </div>

          <button
            onClick={handleAddConfig}
            className="btn-primary mt-4 flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add Configuration</span>
          </button>
        </div>
      </div>

      {/* Websources Section */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
          <Code size={20} className="text-brand-primary" />
          <span>Websources & Overlays</span>
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Add HTML-based overlays and graphics to your stream
        </p>

        {/* Existing Websources */}
        <div className="space-y-4 mb-6">
          {websources.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No websources yet. Add one below.
            </div>
          ) : (
            websources.map((source) => (
              <div key={source.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={source.enabled}
                      onChange={() => toggleWebsource(source.id)}
                      className="w-4 h-4"
                    />
                    <h3 className="font-semibold">{source.name}</h3>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => window.open(source.url, '_blank')}
                      className="btn-secondary p-2"
                      title="Preview"
                    >
                      <ExternalLink size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteWebsource(source.id)}
                      className="text-red-600 hover:bg-red-50 p-2 rounded"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">URL:</span>
                    <p className="font-mono text-xs truncate">{source.url}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Size:</span>
                    <p className="font-mono text-xs">{source.width}x{source.height}</p>
                  </div>
                </div>

                {/* OBS Instructions */}
                <div className="mt-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded text-sm">
                  <p className="font-medium mb-1">Add to OBS:</p>
                  <ol className="text-xs space-y-1 list-decimal list-inside">
                    <li>Add Browser Source</li>
                    <li>URL: <code className="bg-white dark:bg-gray-700 px-1 rounded">{source.url}</code></li>
                    <li>Size: {source.width}x{source.height}</li>
                  </ol>
                </div>

                {/* Preview */}
                <div className="mt-3">
                  <p className="text-sm font-medium mb-2">Preview:</p>
                  <iframe
                    src={source.url}
                    className="w-full h-64 border border-gray-300 dark:border-gray-600 rounded"
                    title={source.name}
                  />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add New Websource */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h3 className="font-semibold mb-3">Add New Websource</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Name</label>
              <input
                type="text"
                className="input"
                value={newWebsource.name}
                onChange={(e) => setNewWebsource({ ...newWebsource, name: e.target.value })}
                placeholder="e.g., Animated Title"
              />
            </div>

            <div>
              <label className="label">URL</label>
              <input
                type="url"
                className="input font-mono text-sm"
                value={newWebsource.url}
                onChange={(e) => setNewWebsource({ ...newWebsource, url: e.target.value })}
                placeholder="https://example.com/overlay.html"
              />
            </div>

            <div>
              <label className="label">Width</label>
              <input
                type="number"
                className="input"
                value={newWebsource.width}
                onChange={(e) => setNewWebsource({ ...newWebsource, width: parseInt(e.target.value) })}
              />
            </div>

            <div>
              <label className="label">Height</label>
              <input
                type="number"
                className="input"
                value={newWebsource.height}
                onChange={(e) => setNewWebsource({ ...newWebsource, height: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <button
            onClick={handleAddWebsource}
            className="btn-primary mt-4 flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add Websource</span>
          </button>
        </div>

        {/* Preset Websources */}
        <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
          <h3 className="font-semibold mb-3">Preset Websources</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={() => {
                handleAddWebsource();
                setNewWebsource({
                  name: 'evmux Demo',
                  url: 'https://publicfiles.evmux.com/static/websources/websource-demo.v7.html',
                  width: 1920,
                  height: 1080,
                });
              }}
              className="text-left p-3 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <p className="font-medium">evmux Animated Title</p>
              <p className="text-xs text-gray-500">Animated liquid text effect</p>
            </button>
          </div>
        </div>
      </div>

      {/* evmux Console Links */}
      <div className="card bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <h3 className="font-semibold mb-3">🔗 Quick Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <a
            href="https://console.evmux.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded hover:shadow"
          >
            <span>evmux Console</span>
            <ExternalLink size={16} />
          </a>
          <a
            href="https://obs.ninja"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded hover:shadow"
          >
            <span>VDO.Ninja</span>
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}

export default StreamSetup;
