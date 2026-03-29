import React from 'react';
import Card from '../../components/ui/Card';

const Dashboard: React.FC = () => {
  const stats = [
    {
      label: 'Total Children',
      value: '2',
      icon: '👨‍👩‍👧‍👦',
      color: 'bg-blue-100',
    },
    {
      label: 'Pending Reviews',
      value: '3',
      icon: '⏳',
      color: 'bg-yellow-100',
    },
    {
      label: 'This Week XP',
      value: '450',
      icon: '⭐',
      color: 'bg-cyan-100',
    },
    {
      label: 'Avg Streak',
      value: '5 days',
      icon: '🔥',
      color: 'bg-red-100',
    },
  ];

  const recentActivity = [
    {
      child: 'Alex',
      action: 'Completed "Read Chapter 3"',
      time: '2 hours ago',
    },
    {
      child: 'Jordan',
      action: 'Submitted a photo for "Clean Room"',
      time: '4 hours ago',
    },
    {
      child: 'Alex',
      action: 'Reached Level 7',
      time: '1 day ago',
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className={`p-4 ${stat.color}`}>
            <div className="text-3xl mb-2">{stat.icon}</div>
            <p className="text-xs text-gray-600">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 bg-white">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, idx) => (
              <div
                key={idx}
                className="flex justify-between items-start border-b border-gray-200 pb-4 last:border-0"
              >
                <div>
                  <p className="font-semibold text-gray-800">{activity.child}</p>
                  <p className="text-sm text-gray-600">{activity.action}</p>
                </div>
                <p className="text-xs text-gray-400">{activity.time}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-white">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Family Insights</h2>
          <div className="space-y-4">
            <div className="bg-blue-50 rounded p-3">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Alex</span> has a 5-day streak! 🔥
              </p>
            </div>
            <div className="bg-green-50 rounded p-3">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Jordan</span> learned 12 new words this week 📚
              </p>
            </div>
            <div className="bg-yellow-50 rounded p-3">
              <p className="text-sm text-gray-700">
                Family is 50 coins away from family goal! 💰
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
