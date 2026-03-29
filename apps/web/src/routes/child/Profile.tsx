import React from 'react';
import { useGameStore } from '../../stores/gameStore';
import XPBar from '../../components/gamification/XPBar';
import CoinCounter from '../../components/gamification/CoinCounter';
import StreakFire from '../../components/gamification/StreakFire';
import Card from '../../components/ui/Card';

const Profile: React.FC = () => {
  const { level, xp, coins, streak } = useGameStore();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-display font-bold text-accent-gold mb-4">Profile</h2>
      </div>

      {/* Avatar and Stats */}
      <Card className="p-8 text-center">
        <div className="text-8xl mb-4">👤</div>
        <h3 className="text-2xl font-display font-bold mb-6">Adventure Hero</h3>

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

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl mb-2">📚</p>
          <p className="text-xs text-gray-400">Quests Done</p>
          <p className="text-2xl font-bold text-accent-cyan">12</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl mb-2">📖</p>
          <p className="text-xs text-gray-400">Words Learned</p>
          <p className="text-2xl font-bold text-accent-green">48</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl mb-2">🏆</p>
          <p className="text-xs text-gray-400">Achievements</p>
          <p className="text-2xl font-bold text-accent-gold">5</p>
        </Card>
      </div>

      {/* Streak Info */}
      {streak > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <span className="text-5xl">🔥</span>
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
