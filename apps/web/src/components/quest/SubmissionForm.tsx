import React, { useState } from 'react';
import { Quest, VerificationType } from '../../types';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface SubmissionFormProps {
  quest: Quest;
  verificationType: VerificationType;
  onSubmit: (data: any) => Promise<void>;
}

const SubmissionForm: React.FC<SubmissionFormProps> = ({ quest, verificationType, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    text: '',
    duration: 0,
    answer: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Card>
        <h3 className="text-lg font-display font-bold mb-4">{quest.title}</h3>
        <p className="text-gray-300 mb-6">{quest.description}</p>

        {verificationType === 'text_answer' && (
          <Input
            label="Your Answer"
            value={data.text}
            onChange={(e) => setData({ ...data, text: e.target.value })}
            placeholder="Type your answer here..."
            required
          />
        )}

        {verificationType === 'timer' && (
          <div className="space-y-2">
            <label className="block text-sm font-medium">Duration (minutes)</label>
            <Input
              type="number"
              min="1"
              value={data.duration}
              onChange={(e) => setData({ ...data, duration: parseInt(e.target.value) })}
              required
            />
          </div>
        )}

        {verificationType === 'photo' && (
          <div className="space-y-2">
            <label className="block text-sm font-medium">Upload Photo</label>
            <input
              type="file"
              accept="image/*"
              className="w-full px-4 py-2 rounded-lg bg-secondary border border-accent-cyan/30"
            />
          </div>
        )}

        {verificationType === 'auto' && (
          <p className="text-accent-green">✓ This quest will be automatically verified!</p>
        )}
      </Card>

      <Button
        type="submit"
        className="w-full rpg-button"
        loading={loading}
      >
        Submit Quest
      </Button>
    </form>
  );
};

export default SubmissionForm;
