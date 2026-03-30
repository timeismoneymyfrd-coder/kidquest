import React, { useEffect, useState } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { useAuthStore } from '../../stores/authStore';
import { supabase } from '../../lib/supabase';
import Card from '../../components/ui/Card';
import type { Achievement } from '../../types';

const Achievements: React.FC = () => {
  const childSession = useAuthStore((state) => state.childSession);
  const achievements = useGameStore((state) => state.achievements);
  const unlockedAchievements = useGameStore((state) => state.unlockedAchievements);
  const fetchAchievements = useGameStore((state) => state.fetchAchievements);
  const [allAchievements, setAllAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAchievements = async () => {
      setLoading(true);
      try {
        const { data } = await supabase
          .from('achievements')
          .select('*')
          .order('rarity', { ascending: false });

        if (data) {
          setAllAchievements(data);
        }

        if (childSession?.id) {
          await fetchAchievements(childSession.id);
        }
      } catch (err) {
        console.error('Failed to load achievements:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAchievements();
  }, [childSession?.id, fetchAchievements]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <p className="text-lg text-gray-400">Loading achievements...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-display font-bold text-accent-gold">Achievements</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {allAchievements.map((achievement) => {
          const isUnlocked = unlockedAchievements.includes(achievement.id);

          return (
            <Card
              key={achievement.id}
              className={`p-4 text-center transform transition-all ${
                isUnlocked ? 'achievement-unlocked' : 'achievement-locked'
              }`}
            >
              <div className="text-4xl mb-2">{achievement.icon}</div>
              <h3 className="font-display font-bold text-sm mb-1">
                {achievement.title_en || achievement.title_zh}
              </h3>
              <p className="text-xs text-gray-400">
                {achievement.description_en || achievement.description_zh}
              </p>
              {isUnlocked && (
                <div className="mt-2 text-xs text-accent-gold">
                  {achievement.xp_reward} XP
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {allAchievements.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No achievements found</p>
        </div>
      )}
    </div>
  );
};

export default Achievements;
