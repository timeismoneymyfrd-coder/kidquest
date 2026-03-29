import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'role' | 'signup'>('role');
  const [role, setRole] = useState<'parent' | 'child' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    if (!displayName || !familyName) { setError('Please fill in all fields'); return; }
    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email, password, options: { data: { role: 'parent' } },
      });
      if (authError) { setError(authError.message); return; }
      if (!authData.user) { setError('Registration failed'); return; }
      const { data: family, error: famError } = await supabase
        .from('families').insert({ name: familyName }).select().single();
      if (famError) { setError(famError.message); return; }
      const { error: parentError } = await supabase
        .from('parents').insert({ id: authData.user.id, family_id: family.id, display_name: displayName });
      if (parentError) { setError(parentError.message); return; }
      navigate('/parent/dashboard');
    } catch (err) { setError('An unexpected error occurred'); }
    finally { setLoading(false); }
  };

  return (
    <div className="glass-panel p-6 space-y-4">
      {step === 'role' && (
        <div className="space-y-4">
          <h2 className="text-2xl font-display font-bold text-center mb-6">Who are you?</h2>
          <button
            onClick={() => { setRole('parent'); setStep('signup'); }}
            className="w-full p-4 rounded-lg border-2 border-accent-cyan text-accent-cyan hover:bg-accent-cyan/10 transition-colors font-bold"
          >
            I'm a Parent
          </button>
          <button
            onClick={() => navigate('/child-pin')}
            className="w-full p-4 rounded-lg border-2 border-accent-gold text-accent-gold hover:bg-accent-gold/10 transition-colors font-bold"
          >
            I'm a Child
          </button>
        </div>
      )}
      {step === 'signup' && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <button type="button" onClick={() => setStep('role')} className="text-sm text-accent-cyan hover:underline">
            Back
          </button>
          <Input label="Display Name" type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
          <Input label="Family Name" type="text" value={familyName} onChange={(e) => setFamilyName(e.target.value)} required />
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Input label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          {error && (
            <div className="p-3 bg-accent-pink/10 border border-accent-pink/50 rounded-lg text-accent-pink text-sm">
              {error}
            </div>
          )}
          <Button type="submit" className="w-full rpg-button" loading={loading}>
            Create Family Account
          </Button>
          <p className="text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-accent-cyan hover:underline">Sign in</Link>
          </p>
        </form>
      )}
    </div>
  );
};

export default Register;
