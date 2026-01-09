import { BarChart3, TrendingUp, Users, Eye } from 'lucide-react';

function Analytics() {
  const metrics = [
    { label: 'Total Views', value: '45.2K', change: '+12%', icon: Eye },
    { label: 'Avg. Viewers', value: '342', change: '+8%', icon: Users },
    { label: 'Peak Concurrent', value: '1.2K', change: '+23%', icon: TrendingUp },
    { label: 'Watch Time', value: '156h', change: '+15%', icon: BarChart3 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="card">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">{metric.label}</p>
                <Icon size={20} className="text-brand-primary" />
              </div>
              <p className="text-2xl font-bold">{metric.value}</p>
              <p className="text-sm text-green-600">{metric.change} from last month</p>
            </div>
          );
        })}
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Performance Over Time</h2>
        <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-gray-500">Chart visualization (Recharts integration point)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Top Platforms</h2>
          <div className="space-y-3">
            {['YouTube', 'Twitch', 'Facebook', 'TikTok'].map((platform, i) => (
              <div key={platform} className="flex items-center justify-between">
                <span>{platform}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-primary"
                      style={{ width: `${(4 - i) * 25}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {(4 - i) * 25}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Geographic Distribution</h2>
          <div className="space-y-3">
            {['United States', 'United Kingdom', 'Canada', 'Germany'].map((country, i) => (
              <div key={country} className="flex items-center justify-between">
                <span>{country}</span>
                <span className="font-semibold">{(4 - i) * 300}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
