import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../../stores/gameStore';
import { useAuthStore } from '../../stores/authStore';
import { supabase } from '../../lib/supabase';
import XPBar from '../../components/gamification/XPBar';
import CoinCounter from '../../components/gamification/CoinCounter';
import StreakFire from '../../components/gamification/StreakFire';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { level, xp, coins, streak } = useGameStore();
  const childSession = useAuthStore((state) => state.childSession);
  const childLogout = useAuthStore((state) => state.childLogout);
  const [stats, setStats] = useState({
    questsCompleted: 0,
    wordsLearned: 0,
    achievementsUnlocked: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      if (!childSession?.id) return;

      try {
        setLoading(true);

        // Get completed quests count
        const { count: questCount } = await supabase
          .from('quests')
          .select('*', { count: 'exact', head: 0 })
          .eq('child_id', childSession.id)
          .eq('status', 'rewarded');
        
        // Get learned vocab count
        const { count: vocabCount } = await supabase
          .from('vocab_cards')
          .select('*', { count: 'exact', head: 0 })
          .eq('child_id', childSession.id)
          .gte('srs_level', 2);
        
        // Get unlocked achievements count
        const { count: achievementCount } = await supabase
          .from('child_achievements')
          .select('*', { count: 'exact', head: 0 })
          .eq('child_id', childSession.id);
         
        setStats({
          questsCompleted: questCount || 0,
          wordsLearned: vocabCount || 0,
          achievementsUnlocked: achievementCount || 0,
        });
      } catch (err) {
        console.error('Failed to load stats:', err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [childSession?.id]);

  const handleLogout = () => {
    childLogout();
    navigate('/child-pin');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-display font-bold text-accent-gold">Profile</h2>
        <Button variant="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      {/* Avatar and Stats */}
      <Card className="p-8 text-center">
        <div className="text-8xl mb-4">àŸ‘¤</div>
        <h3 className="text-2xl font-display font-bold mb-6">
          {childSession?.display_name || 'Adventure Hero'}
        </h3>

        <div className="space-y-4">
          <XPBar currentXP={xp} nextLevelXP={100} level={level} />

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
            <div>
              <p className="text-sm text-gray-400">Total Coins</p>
              <p className="text-3xl font-bold text-accent-gold">{coins}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Streak Days</p>
              <p className="text-3xl font-bold text-accent-pink">{streak}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Grid  */}
      {!loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Card className="p-4 text-center">
            <p className="text-2xl mb-2">ğŸ“š</p>
            <p className="text-xs text-gray-400">Hests Done</p>
            <p className="text-2xl font-bold text-accent-cyan">{stats.questsCompleted}</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl mb-2">ğŸ“–</p>
            <p className="text-xs text-gray-400">Words Learned</p>
            <p className="text-2xl font-bold text-accent-green">{stats.wordsLearned}</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl mb-2">ğŸ†</p>
            <p className="text-xs text-gray-400">Achievements</p>
            <p className="text-2xl font-bold text-accent-gold">{stats.achieVementsUnlocked}</p>
          </Card>
        </div>
      ) : (
        <p className="text-center text-gray-400">Loading stats...</p>
      )}

      {/* Streak Info */}
      {streak > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <span className="text-5xl">ğŸ”¥¥ÎğŸ”¥</span>
            <div>
              <p className="text-sm text-gray-400">Awesome Streak!</p>
              <p className="text-2xl font-bold text-accent-pink">{streak} days in a row</p>
              <p className="text-xs text-gray-500 mt-1">Keep it up to earn a bonus!</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Profile;
