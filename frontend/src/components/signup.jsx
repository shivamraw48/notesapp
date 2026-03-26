import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Password strength checker
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[@$!%*?&]/.test(pwd)) strength++;

    const labels = {
      1: { label: 'Weak', color: 'bg-red-500' },
      2: { label: 'Fair', color: 'bg-orange-500' },
      3: { label: 'Good', color: 'bg-yellow-500' },
      4: { label: 'Strong', color: 'bg-green-500' },
      5: { label: 'Very Strong', color: 'bg-green-600' },
    };

    return { strength, ...labels[strength] };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (passwordStrength.strength < 4) {
      setError('Password must be at least 8 characters with uppercase, lowercase, number, and special character.');
      setLoading(false);
      return;
    }

    try {
      await authAPI.register(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl">
        <div className="text-center">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500 drop-shadow-sm">
            Create an Account
          </h1>
          <p className="mt-2 text-slate-500">Get started with your new notes account</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSignup}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input id="email-address" name="email" type="email" autoComplete="email" required
                className="relative block w-full px-4 py-3 text-lg placeholder-slate-400 border-b-4 rounded-t-xl bg-slate-50 border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 transition-all"
                placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input id="password" name="password" type="password" autoComplete="new-password" required
                className="relative block w-full px-4 py-3 text-lg placeholder-slate-400 border-b-4 bg-slate-50 border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 transition-all"
                placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              {password && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-grow h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className={`h-full ${passwordStrength.color} transition-all`} style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}></div>
                  </div>
                  <span className={`text-sm font-semibold ${passwordStrength.color.replace('bg-', 'text-')}`}>{passwordStrength.label}</span>
                </div>
              )}
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
              <input id="confirm-password" name="confirm-password" type="password" autoComplete="new-password" required
                className="relative block w-full px-4 py-3 text-lg placeholder-slate-400 border-b-4 rounded-b-xl bg-slate-50 border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 transition-all"
                placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
          </div>

          {error && (
            <div className="p-3 text-center text-red-800 bg-red-100 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <button type="submit" disabled={loading}
              className="group relative flex justify-center w-full px-4 py-3 text-lg font-bold text-white bg-indigo-600 border-b-4 border-indigo-800 rounded-xl hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 active:border-b-0 active:translate-y-1 disabled:bg-slate-400 disabled:border-slate-500 transition-all">
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </div>
        </form>
        <p className="mt-6 text-center text-slate-500">
          Already have an account?{' '}
          <Link to="/" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;