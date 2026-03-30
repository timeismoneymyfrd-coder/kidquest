import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { signIn } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      navigate('/parent/dashboard');
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel p-6 space-y-4">
      <h2 className="text-2xl font-display font-bold text-center mb-2">Parent Login</h2>

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

      <div className="text-center space-y-2">
        <p className="text-sm text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-accent-cyan hover:underline">
            Sign up
          </Link>
        </p>
        <p className="text-sm text-gray-400">
          <Link to="/child-pin" className="text-accent-gold hover:underline">
            Child login with PIN
          </Link>
        </p>
      </div>
    </form>
  );
};

export default Login;
