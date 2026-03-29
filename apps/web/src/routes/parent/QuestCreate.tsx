import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const QuestCreate: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'learning',
    xpReward: 50,
    coinReward: 25,
    dueDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating quest:', formData);
    // Reset form
    setFormData({
      title: '',
      description: '',
      type: 'learning',
      xpReward: 50,
      coinReward: 25,
      dueDate: '',
    });
  };

  const templates = [
    {
      name: 'Read a chapter',
      type: 'learning',
      xp: 50,
      coins: 25,
    },
    {
      name: 'Clean room',
      type: 'chore',
      xp: 30,
      coins: 15,
    },
    {
      name: 'Exercise',
      type: 'exercise',
      xp: 40,
      coins: 20,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Create Quest</h1>

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
                  type: template.type,
                  xpReward: template.xp,
                  coinReward: template.coins,
                })
              }
              className="p-3 rounded border-2 border-gray-300 hover:border-blue-500 text-left transition-all"
            >
              <p className="font-semibold text-sm text-gray-800">{template.name}</p>
              <p className="text-xs text-gray-600">{template.xp} XP / {template.coins} coins</p>
            </button>
          ))}
        </div>
      </Card>

      {/* Custom Quest Form */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Custom Quest</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
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

          <Input
            label="Due Date"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          />

          <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white">
            Create Quest
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default QuestCreate;
