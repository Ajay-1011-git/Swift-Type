import { useEffect, useState } from 'react';
import { useUserStore } from '../../store/userStore';
import { getUserTests, getUserTestsByDuration, type TypingTestResult } from '../../services/firebase';
import ProfileCard from '../../components/ProfileCard/ProfileCard';
import { PerformanceChart } from '../../components/Graphs/Graphs';
import { formatNumber } from '../../utils/wpmCalculator';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
    const { user, profile } = useUserStore();
    const navigate = useNavigate();
    const [tests, setTests] = useState<TypingTestResult[]>([]);
    const [durationStats, setDurationStats] = useState<Record<number, { bestWPM: number; avgAccuracy: number }>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const userTests = await getUserTests(user.uid, 100);
                setTests(userTests);

                // Fetch stats by duration
                const durations = [15, 30, 60, 120];
                const stats: Record<number, { bestWPM: number; avgAccuracy: number }> = {};

                for (const d of durations) {
                    const dTests = await getUserTestsByDuration(user.uid, d);
                    if (dTests.length > 0) {
                        const bestWPM = Math.max(...dTests.map((t) => t.wpm));
                        const avgAccuracy =
                            dTests.reduce((sum, t) => sum + t.accuracy, 0) / dTests.length;
                        stats[d] = { bestWPM, avgAccuracy: Math.round(avgAccuracy * 100) / 100 };
                    } else {
                        stats[d] = { bestWPM: 0, avgAccuracy: 0 };
                    }
                }

                setDurationStats(stats);
            } catch (err) {
                console.error('Failed to load profile data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, navigate]);

    if (!user || !profile) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="text-[var(--color-text-secondary)]">Loading profile...</div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="flex items-center gap-3 text-[var(--color-text-secondary)]">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="31.4 31.4" />
                    </svg>
                    Loading your stats...
                </div>
            </div>
        );
    }

    // Build WPM improvement chart data
    const wpmOverTime = tests
        .slice()
        .reverse()
        .map((t, i) => ({
            label: `#${i + 1}`,
            value: t.wpm,
        }))
        .slice(-30); // last 30 tests

    return (
        <div className="flex-1 px-4 py-8 max-w-5xl mx-auto w-full">
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">Profile</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Profile card */}
                <div className="lg:col-span-1">
                    <ProfileCard
                        profile={profile}
                        email={user.email || ''}
                        displayName={user.displayName || profile.displayName || 'User'}
                    />
                </div>

                {/* Right: Performance cards */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Duration cards */}
                    <div>
                        <h2 className="text-sm font-medium text-[var(--color-text-secondary)] mb-3">
                            Performance by Duration
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[15, 30, 60, 120].map((d) => {
                                const stat = durationStats[d] || { bestWPM: 0, avgAccuracy: 0 };
                                return (
                                    <div
                                        key={d}
                                        className="bg-[var(--color-card)] rounded-xl p-4 border border-[var(--color-bg-tertiary)] hover:border-[var(--color-accent)] transition-colors animate-fade-in"
                                    >
                                        <div className="text-lg font-bold text-[var(--color-accent)] font-[var(--font-mono)] mb-1">
                                            {d}s
                                        </div>
                                        <div className="text-sm text-[var(--color-text-primary)] font-[var(--font-mono)]">
                                            {formatNumber(stat.bestWPM)} <span className="text-xs text-[var(--color-text-secondary)]">wpm</span>
                                        </div>
                                        <div className="text-xs text-[var(--color-text-secondary)] font-[var(--font-mono)] mt-1">
                                            {formatNumber(stat.avgAccuracy)}% acc
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* WPM over time chart */}
                    {wpmOverTime.length > 1 && (
                        <div className="bg-[var(--color-card)] rounded-xl p-5 border border-[var(--color-bg-tertiary)] animate-fade-in">
                            <h3 className="text-sm font-medium text-[var(--color-text-secondary)] mb-4">
                                WPM Improvement Over Time
                            </h3>
                            <PerformanceChart data={wpmOverTime} title="WPM" />
                        </div>
                    )}

                    {/* Recent tests */}
                    {tests.length > 0 && (
                        <div className="bg-[var(--color-card)] rounded-xl p-5 border border-[var(--color-bg-tertiary)] animate-fade-in">
                            <h3 className="text-sm font-medium text-[var(--color-text-secondary)] mb-4">
                                Recent Tests
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-[var(--color-bg-tertiary)]">
                                            <th className="text-left py-2 text-[var(--color-text-secondary)] font-medium text-xs">WPM</th>
                                            <th className="text-left py-2 text-[var(--color-text-secondary)] font-medium text-xs">Raw</th>
                                            <th className="text-left py-2 text-[var(--color-text-secondary)] font-medium text-xs">Accuracy</th>
                                            <th className="text-left py-2 text-[var(--color-text-secondary)] font-medium text-xs">Mode</th>
                                            <th className="text-left py-2 text-[var(--color-text-secondary)] font-medium text-xs">Duration</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tests.slice(0, 10).map((test, i) => (
                                            <tr key={i} className="border-b border-[var(--color-bg-tertiary)]/50 hover:bg-[var(--color-bg-tertiary)] transition-colors">
                                                <td className="py-2.5 font-[var(--font-mono)] text-[var(--color-accent)] font-medium">{test.wpm}</td>
                                                <td className="py-2.5 font-[var(--font-mono)] text-[var(--color-text-primary)]">{test.rawWpm}</td>
                                                <td className="py-2.5 font-[var(--font-mono)] text-[var(--color-text-primary)]">{formatNumber(test.accuracy)}%</td>
                                                <td className="py-2.5 text-[var(--color-text-secondary)]">{test.mode} {test.mode === 'time' ? `${test.duration}s` : ''}</td>
                                                <td className="py-2.5 font-[var(--font-mono)] text-[var(--color-text-secondary)]">{test.duration}s</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
