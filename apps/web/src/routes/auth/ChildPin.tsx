import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';

const ChildPin: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePinInput = (digit: string) => {
    if (pin.length < 4) {
      setPin(pin + digit);
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (pin.length !== 4) {
      setError('Please enter a 4-digit PIN');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const { data: children, error: lookupError } = await supabase
        .from('children')
        .select('*')
        .ilike('display_name', name.trim());

      if (lookupError) {
        setError('Something went wrong. Please try again.');
        setLoading(false);
        return;
      }

      if (!children || children.length === 0) {
        setError('Child not found. Check the name and try again.');
        setLoading(false);
        return;
      }

      const child = children[0];

      if (child.pin_hash !== pin) {
        setError('Wrong PIN. Please try again.');
        setPin('');
        setLoading(false);
        return;
      }

      const { data: family } = await supabase
        .from('families')
        .select('*')
        .eq('id', child.family_id)
        .single();

      useAuthStore.getState().childSession = child;
      useAuthStore.getState().family = family;
      useAuthStore.getState().isChild = true;
      useAuthStore.getState().isParent = false;

      localStorage.setItem(
        'kidquest_child_session',
        JSON.stringify({ childId: child.id, familyId: child.family_id })
      );

      navigate('/quests');
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-6 space-y-6">
      <h2 className="text-2xl font-display font-bold text-center">Child Login</h2>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Your Name</label>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-secondary border border-gray-600 text-white placeholder-gray-500 focus:border-accent-gold focus:outline-none"
        />
      </div>

      <div className="flex justify-center gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-14 h-14 rounded-lg bg-secondary border-2 border-accent-gold flex items-center justify-center text-2xl font-bold text-accent-gold"
          >
            {pin[i] ? '\u2022' : ''}
          </div>
        ))}
      </div>

      {error && (
        <div className="p-3 bg-accent-pink/10 border border-accent-pink/50 rounded-lg text-accent-pink text-sm text-center">
          {error}
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
          <button
            key={digit}
            type="button"
            onClick={() => handlePinInput(digit.toString())}
            className="p-4 rounded-lg bg-gradient-to-b from-accent-gold to-yellow-600 text-primary font-bold text-2xl hover:shadow-lg hover:shadow-accent-gold/50 transition-all active:scale-95"
          >
            {digit}
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';

const ChildPin: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePinInput = (digit: string) => {
    if (pin.length < 4) {
      setPin(pin + digit);
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (pin.length !== 4) {
      setError('Please enter a 4-digit PIN');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const { data: children, error: lookupError } = await supabase
        .from('children')
        .select('*')
        .ilike('display_name', name.trim());

      if (lookupError) {
        setError('Something went wrong. Please try again.');
        setLoading(false);
        return;
      }

      if (!children || children.length === 0) {
        setError('Child not found. Check the name and try again.');
        setLoading(false);
        return;
      }

      const child = children[0];

      if (child.pin_hash !== pin) {
        setError('Wrong PIN. Please try again.');
        setPin('');
        setLoading(false);
        return;
      }

      const { data: family } = await supabase
        .from('families')
        .select('*')
        .eq('id', child.family_id)
        .single();

      useAuthStore.getState().childSession = child;
      useAuthStore.getState().family = family;
      useAuthStore.getState().isChild = true;
      useAuthStore.getState().isParent = false;

      localStorage.setItem(
        'kidquest_child_session',
        JSON.stringify({ childId: child.id, familyId: child.family_id })
      );

      navigate('/quests');
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-6 space-y-6">
      <h2 className="text-2xl font-display font-bold text-center">Child Login</h2>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Your Name</label>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-secondary border border-gray-600 text-white placeholder-gray-500 focus:border-accent-gold focus:outline-none"
        />
      </div>

      <div className="flex justify-center gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-14 h-14 rounded-lg bg-secondary border-2 border-accent-gold flex items-center justify-center text-2xl font-bold text-accent-gold"
          >
            {pin[i] ? '•' : ''}
          </div>
        ))}
      </div>

      {error && (
        <div className="p-3 bg-accent-pink/10 border border-accent-pink/50 rounded-lg text-accent-pink text-sm text-center">
          {error}
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
          <button
            key={digit}
            type="button"
            onClick={() => handlePinInput(digit.toString())}
            className="p-4 rounded-lg bg-gradient-to-b from-accent-gold to-yellow-600 text-primary font-bold text-2xl hover:shadow-lg hover:shadow-accent-gold/50 transition-all active:scale-95"
          >
            {digit}
          </button>
        ))}
        <button
          type="button"
          onClick={() => handlePinInput('0')}
          className="col-span-2 p-4 rounded-lg bg-gradient-to-b from-accent-gold to-yellow-600 text-primary font-bold text-2xl hover:shadow-lg hover:shadow-accent-gold/50 transition-all active:scale-95"
        >
          0
        </button>
        <button
          type="button"
          onClick={handleBackspace}
          className="p-4 rounded-lg bg-secondary text-accent-pink font-bold text-xl border border-accent-pink/50 hover:bg-secondary/80 transition-all"
        >
          ←
        </button>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={pin.length !== 4 || !name.trim() || loading}
        className="w-full p-4 rounded-lg bg-gradient-to-r from-accent-cyan to-blue-600 text-white font-bold text-lg disabled:opacity-50 hover:shadow-lg transition-all active:scale-95"
      >
        {loading ? 'Checking...' : 'Start Quest!'}
      </button>

      <p className="text-center text-sm text-gray-400">
        <a href="/login" className="text-accent-cyan hover:underline">Parent login</a>
      </p>
    </div>
  );
};

export default ChildPin;
