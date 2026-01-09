import { useState } from 'react';
import { aiAPI } from '../lib/api';
import { Mic2, Copy, Download } from 'lucide-react';
import toast from 'react-hot-toast';

function AIPodcastStudio() {
  const [formData, setFormData] = useState({
    topic: '',
    duration: '10',
    tone: 'professional',
    speakers: '2',
  });
  const [generating, setGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const { data } = await aiAPI.generatePodcast(formData);
      setGeneratedScript(data.data.script);
      toast.success('Podcast script generated!');
    } catch (error) {
      toast.error('Failed to generate script');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedScript);
    toast.success('Copied to clipboard!');
  };

  const handleDownload = () => {
    const blob = new Blob([generatedScript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `podcast-script-${Date.now()}.txt`;
    a.click();
    toast.success('Script downloaded!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Mic2 className="text-brand-primary" size={32} />
        <h1 className="text-2xl font-bold">AI Podcast Studio</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Generation Form */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Generate Script</h2>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="label">Topic</label>
              <input
                type="text"
                required
                className="input"
                placeholder="e.g., The Future of AI in Healthcare"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              />
            </div>

            <div>
              <label className="label">Duration (minutes)</label>
              <select
                className="input"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              >
                <option value="5">5 minutes</option>
                <option value="10">10 minutes</option>
                <option value="15">15 minutes</option>
                <option value="20">20 minutes</option>
                <option value="30">30 minutes</option>
              </select>
            </div>

            <div>
              <label className="label">Tone</label>
              <select
                className="input"
                value={formData.tone}
                onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
              >
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="entertaining">Entertaining</option>
                <option value="educational">Educational</option>
              </select>
            </div>

            <div>
              <label className="label">Number of Speakers</label>
              <select
                className="input"
                value={formData.speakers}
                onChange={(e) => setFormData({ ...formData, speakers: e.target.value })}
              >
                <option value="1">1 Speaker (Monologue)</option>
                <option value="2">2 Speakers (Dialogue)</option>
                <option value="3">3 Speakers (Panel)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={generating}
              className="w-full btn-primary"
            >
              {generating ? 'Generating with Claude Sonnet 4...' : 'Generate Script'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Powered by Claude Sonnet 4</strong>
              <br />
              Our AI generates professional podcast scripts with natural dialogue and engaging content.
            </p>
          </div>
        </div>

        {/* Generated Script Display */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Generated Script</h2>
            {generatedScript && (
              <div className="flex space-x-2">
                <button onClick={handleCopy} className="btn-secondary flex items-center space-x-2">
                  <Copy size={16} />
                  <span>Copy</span>
                </button>
                <button onClick={handleDownload} className="btn-secondary flex items-center space-x-2">
                  <Download size={16} />
                  <span>Download</span>
                </button>
              </div>
            )}
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 min-h-[500px] max-h-[600px] overflow-y-auto">
            {generatedScript ? (
              <pre className="whitespace-pre-wrap font-mono text-sm">{generatedScript}</pre>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                <Mic2 size={48} className="mb-4 opacity-20" />
                <p>Your generated podcast script will appear here</p>
                <p className="text-sm mt-2">Fill in the form and click Generate Script</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIPodcastStudio;
