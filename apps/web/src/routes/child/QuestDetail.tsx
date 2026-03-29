import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameStore } from '../../stores/gameStore';
import SubmissionForm from '../../components/quest/SubmissionForm';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const QuestDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const addXP = useGameStore((state) => state.addXP);
  const addCoins = useGameStore((state) => state.addCoins);
  const [submitted, setSubmitted] = useState(false);

  // Mock quest for demo
  const mockQuest = {
    id: id || '1',
    family_id: '1',
    title: 'Read a book chapter',
    description: 'Read Chapter 3 of your favorite book and write a summary',
    type: 'learning' as const,
    status: 'active' as const,
    xp_reward: 50,
    coin_reward: 25,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const handleSubmit = async (data: any) => {
    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Award XP and coins
    addXP(mockQuest.xp_reward);
    addCoins(mockQuest.coin_reward);

    setSubmitted(true);

    // Show success for 2 seconds then redirect
    setTimeout(() => {
      navigate('/quests');
    }, 2000);
  };

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
            {mockQuest.title}
          </h1>
        </div>
        <p className="text-gray-300 text-lg mb-6">{mockQuest.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-secondary rounded-lg p-4">
            <p className="text-sm text-gray-400">XP Reward</p>
            <p className="text-2xl font-bold text-accent-cyan">{mockQuest.xp_reward}</p>
          </div>
          <div className="bg-secondary rounded-lg p-4">
            <p className="text-sm text-gray-400">Coin Reward</p>
            <p className="text-2xl font-bold text-accent-gold">{mockQuest.coin_reward}</p>
          </div>
        </div>
      </Card>

      <SubmissionForm
        quest={mockQuest}
        verificationType="text_answer"
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default QuestDetail;
