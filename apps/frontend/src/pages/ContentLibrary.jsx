import { useState, useEffect } from 'react';
import { contentAPI } from '../lib/api';
import { FileText, Video, Music, Image } from 'lucide-react';

function ContentLibrary() {
  const [content, setContent] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadContent();
  }, [filter]);

  const loadContent = async () => {
    try {
      const params = filter !== 'all' ? { type: filter } : {};
      const { data } = await contentAPI.list(params);
      setContent(data.data.content);
    } catch (error) {
      console.error('Failed to load content:', error);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'video': return <Video size={24} />;
      case 'audio': return <Music size={24} />;
      case 'image': return <Image size={24} />;
      default: return <FileText size={24} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Content Library</h1>
        <div className="flex space-x-2">
          {['all', 'video', 'audio', 'image', 'document'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-lg capitalize ${
                filter === type ? 'bg-brand-primary text-white' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {content.length === 0 ? (
          <div className="col-span-full card text-center py-12">
            <p className="text-gray-500">No content found. Upload your first item!</p>
          </div>
        ) : (
          content.map((item) => (
            <div key={item.id} className="card">
              <div className="flex items-center space-x-3 mb-3">
                {getIcon(item.type)}
                <h3 className="font-semibold flex-1 truncate">{item.title}</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{item.description}</p>
              <div className="flex flex-wrap gap-2">
                {item.tags?.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ContentLibrary;
