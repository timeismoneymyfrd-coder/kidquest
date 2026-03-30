import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { supabase } from '../../lib/supabase';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import type { Child } from '../../types';

const FamilyManager: React.FC = () => {
  const navigate = useNavigate();
  const family = useAuthStore((state) => state.family);
  const [children, setChildren] = useState<Child[]>([]);
  const [showAddChild, setShowAddChild] = useState(false);
  const [loading, setLoading] = useState(true);
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [generatedPin, setGeneratedPin] = useState<string | null>(null);

  useEffect(() => {
    const loadChildren = async () => {
      if (!family?.id) return;

      try {
        const { data } = await supabase
          .from('children')
          .select('*')
          .eq('family_id', family.id)
          .order('created_at', { ascending: false });

        if (data) {
          setChildren(data);
        }
      } catch (err) {
        console.error('Failed to load children:', err);
      } finally {
        setLoading(false);
      }
    };

    loadChildren();
  }, [family?.id]);

  const generatePin = (): string => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const handleAddChild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!childName || !family?.id) return;

    setSubmitting(true);
    try {
      const pin = generatePin();

      // Hash the PIN on the client (in production, this should be done server-side)
      const { data } = await supabase.from('children').insert({
        family_id: family.id,
        display_name: childName,
        avatar_seed: Math.random().toString(36).substring(7),
        birth_year: childAge ? new Date().getFullYear() - parseInt(childAge) : null,
        pin_hash: pin, // In production, use proper hashing
        xp: 0,
        level: 1,
        star_coins: 0,
        streak_days: 0,
        interests: [],
        vocab_level: 'beginner',
        preferred_language: 'zh',
      }).select();

      if (data) {
        setGeneratedPin(pin);
        setChildren([...children, data[0]]);

        // Reset form after delay
        setTimeout(() => {
          setChildName('');
          setChildAge('');
          setGeneratedPin(null);
          setShowAddChild(false);
        }, 3000);
      }
    } catch (err) {
      console.error('Failed to add child:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewProgress = (childId: string) => {
    navigate(`/parent/progress/${childId}`);
  };

  const formatLastActive = (lastActiveDate: string | null): string => {
    if (!lastActiveDate) return 'Never';
    const date = new Date(lastActiveDate);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;

    const days = Math.floor(hours / 24);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <p className="text-lg text-gray-600">Loading family...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Family Manager</h1>
        <Button
          onClick={() => setShowAddChild(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          Add Child
        </Button>
      </div>

      {/* Children List */}
      {children.length === 0 ? (
        <Card className="p-8 text-center bg-white">
          <p className="text-gray-600 mb-4">No children in your family yet</p>
          <Button
            onClick={() => setShowAddChild(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Add Your First Child
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {children.map((child) => (
            <Card key={child.id} className="p-6 bg-white">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{child.display_name}</h3>
                  <p className="text-sm text-gray-600">
                    Last active: {formatLastActive(child.last_active_date)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Level</p>
                  <p className="text-2xl font-bold text-blue-500">{child.level}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded p-3 mb-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs text-gray-600">XP</p>
                    <p className="font-bold text-cyan-600">{child.xp}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Coins</p>
                    <p className="font-bold text-amber-600">{child.star_coins}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Streak</p>
                    <p className="font-bold text-pink-600">{child.streak_days} days</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => handleViewProgress(child.id)}
                >
                  View Progress
                </Button>
                <Button variant="outline">Edit Settings</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Child Modal */}
      <Modal
        isOpen={showAddChild}
        onClose={() => {
          if (!generatedPin) setShowAddChild(false);
        }}
        title={generatedPin ? 'Child PIN Generated' : 'Add Child to Family'}
      >
        {generatedPin ? (
          <div className="space-y-4 text-center">
            <div className="bg-blue-50 rounded p-4">
              <p className="text-sm text-gray-600 mb-2">Your child's login PIN:</p>
              <p className="text-4xl font-bold text-blue-600 font-mono tracking-widest">
                {generatedPin}
              </p>
            </div>
            <p className="text-sm text-gray-600">
              Save this PIN somewhere safe. Your child will need it to log in.
            </p>
            <Button
              onClick={() => {
                setChildName('');
                setChildAge('');
                setGeneratedPin(null);
                setShowAddChild(false);
              }}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleAddChild} className="space-y-4">
            <Input
              label="Child Name"
              placeholder="Enter child's name"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              required
            />
            <Input
              label="Age"
              type="number"
              placeholder="Age"
              value={childAge}
              onChange={(e) => setChildAge(e.target.value)}
              min="3"
              max="18"
            />
            <p className="text-sm text-gray-600">
              A 4-digit PIN will be generated for the child to log in.
            </p>
            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              {submitting ? 'Creating...' : 'Add Child'}
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default FamilyManager;
