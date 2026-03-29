import React from 'react';
import { useGameStore } from '../../stores/gameStore';
import Card from '../../components/ui/Card';

const Achievements: React.FC = () => {
  const unlockedAchievements = useGameStore((state) => state.unlockedAchievements);

  const mockAchievements = [
    {
      id: '1',
      name: 'First Step',
      description: 'Complete your first quest',
      icon: '👣',
      unlocked: true,
    },
    {
      id: '2',
      name: 'Quest Master',
      description: 'Complete 10 quests',
      icon: '🎯',
      unlocked: unlockedAchievements.includes('2'),
    },
    {
      id: '3',
      name: 'Vocabulary Expert',
      description: 'Master 50 vocabulary words',
      icon: '📚',
      unlocked: false,
    },
    {
      id: '4',
      name: 'Reading Champion',
      description: 'Read 5 news articles',
      icon: '📰',
      unlocked: false,
    },
    {
      id: '5',
      name: 'Level 5 Warrior',
      description: 'Reach level 5',
      icon: '⚔️',
      unlocked: false,
    },
    {
      id: '6',
      name: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: '🔥',
      unlocked: false,
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-display font-bold text-accent-gold">Achievements</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {mockAchievements.map((achievement) => (
          <Card
            key={achievement.id}
            className={`p-4 text-center transform transition-all ${
              achievement.unlocked ? 'achievement-unlocked' : 'achievement-locked'
            }`}
          >
            <div className="text-4xl mb-2">{achievement.icon}</div>
            <h3 className="font-display font-bold text-sm mb-1">{achievement.name}</h3>
            <p className="text-xs text-gray-400">{achievement.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
