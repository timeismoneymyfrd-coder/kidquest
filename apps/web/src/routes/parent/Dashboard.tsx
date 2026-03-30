import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { supabase } from '../../lib/supabase';
import Card from '../../components/ui/Card';
import type { Child, PointTransaction } from '../../types';

const Dashboard: React.FC = () => {
  const family = useAuthStore((state) => state.family);
  const [children, setChildren] = useState<Child[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [recentActivity, setRecentActivity] = useState<PointTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!family?.id) return;

      try {
        setLoading(true);

        // Get children
        const { data: childrenData } = await supabase
          .from('children')
          .select('*')
          .eq('family_id', family.id);

        if (childrenData) {
          setChildren(childrenData);
        }

        // Get pending reviews count
        const { count } = await supabase
          .from('quests')
          .select('*', { count: 'exact', head: 0 })
          .eq('family_id', family.id)
          .eq('status', 'submitted');

        setPendingCount(count || 0);

        // Get recent transactions
        const { data: txData } = await supabase
          .from('point_transactions')
          .select('*')
          .in('child_id', childrenData?.map((c) => c.id) || [])
          .order('created_at', { ascending: false })
          .limit(5);

        if (txData) {
          setRecentActivity(txData);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [family?.id]);

  const totalXPThisWeek = recentActivity.reduce((sum, tx) => sum + tx.xp_amount, 0);
  const avgStreak =
    children.length > 0
      ? Math.round(children.reduce((sum, c) => sum + c.streak_days, 0) / children.length)
      : 0;

  const stats = [
    {
      label: 'Total Children',
      value: children.length.toString(),
      icon: '👨‍👩‍👧‍👦',
      color: 'bg-blue-100',
    },
    {
      label: 'Pending Reviews',
      value: pendingCount.toString(),
      icon: '⏳',
      color: 'bg-yellow-100',
    },
    {
      label: 'This Week XP',
      value: totalXPThisWeek.toString(),
      icon: '⭐',
      color: 'bg-cyan-100',
    },
    {
      label: 'Avg Streak',
      value: `${avgStreak} days`,
      icon: '🔥',
      color: 'bg-red-100',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <p className="text-lg text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

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
            {recentActivity.length > 0 ? (
              recentActivity.map((tx, idx) => {
                const child = children.find((c) => c.id === tx.child_id);
                return (
                  <div
                    key={idx}
                    className="flex justify-between items-start border-b border-gray-200 pb-4 last:border-0"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">{child?.display_name}</p>
                      <p className="text-sm text-gray-600">{tx.description}</p>
                    </div>
                    <p className="text-xs text-gray-400">
                      {new Date(tx.created_at).toLocaleDateString()}
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-gray-500">No recent activity</p>
            )}
          </div>
        </Card>

        <Card className="p-6 bg-white">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Family Insights</h2>
          <div className="space-y-4">
            {children.length === 0 ? (
              <p className="text-sm text-gray-500">No children in family yet</p>
            ) : (
              <>
                {children
                  .slice(0, 3)
                  .map((child, idx) => (
                    <div
                      key={idx}
                      className={`${
                        child.streak_days > 5
                          ? 'bg-blue-50'
                          : 'bg-green-50'
                      } rounded p-3`}
                    >
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">{child.display_name}</span> is at level{' '}
                        {child.level} with {child.streak_days} day streak {child.streak_days > 0 ? '🔥' : ''}
                      </p>
                    </div>
                  ))}
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
