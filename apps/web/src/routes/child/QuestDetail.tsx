import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuestStore } from '../../stores/questStore';
import { useAuthStore } from '../../stores/authStore';
import SubmissionForm from '../../components/quest/SubmissionForm';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import type { Quest } from '../../types';

const QuestDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const quests = useQuestStore((state) => state.quests);
  const submitQuest = useQuestStore((state) => state.submitQuest);
  const [submitted, setSubmitted] = useState(false);
  const [quest, setQuest] = useState<Quest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && quests.length > 0) {
      const found = quests.find((q) => q.id === id);
      setQuest(found || null);
      setLoading(false);
    }
  }, [id, quests]);

  const handleSubmit = async (data: any) => {
    if (!quest) return;

    try {
      await submitQuest(quest.id, data);
      setSubmitted(true);

      // Show success for 2 seconds then redirect
      setTimeout(() => {
        navigate('/quests');
      }, 2000);
    } catch (err) {
      console.error('Failed to submit quest:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <p className="text-lg text-gray-400">Loading quest...</p>
      </div>
    );
  }

  if (!quest) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <p className="text-lg text-gray-400 mb-4">Quest not found</p>
        <Button onClick={() => navigate('/quests')}>Back to Quests</Button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Card className="text-center p-8">
          <div className="text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-display font-bold text-accent-green mb-2">
            Quest Submitted!
          </h2>
          <p className="text-gray-400">Awaiting parent verification...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button
        variant="ghost"
        onClick={() => navigate('/quests')}
        className="mb-4"
      >
        ← Back to Quests
      </Button>

      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-3xl font-display font-bold text-accent-gold">
            {quest.title}
          </h1>
        </div>
        <p className="text-gray-300 text-lg mb-6">{quest.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-secondary rounded-lg p-4">
            <p className="text-sm text-gray-400">XP Reward</p>
            <p className="text-2xl font-bold text-accent-cyan">{quest.xp_reward}</p>
          </div>
          <div className="bg-secondary rounded-lg p-4">
            <p className="text-sm text-gray-400">Coin Reward</p>
            <p className="text-2xl font-bold text-accent-gold">{quest.coin_reward}</p>
          </div>
        </div>
      </Card>

      <SubmissionForm
        quest={quest}
        verificationType={quest.verification}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default QuestDetail;
