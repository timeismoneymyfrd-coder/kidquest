import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { supabase } from '../../lib/supabase';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import type { Child, QuestType, VerificationType } from '../../types';

const QuestCreate: React.FC = () => {
  const family = useAuthStore((state) => state.family);
  const [children, setChildren] = useState<Child[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'learning' as QuestType,
    difficulty: 2,
    estimatedMinutes: 30,
    xpReward: 50,
    coinReward: 25,
    verification: 'parent' as VerificationType,
    childId: '',
    scheduledFor: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadChildren = async () => {
      if (!family?.id) return;

      try {
        const { data } = await supabase
          .from('children')
          .select('*')
          .eq('family_id', family.id);

        if (data && data.length > 0) {
          setChildren(data);
          setFormData((prev) => ({ ...prev, childId: data[0].id }));
        }
      } catch (err) {
        console.error('Failed to load children:', err);
      } finally {
        setLoading(false);
      }
    };

    loadChildren();
  }, [family?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.childId || !family?.id) return;

    setSubmitting(true);
    try {
      await supabase.from('quests').insert({
        family_id: family.id,
        child_id: formData.childId,
        title: formData.title,
        description: formData.description,
        type: formData.type,
        difficulty: formData.difficulty,
        estimated_minutes: formData.estimatedMinutes,
        xp_reward: formData.xpReward,
        coin_reward: formData.coinReward,
        bonus_multiplier: 1,
        status: 'active',
        source: 'parent',
        verification: formData.verification,
        verification_config: {},
        submission: null,
        scheduled_for: formData.scheduledFor,
      });

      setSuccess(true);
      // Reset form
      setFormData({
        title: '',
        description: '',
        type: 'learning',
        difficulty: 2,
        estimatedMinutes: 30,
        xpReward: 50,
        coinReward: 25,
        verification: 'parent',
        childId: children[0]?.id || '',
        scheduledFor: new Date().toISOString().split('T')[0],
      });

      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      console.error('Failed to create quest:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const templates = [
    { name: 'Read a chapter', type: 'learning', xp: 50, coins: 25, difficulty: 2, minutes: 30 },
    { name: 'Clean room', type: 'chore', xp: 30, coins: 15, difficulty: 1, minutes: 20 },
    { name: 'Exercise', type: 'exercise', xp: 40, coins: 20, difficulty: 3, minutes: 15 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Create Quest</h1>

      {success && (
        <Card className="p-4 bg-green-50 border-green-200">
          <p className="text-green-800 font-semibold">Quest created successfully!</p>
        </Card>
      )}

      {/* Quick Templates */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Templates</h2>
        <div className="grid grid-cols-3 gap-3">
          {templates.map((template) => (
            <button
              key={template.name}
              onClick={() =>
                setFormData({
                  ...formData,
                  title: template.name,
                  type: template.type as QuestType,
                  xpReward: template.xp,
                  coinReward: template.coins,
                  difficulty: template.difficulty,
                  estimatedMinutes: template.minutes,
                })
              }
              className="p-3 rounded border-2 border-gray-300 hover:border-blue-500 text-left transition-all"
            >
              <p className="font-semibold text-sm text-gray-800">{template.name}</p>
              <p className="text-xs text-gray-600">
                {template.xp} XP / {template.coins} coins
              </p>
            </button>
          ))}
        </div>
      </Card>

      {/* Custom Quest Form */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Custom Quest</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Child</label>
            <select
              value={formData.childId}
              onChange={(e) => setFormData({ ...formData, childId: e.target.value })}
              className="w-full px-4 py-2 rounded border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
              required
            >
              {children.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.display_name}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Quest Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 rounded border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as QuestType })}
              className="w-full px-4 py-2 rounded border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
            >
              <option value="learning">Learning</option>
              <option value="chore">Chore</option>
              <option value="exercise">Exercise</option>
              <option value="creative">Creative</option>
              <option value="nutrition">Nutrition</option>
              <option value="challenge">Challenge</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Difficulty (1-5)"
              type="number"
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: parseInt(e.target.value) })}
              min="1"
              max="5"
            />
            <Input
              label="Estimated Minutes"
              type="number"
              value={formData.estimatedMinutes}
              onChange={(e) =>
                setFormData({ ...formData, estimatedMinutes: parseInt(e.target.value) })
              }
              min="5"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="XP Reward"
              type="number"
              value={formData.xpReward}
              onChange={(e) => setFormData({ ...formData, xpReward: parseInt(e.target.value) })}
              min="10"
            />
            <Input
              label="Coin Reward"
              type="number"
              value={formData.coinReward}
              onChange={(e) => setFormData({ ...formData, coinReward: parseInt(e.target.value) })}
              min="5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Verification Type
            </label>
            <select
              value={formData.verification}
              onChange={(e) => setFormData({ ...formData, verification: e.target.value as VerificationType })}
              className="w-full px-4 py-2 rounded border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
            >
              <option value="auto">Auto (Timer)</option>
              <option value="photo">Photo</option>
              <option value="parent">Parent Review</option>
              <option value="text_answer">Text Answer</option>
            </select>
          </div>

          <Input
            label="Scheduled For"
            type="date"
            value={formData.scheduledFor}
            onChange={(e) => setFormData({ ...formData, scheduledFor: e.target.value })}
          />

          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          >
            {submitting ? 'Creating...' : 'Create Quest'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default QuestCreate;
