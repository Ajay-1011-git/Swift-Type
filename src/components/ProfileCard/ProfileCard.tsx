import { formatTime, formatNumber } from '../../utils/wpmCalculator';
import type { UserProfile } from '../../services/firebase';

interface ProfileCardProps {
    profile: UserProfile;
    email: string;
    displayName: string;
}

export default function ProfileCard({ profile, displayName }: ProfileCardProps) {
    const joinDate = profile.createdAt?.toDate
        ? profile.createdAt.toDate().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
        : 'Unknown';

    return (
        <div className="bg-[var(--color-card)] rounded-xl p-6 border border-[var(--color-bg-tertiary)] animate-fade-in">
            <div className="flex items-center gap-4 mb-6">
                {/* Avatar */}
                <div className="w-16 h-16 bg-[var(--color-accent)] rounded-full flex items-center justify-center text-[var(--color-bg-primary)] font-bold text-2xl shadow-lg">
                    {displayName[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                    <h2 className="text-xl font-bold text-[var(--color-text-primary)]">{displayName}</h2>
                    <p className="text-sm text-[var(--color-text-secondary)]">Joined {joinDate}</p>
                </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                    <div className="text-2xl font-bold text-[var(--color-accent)] font-[var(--font-mono)]">
                        {profile.testsStarted}
                    </div>
                    <div className="text-xs text-[var(--color-text-secondary)] mt-1">tests started</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-[var(--color-text-primary)] font-[var(--font-mono)]">
                        {profile.testsCompleted}
                    </div>
                    <div className="text-xs text-[var(--color-text-secondary)] mt-1">tests completed</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-[var(--color-text-primary)] font-[var(--font-mono)]">
                        {formatTime(profile.totalTypingTime)}
                    </div>
                    <div className="text-xs text-[var(--color-text-secondary)] mt-1">time typing</div>
                </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-[var(--color-bg-tertiary)] my-5" />

            {/* Overall best stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                    <div className="text-xl font-bold text-[var(--color-accent)] font-[var(--font-mono)]">
                        {formatNumber(profile.bestWPM)}
                    </div>
                    <div className="text-xs text-[var(--color-text-secondary)] mt-1">best wpm</div>
                </div>
                <div className="text-center">
                    <div className="text-xl font-bold text-[var(--color-text-primary)] font-[var(--font-mono)]">
                        {formatNumber(profile.averageWPM)}
                    </div>
                    <div className="text-xs text-[var(--color-text-secondary)] mt-1">avg wpm</div>
                </div>
                <div className="text-center">
                    <div className="text-xl font-bold text-[var(--color-text-primary)] font-[var(--font-mono)]">
                        {formatNumber(profile.bestAccuracy)}%
                    </div>
                    <div className="text-xs text-[var(--color-text-secondary)] mt-1">best accuracy</div>
                </div>
            </div>
        </div>
    );
}
