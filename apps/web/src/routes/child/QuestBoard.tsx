import React, { useState } from 'react';
import { useQuestStore } from '../../stores/questStore';
import QuestCard from '../../components/quest/QuestCard';
import Badge from '../../components/ui/Badge';

const QuestBoard: React.FC = () => {
  const quests = useQuestStore((state) => state.quests);
  const filter = useQuestStore((state) => state.filter);
  const setFilter = useQuestStore((state) => state.setFilter);
  const filtered = useQuestStore((state) => state.getFilteredQuests());

  // Mock data for demo
  const mockQuests = [
    {
      id: '1',
      family_id: '1',
      title: 'Read a book chapter',
      description: 'Read Chapter 3 of your favorite book',
      type: 'learning' as const,
      status: 'active' as const,
      xp_reward: 50,
      coin_reward: 25,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      family_id: '1',
      title: 'Clean your room',
      description: 'Organize and clean your room',
      type: 'chore' as const,
      status: 'pending' as const,
      xp_reward: 30,
      coin_reward: 15,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '3',
      family_id: '1',
      title: 'Do 10 push-ups',
      description: 'Complete 10 push-ups for exercise',
      type: 'exercise' as const,
      status: 'active' as const,
      xp_reward: 40,
      coin_reward: 20,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const questsToDisplay = quests.length > 0 ? filtered : mockQuests;
  const types = ['all', 'learning', 'chore', 'exercise', 'creative', 'nutrition', 'challenge'] as const;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-display font-bold text-accent-gold mb-4">Quest Board</h2>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`whitespace-nowrap px-4 py-2 rounded-lg font-medium transition-all ${
                filter === type
                  ? 'bg-accent-gold text-primary'
                  : 'bg-secondary hover:bg-secondary/80 text-white'
              }`}
            >
              {type === 'all' ? 'All Quests' : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Quest Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {questsToDisplay.map((quest) => (
          <QuestCard
            key={quest.id}
            quest={quest}
            onClick={() => window.location.href = `/quests/${quest.id}`}
          />
        ))}
      </div>

      {questsToDisplay.length === 0 && (
        <div className="text-center py-12">
          <p className="text-2xl mb-2">🎉</p>
          <p className="text-gray-400">No quests available in this category</p>
        </div>
      )}
    </div>
  );
};

export default QuestBoard;
