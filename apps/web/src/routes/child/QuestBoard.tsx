import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuestStore } from '../../stores/questStore';
import { useAuthStore } from '../../stores/authStore';
import QuestCard from '../../components/quest/QuestCard';

const QuestBoard: React.FC = () => {
  const navigate = useNavigate();
  const childSession = useAuthStore((state) => state.childSession);
  const quests = useQuestStore((state) => state.quests);
  const loading = useQuestStore((state) => state.loading);
  const filter = useQuestStore((state) => state.filter);
  const setFilter = useQuestStore((state) => state.setFilter);
  const fetchQuests = useQuestStore((state) => state.fetchQuests);

  const filtered = quests.filter((q) => {
    if (filter !== 'all' && q.type !== filter) return false;
    return true;
  });

  useEffect(() => {
    if (childSession?.id) {
      fetchQuests(childSession.id);
    }
  }, [childSession?.id, fetchQuests]);

  const types = ['all', 'learning', 'chore', 'exercise', 'creative', 'nutrition', 'challenge'] as const;

  if (loading && quests.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <p className="text-lg text-gray-400">Loading quests...</p>
      </div>
    );
  }

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
        {filtered.map((quest) => (
          <QuestCard
            key={quest.id}
            quest={quest}
            onClick={() => navigate(`/quests/${quest.id}`)}
          />
        ))}
      </div>

      {filtered.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-2xl mb-2">🎉</p>
          <p className="text-gray-400">No quests available in this category</p>
        </div>
      )}
    </div>
  );
};

export default QuestBoard;
