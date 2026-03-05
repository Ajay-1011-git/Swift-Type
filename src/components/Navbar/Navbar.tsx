import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import { logOut } from '../../services/firebase';

export default function Navbar() {
    const { user } = useUserStore();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await logOut();
        setDropdownOpen(false);
        navigate('/login');
    };

    return (
        <nav className="flex items-center justify-between px-8 py-4 bg-[var(--color-bg-primary)] border-b border-[var(--color-bg-tertiary)]">
            {/* Left side */}
            <div className="flex items-center gap-6">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 bg-[var(--color-accent)] rounded-lg flex items-center justify-center transition-transform group-hover:scale-110">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-bg-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold text-[var(--color-text-primary)] tracking-tight">
                        Swift<span className="text-[var(--color-accent)]">Type</span>
                    </span>
                </Link>

                <div className="flex items-center gap-3 ml-4">
                    <button
                        className="p-2 rounded-lg hover:bg-[var(--color-bg-secondary)] transition-colors text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                        title="Keyboard shortcuts: Tab+Enter to restart, Esc to reset"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="4" width="20" height="16" rx="2" />
                            <path d="M6 8h.001M10 8h.001M14 8h.001M18 8h.001M8 12h.001M12 12h.001M16 12h.001M7 16h10" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
                {user ? (
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-[var(--color-bg-secondary)] transition-colors"
                        >
                            <div className="w-8 h-8 bg-[var(--color-accent)] rounded-full flex items-center justify-center text-[var(--color-bg-primary)] font-bold text-sm">
                                {(user.displayName || user.email || 'U')[0].toUpperCase()}
                            </div>
                            <span className="text-sm text-[var(--color-text-secondary)] hidden sm:block">
                                {user.displayName || user.email?.split('@')[0]}
                            </span>
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className={`text-[var(--color-text-secondary)] transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                            >
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 top-12 w-48 bg-[var(--color-bg-secondary)] rounded-lg border border-[var(--color-bg-tertiary)] shadow-xl z-50 animate-fade-in overflow-hidden">
                                <Link
                                    to="/profile"
                                    onClick={() => setDropdownOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--color-bg-tertiary)] transition-colors text-[var(--color-text-primary)] text-sm"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                    Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--color-bg-tertiary)] transition-colors text-[var(--color-error)] text-sm"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                        <polyline points="16 17 21 12 16 7" />
                                        <line x1="21" y1="12" x2="9" y2="12" />
                                    </svg>
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <Link
                            to="/login"
                            className="px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                        >
                            Login
                        </Link>
                        <Link
                            to="/signup"
                            className="px-4 py-2 text-sm bg-[var(--color-accent)] text-[var(--color-bg-primary)] rounded-lg font-medium hover:bg-[var(--color-accent-hover)] transition-colors"
                        >
                            Sign Up
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}
