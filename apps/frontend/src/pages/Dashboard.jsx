import { useEffect, useState } from 'react';
import { useStreamSocket } from '../hooks/useSocket';
import { streamsAPI } from '../lib/api';
import { Video, Users, Eye, DollarSign, Play, Mic2, Plug } from 'lucide-react';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [stats, setStats] = useState({
    totalStreams: 0,
    activeStreams: 0,
    totalViewers: 0,
    revenue: 0,
  });
  const [recentStreams, setRecentStreams] = useState([]);
  const { socket, isConnected } = useStreamSocket();

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('stream:status:update', ({ streamId, status }) => {
      // Update stats when stream status changes
      loadDashboardData();
    });

    return () => {
      socket.off('stream:status:update');
    };
  }, [socket]);

  const loadDashboardData = async () => {
    try {
      const { data } = await streamsAPI.list({ limit: 5 });
      setRecentStreams(data.data.streams);

      // Calculate stats
      const totalStreams = data.data.pagination.total;
      const activeStreams = data.data.streams.filter(s => s.status === 'live').length;

      setStats({
        totalStreams,
        activeStreams,
        totalViewers: activeStreams * 42, // Mock data
        revenue: 1247.50, // Mock data
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  const statCards = [
    { label: 'Total Streams', value: stats.totalStreams, icon: Video, color: 'blue' },
    { label: 'Active Now', value: stats.activeStreams, icon: Play, color: 'green' },
    { label: 'Total Viewers', value: stats.totalViewers, icon: Eye, color: 'purple' },
    { label: 'Revenue', value: `$${stats.revenue}`, icon: DollarSign, color: 'pink' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-brand-primary to-brand-accent rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back! 👋</h1>
        <p className="opacity-90">
          Your multi-platform streaming studio is ready.
          {isConnected && <span className="ml-2">✓ Connected</span>}
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 bg-${stat.color}-100 dark:bg-${stat.color}-900 rounded-lg`}>
                  <Icon className={`text-${stat.color}-600`} size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/studio" className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <Video className="text-green-600" size={24} />
            </div>
            <div>
              <h3 className="font-semibold">Start Stream</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Go live on multiple platforms</p>
            </div>
          </div>
        </Link>

        <Link to="/podcast" className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Mic2 className="text-purple-600" size={24} />
            </div>
            <div>
              <h3 className="font-semibold">Generate Podcast</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">AI-powered script generation</p>
            </div>
          </div>
        </Link>

        <Link to="/integrations" className="card hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Plug className="text-blue-600" size={24} />
            </div>
            <div>
              <h3 className="font-semibold">Connect Platform</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Link social accounts</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent streams */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Recent Streams</h2>
        <div className="space-y-3">
          {recentStreams.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No streams yet. Create your first stream!</p>
          ) : (
            recentStreams.map((stream) => (
              <div key={stream.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium">{stream.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {stream.platforms.join(', ')} • {stream.status}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  stream.status === 'live' ? 'bg-green-100 text-green-800' :
                  stream.status === 'ended' ? 'bg-gray-100 text-gray-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {stream.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
