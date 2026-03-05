import { useTypingStore } from '../../store/typingStore';
import { useUserStore } from '../../store/userStore';
import { WPMChart } from '../Graphs/Graphs';
import { saveTypingTest, updateUserStats, incrementTestsStarted } from '../../services/firebase';
import { useEffect, useRef } from 'react';
import { formatNumber } from '../../utils/wpmCalculator';

export default function ResultsPanel() {
    const {
        status,
        wpm,
        rawWpm,
        accuracy,
        consistency,
        errors,
        correctChars,
        incorrectChars,
        extraChars,
        missedChars,
        wpmHistory,
        errorHistory,
        timeElapsed,
        mode,
        words,
        currentWordIndex,
        resetTest,
    } = useTypingStore();

    const { user, profile } = useUserStore();
    const savedRef = useRef(false);

    // Save results to Firestore
    useEffect(() => {
        if (status !== 'finished' || savedRef.current || !user) return;
        savedRef.current = true;

        const save = async () => {
            try {
                await saveTypingTest({
                    userId: user.uid,
                    mode,
                    duration: timeElapsed,
                    wordCount: currentWordIndex,
                    wpm,
                    rawWpm,
                    accuracy,
                    errors,
                    correctChars,
                    incorrectChars,
                    extraChars,
                    missedChars,
                    consistency,
                    wpmHistory,
                    errorHistory,
                });

                await updateUserStats(user.uid, wpm, accuracy, timeElapsed);
            } catch (err) {
                console.error('Failed to save test:', err);
            }
        };

        const incrementStarted = async () => {
            try {
                await incrementTestsStarted(user.uid);
            } catch {
                /* ignore */
            }
        };

        save();
        incrementStarted();
    }, [status, user, wpm, rawWpm, accuracy, errors, correctChars, incorrectChars, extraChars, missedChars, consistency, wpmHistory, errorHistory, timeElapsed, mode, words, currentWordIndex]);

    // Reset saved flag on new test
    useEffect(() => {
        if (status === 'idle') {
            savedRef.current = false;
        }
    }, [status]);

    if (status !== 'finished') return null;

    return (
        <div className="w-full max-w-4xl mx-auto animate-slide-up">
            {/* Main stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <StatCard label="wpm" value={wpm} accent large />
                <StatCard label="accuracy" value={`${formatNumber(accuracy)}%`} />
                <StatCard label="raw wpm" value={rawWpm} />
                <StatCard label="consistency" value={`${formatNumber(consistency)}%`} />
            </div>

            {/* Chart */}
            <div className="bg-[var(--color-card)] rounded-xl p-5 mb-6 border border-[var(--color-bg-tertiary)]">
                <WPMChart
                    wpmHistory={wpmHistory}
                    errorHistory={errorHistory}
                    bestWPM={profile?.bestWPM}
                />
            </div>

            {/* Detail stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                <DetailCard label="errors" value={errors} color="text-[var(--color-error)]" />
                <DetailCard label="correct" value={correctChars} color="text-[var(--color-correct)]" />
                <DetailCard label="incorrect" value={incorrectChars} color="text-[var(--color-error)]" />
                <DetailCard label="extra" value={extraChars} color="text-[var(--color-extra)]" />
                <DetailCard label="missed" value={missedChars} color="text-[var(--color-text-secondary)]" />
            </div>

            {/* Character summary */}
            <div className="bg-[var(--color-card)] rounded-xl p-4 mb-6 border border-[var(--color-bg-tertiary)]">
                <div className="text-xs text-[var(--color-text-secondary)] mb-2">characters</div>
                <div className="font-[var(--font-mono)] text-sm">
                    <span className="text-[var(--color-correct)]">{correctChars}</span>
                    <span className="text-[var(--color-text-secondary)]"> / </span>
                    <span className="text-[var(--color-error)]">{incorrectChars}</span>
                    <span className="text-[var(--color-text-secondary)]"> / </span>
                    <span className="text-[var(--color-extra)]">{extraChars}</span>
                    <span className="text-[var(--color-text-secondary)]"> / </span>
                    <span className="text-[var(--color-text-secondary)]">{missedChars}</span>
                </div>
            </div>

            {/* Restart button */}
            <div className="text-center">
                <button
                    onClick={resetTest}
                    className="px-6 py-3 bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] rounded-lg hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text-primary)] transition-all text-sm font-medium border border-[var(--color-bg-tertiary)]"
                >
                    <span className="flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="23 4 23 10 17 10" />
                            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                        </svg>
                        Next Test
                    </span>
                </button>
            </div>
        </div>
    );
}

function StatCard({
    label,
    value,
    accent,
    large,
}: {
    label: string;
    value: number | string;
    accent?: boolean;
    large?: boolean;
}) {
    return (
        <div className="bg-[var(--color-card)] rounded-xl p-4 border border-[var(--color-bg-tertiary)] hover:border-[var(--color-accent)] transition-colors group">
            <div className="text-xs text-[var(--color-text-secondary)] mb-1">{label}</div>
            <div
                className={`font-[var(--font-mono)] font-bold ${large ? 'text-3xl' : 'text-2xl'
                    } ${accent ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-primary)]'}`}
            >
                {value}
            </div>
        </div>
    );
}

function DetailCard({
    label,
    value,
    color,
}: {
    label: string;
    value: number;
    color?: string;
}) {
    return (
        <div className="bg-[var(--color-card)] rounded-lg p-3 border border-[var(--color-bg-tertiary)]">
            <div className="text-xs text-[var(--color-text-secondary)] mb-1">{label}</div>
            <div className={`font-[var(--font-mono)] font-semibold text-lg ${color || ''}`}>
                {value}
            </div>
        </div>
    );
}
