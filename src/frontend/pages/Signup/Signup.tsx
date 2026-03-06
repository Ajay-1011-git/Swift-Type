import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUp } from '@/backend/services/firebase';

export default function Signup() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (!displayName.trim()) {
      setError('Display name is required.');
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password, displayName.trim());
      setLoading(false);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
      setLoading(false);
    }
  };

  const inputClass = "w-full px-5 py-4 text-base bg-[#2c2e31] text-[#d1d0c5] rounded-xl border border-[#363739] focus:border-[#e2b714] outline-none transition-all duration-200 placeholder:text-[#454647]";

  return (
    <div className="flex-1 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-[480px] animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-[#d1d0c5] mb-3">
            Create your account
          </h1>
          <p className="text-[#646669] text-base">
            Start tracking your typing speed today
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="px-5 py-4 bg-[#ca4754]/10 border border-[#ca4754]/20 rounded-xl text-[#ca4754] text-sm animate-fade-in">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm text-[#646669] mb-2 font-medium uppercase tracking-wider">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              className={inputClass}
              placeholder="JohnDoe"
            />
          </div>

          <div>
            <label className="block text-sm text-[#646669] mb-2 font-medium uppercase tracking-wider">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputClass}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm text-[#646669] mb-2 font-medium uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={inputClass}
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm text-[#646669] mb-2 font-medium uppercase tracking-wider">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={inputClass}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 text-base font-semibold bg-[#e2b714] text-[#323437] rounded-xl hover:bg-[#c9a312] transition-all duration-200 hover:shadow-[0_0_20px_rgba(226,183,20,0.3)] disabled:opacity-50 mt-3"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="31.4 31.4" />
                </svg>
                Creating account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <p className="text-center text-base text-[#646669] mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-[#e2b714] font-semibold hover:underline transition-all">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
