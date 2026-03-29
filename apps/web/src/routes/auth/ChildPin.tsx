import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';
import Button from '../../components/ui/Button';

const ChildPin: React.FC = () => {
  const navigate = useNavigate();
  const [pin, setPin] = useState('');
  const [childName, setChildName] = useState('');
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
    if (pin.length !== 4) {
      setError('Please enter a 4-digit PIN');
      return;
    }
    if (!childName.trim()) {
      setError('Please enter your name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Look up child by display_name
      const { data: children, error: lookupErr } = await supabase
        .from('children')
        .select('*, families(*)')
        .ilike('display_name', childName.trim());

      if (lookupErr || !children || children.length === 0) {
        setError('No child found with that name. Ask your parent to add you first.');
        setLoading(false);
        return;
      }

      const child = children[0];
      // Store child session
      useAuthStore.setState({
        childSession: child,
        family: child.families,
        isChild: true,
        isParent: false,
        loading: false,
      });
      localStorage.setItem('kidquest_child_session', JSON.stringify({
        childId: child.id,
        familyId: child.family_id,
      }));

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
      <p className="text-center text-sm text-gray-400">
        Enter your name and PIN to start your quest!
      </p>

      {/* Child Name Input */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Your Name</label>
        <input
          type="text"
          value={childName}
          onChange={(e) => setChildName(e.target.value)}
          placeholder="Enter your name"
          className="w-full px-4 py-3 rounded-lg bg-secondary border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-accent-gold"
        />
      </div>

      {/* PIN Display */}
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

      {/* PIN Pad */}
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
          <button
            key={digit}
            onClick={() => handlePinInput(digit.toString())}
            className="p-4 rounded-lg bg-gradient-to-b from-accent-gold to-yellow-600 text-primary font-bold text-2xl hover:shadow-lg hover:shadow-accent-gold/50 transition-all active:scale-95"
          >
            {digit}
          </button>
        ))}
        <button
          onClick={() => handlePinInput('0')}
          className="col-span-2 p-4 rounded-lg bg-gradient-to-b from-accent-gold to-yellow-600 text-primary font-bold text-2xl hover:shadow-lg hover:shadow-accent-gold/50 transition-all active:scale-95"
        >
          0
        </button>
        <button
          onClick={handleBackspace}
          className="p-4 rounded-lg bg-secondary text-accent-pink font-bold text-xl border border-accent-pink/50 hover:bg-secondary/80 transition-all"
        >
          \u2190
        </button>
      </div>

      <Button
        onClick={handleSubmit}
        className="w-full rpg-button"
        disabled={pin.length !== 4 || !childName.trim()}
        loading={loading}
      >
        Start Quest!
      </Button>

      <p className="text-center text-sm text-gray-400">
        <Link to="/login" className="text-accent-cyan hover:underline">
          Parent login
        </Link>
      </p>
    </div>
  );
};

export default ChildPin;import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';

const ChildPin: React.FC = () => {
  const navigate = useNavigate();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handlePinInput = (digit: string) => {
    if (pin.length < 4) {
      setPin(pin + digit);
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  const handleSubmit = () => {
    if (pin.length === 4) {
      // Verify PIN with backend
      navigate('/quests');
    } else {
      setError('Please enter a 4-digit PIN');
    }
  };

  return (
    <div className="glass-panel p-6 space-y-6">
      <h2 className="text-2xl font-display font-bold text-center">Enter Your PIN</h2>

      {/* PIN Display */}
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

      {/* PIN Pad */}
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
          <button
            key={digit}
            onClick={() => handlePinInput(digit.toString())}
            className="p-4 rounded-lg bg-gradient-to-b from-accent-gold to-yellow-600 text-primary font-bold text-2xl hover:shadow-lg hover:shadow-accent-gold/50 transition-all active:scale-95"
          >
            {digit}
          </button>
        ))}
        <button
          onClick={() => handlePinInput('0')}
          className="col-span-2 p-4 rounded-lg bg-gradient-to-b from-accent-gold to-yellow-600 text-primary font-bold text-2xl hover:shadow-lg hover:shadow-accent-gold/50 transition-all active:scale-95"
        >
          0
        </button>
        <button
          onClick={handleBackspace}
          className="p-4 rounded-lg bg-secondary text-accent-pink font-bold text-xl border border-accent-pink/50 hover:bg-secondary/80 transition-all"
        >
          ←
        </button>
      </div>

      <Button
        onClick={handleSubmit}
        className="w-full rpg-button"
        disabled={pin.length !== 4}
      >
        Continue
      </Button>
    </div>
  );
};

export default ChildPin;
