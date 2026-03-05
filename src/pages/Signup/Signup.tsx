import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUp, createUserProfile } from '../../services/firebase';

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
            const user = await signUp(email, password, displayName.trim());
            await createUserProfile(user.uid, email, displayName.trim());
            navigate('/');
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Signup failed';
            if (message.includes('email-already-in-use')) {
                setError('An account with this email already exists.');
            } else if (message.includes('invalid-email')) {
                setError('Invalid email address.');
            } else if (message.includes('weak-password')) {
                setError('Password is too weak. Use at least 6 characters.');
            } else {
                setError(message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 flex items-center justify-center px-4">
            <div className="w-full max-w-md animate-fade-in">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
                        Create your account
                    </h1>
                    <p className="text-[var(--color-text-secondary)] text-sm">
                        Start tracking your typing speed today
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="px-4 py-3 bg-[var(--color-error)]/10 border border-[var(--color-error)]/20 rounded-lg text-[var(--color-error)] text-sm animate-fade-in">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs text-[var(--color-text-secondary)] mb-2 font-medium">
                            Display Name
                        </label>
                        <input
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-lg border border-[var(--color-bg-tertiary)] focus:border-[var(--color-accent)] outline-none transition-colors text-sm"
                            placeholder="JohnDoe"
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-[var(--color-text-secondary)] mb-2 font-medium">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-lg border border-[var(--color-bg-tertiary)] focus:border-[var(--color-accent)] outline-none transition-colors text-sm"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-[var(--color-text-secondary)] mb-2 font-medium">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-lg border border-[var(--color-bg-tertiary)] focus:border-[var(--color-accent)] outline-none transition-colors text-sm"
                            placeholder="••••••••"
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-[var(--color-text-secondary)] mb-2 font-medium">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-lg border border-[var(--color-bg-tertiary)] focus:border-[var(--color-accent)] outline-none transition-colors text-sm"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-[var(--color-accent)] text-[var(--color-bg-primary)] rounded-lg font-semibold text-sm hover:bg-[var(--color-accent-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="31.4 31.4" />
                                </svg>
                                Creating account...
                            </span>
                        ) : (
                            'Create Account'
                        )}
                    </button>
                </form>

                <p className="text-center text-sm text-[var(--color-text-secondary)] mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-[var(--color-accent)] font-medium hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
