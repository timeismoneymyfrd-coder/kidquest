import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useQuestStore } from '../../stores/questStore';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import type { Quest, Child } from '../../types';

const QuestReview: React.FC = () => {
  const family = useAuthStore((state) => state.family);
  const quests = useQuestStore((state) => state.quests);
  const loading = useQuestStore((state) => state.loading);
  const fetchPendingReview = useQuestStore((state) => state.fetchPendingReview);
  const verifyQuest = useQuestStore((state) => state.verifyQuest);
  const [children, setChildren] = useState<Record<string, Child>>({});
  const [rejecting, setRejecting] = useState<string | null>(null);

  useEffect(() => {
    if (family?.id) {
      fetchPendingReview(family.id);
    }
  }, [family?.id, fetchPendingReview]);

  useEffect(() => {
    const loadChildren = async () => {
      if (quests.length === 0) return;

      const { supabase } = await import('../../lib/supabase');
      const childIds = [...new Set(quests.map((q) => q.child_id))];

      const { data } = await supabase.from('children').select('*').in('id', childIds);

      if (data) {
        const childMap: Record<string, Child> = {};
        data.forEach((child) => {
          childMap[child.id] = child;
        });
        setChildren(childMap);
      }
    };

    loadChildren();
  }, [quests]);

  const handleApprove = async (questId: string) => {
    await verifyQuest(questId, true);
  };

  const handleReject = async (questId: string) => {
    setRejecting(questId);
    await verifyQuest(questId, false);
    setRejecting(null);
  };

  const pendingQuests = quests.filter((q) => q.status === 'submitted');

  if (loading && quests.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <p className="text-lg text-gray-600">Loading submissions...</p>
      </div>
    );
  }

  if (pendingQuests.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Review Submissions</h1>
        <Card className="p-8 text-center bg-white">
          <p className="text-xl text-gray-600">No pending submissions</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Review Submissions</h1>

      <div className="space-y-4">
        {pendingQuests.map((quest) => {
          const child = children[quest.child_id];
          const submittedTime = quest.completed_at
            ? new Date(quest.completed_at).toLocaleDateString()
            : 'Unknown';

          return (
            <Card key={quest.id} className="p-6 bg-white">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{quest.title}</h3>
                  <p className="text-sm text-gray-600">
                    From: {child?.display_name || 'Unknown'}
                  </p>
                </div>
                <span className="text-xs text-gray-400">{submittedTime}</span>
              </div>

              <div className="bg-gray-50 rounded p-3 mb-4">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Description:</span> {quest.description}
                </p>
                {quest.submission && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Submission Type:</span> {quest.verification}
                    </p>
                    {quest.submission.answer && (
                      <p className="text-sm text-gray-600 mt-1">
                        Answer: {quest.submission.answer}
                      </p>
                    )}
                    {quest.submission.photo_url && (
                      <p className="text-sm text-gray-600 mt-1">Photo submitted</p>
                    )}
                    {quest.submission.time_spent_seconds && (
                      <p className="text-sm text-gray-600 mt-1">
                        Time: {Math.round(quest.submission.time_spent_seconds / 60)} minutes
                      </p>
                    )}
                  </div>
                )}
                <div className="mt-3 flex gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">XP Reward: </span>
                    <span className="font-bold text-cyan-600">{quest.xp_reward}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Coin Reward: </span>
                    <span className="font-bold text-amber-600">{quest.coin_reward}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => handleReject(quest.id)}
                  disabled={rejecting === quest.id}
                >
                  {rejecting === quest.id ? 'Rejecting...' : 'Reject'}
                </Button>
                <Button
                  className="bg-green-500 hover:bg-green-600 text-white"
                  onClick={() => handleApprove(quest.id)}
                  disabled={rejecting !== null}
                >
                  Approve
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default QuestReview;
