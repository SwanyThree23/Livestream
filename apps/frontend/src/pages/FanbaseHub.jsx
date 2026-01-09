import { Users, TrendingUp, Heart } from 'lucide-react';

function FanbaseHub() {
  const stats = [
    { label: 'Total Followers', value: '12.5K', change: '+15%', icon: Users },
    { label: 'Engagement Rate', value: '8.3%', change: '+2.1%', icon: Heart },
    { label: 'Growth Rate', value: '23%', change: '+5%', icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Fanbase Hub</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                <Icon size={20} className="text-brand-primary" />
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-green-600">{stat.change}</p>
            </div>
          );
        })}
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Top Fans</h2>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center text-white font-semibold">
                  {i}
                </div>
                <div>
                  <p className="font-medium">Fan User {i}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">@fanuser{i}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{1000 - i * 100} points</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Level {10 - i}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FanbaseHub;
