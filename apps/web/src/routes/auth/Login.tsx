import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signIn } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { initialize } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: signInError } = await signIn(email, password);
      if (signInError) {
        setError(signInError.message);
      } else {
        await initialize();
        const { isParent } = useAuthStore.getState();
        navigate(isParent ? '/parent/dashboard' : '/quests');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel p-6 space-y-4">
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {error && (
        <div className="p-3 bg-accent-pink/10 border border-accent-pink/50 rounded-lg text-accent-pink text-sm">
          {error}
        </div>
      )}

      <Button
        type="submit"
        className="w-full rpg-button"
        loading={loading}
      >
        Sign In
      </Button>

      <p className="text-center text-sm text-gray-400">
        Don't have an account?{' '}
        <Link to="/register" className="text-accent-cyan hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
};

export default Login;
