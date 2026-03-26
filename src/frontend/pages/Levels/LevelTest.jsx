import { useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTypingStore } from '@/backend/store/typingStore';
import { useLevelStore } from '@/backend/store/levelStore';
import levelsConfig from '@/config/levels.json';
import TypingArea from '@/frontend/components/TypingArea/TypingArea';

export default function LevelTest() {
    const { id } = useParams();
    const navigate = useNavigate();
    const levelId = parseInt(id, 10);
    const level = levelsConfig.levels.find((l) => l.id === levelId);

    const {
        status,
        wpm,
        accuracy,
        resetTest,
        setMode,
        setWordLimit,
        setAllowBackspace,
        generateWords,
    } = useTypingStore();

    const { isLevelUnlocked, completeLevel, levelResults } = useLevelStore();
    const hasEvaluatedRef = useRef(false);

    // Redirect if level doesn't exist or is locked
    useEffect(() => {
        if (!level || !isLevelUnlocked(levelId)) {
            navigate('/levels', { replace: true });
        }
    }, [level, levelId, isLevelUnlocked, navigate]);

    // Setup level config on mount
    useEffect(() => {
        if (!level) return;
        hasEvaluatedRef.current = false;

        // Configure typing store for this level
        setMode('words');
        setWordLimit(level.wordCount);
        setAllowBackspace(level.constraints.allowBackspace);
        generateWords();

        // Cleanup on unmount — reset to defaults
        return () => {
            setAllowBackspace(true);
            resetTest();
        };
    }, [level, setMode, setWordLimit, setAllowBackspace, generateWords, resetTest]);

    // Evaluate when test finishes
    useEffect(() => {
        if (status === 'finished' && !hasEvaluatedRef.current) {
            hasEvaluatedRef.current = true;
            completeLevel(levelId, { wpm, accuracy });
        }
    }, [status, wpm, accuracy, levelId, completeLevel]);

    const handleRetry = useCallback(() => {
        hasEvaluatedRef.current = false;
        resetTest();
    }, [resetTest]);

    if (!level) return null;

    const passed = status === 'finished' && wpm >= level.targetWPM && accuracy >= level.accuracyThreshold;
    const failed = status === 'finished' && !passed;

    return (
        <div className="flex-1 flex flex-col items-center justify-center px-4">
            {status !== 'finished' ? (
                /* ─── Active Test ─── */
                <div className="w-full max-w-[850px] flex flex-col items-center gap-6 animate-fade-in">
                    {/* Level Header */}
                    <div className="w-full flex items-center justify-between mb-2">
                        <button
                            onClick={() => navigate('/levels')}
                            className="flex items-center gap-2 text-sm text-[#646669] hover:text-[#d1d0c5] transition-colors"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="15 18 9 12 15 6" />
                            </svg>
                            Back
                        </button>
                        <div className="text-center">
                            <div className="text-xs text-[#646669] uppercase tracking-wider">Level {level.id}</div>
                            <div className="text-lg font-semibold text-[#d1d0c5]">{level.name}</div>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-[#646669]">
                            <span className="font-[var(--font-mono)]">{level.targetWPM}<span className="text-[10px] ml-0.5">wpm</span></span>
                            <span className="text-[#363739]">|</span>
                            <span className="font-[var(--font-mono)]">{level.accuracyThreshold}<span className="text-[10px] ml-0.5">%</span></span>
                        </div>
                    </div>

                    {/* Backspace warning */}
                    {!level.constraints.allowBackspace && status === 'idle' && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-[#ca4754]/10 border border-[#ca4754]/20 rounded-xl text-xs text-[#ca4754]">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            Backspace is disabled for this level
                        </div>
                    )}

                    {/* Typing Area (reuse existing component) */}
                    <TypingArea />
                </div>
            ) : (
                /* ─── Result Screen ─── */
                <div className="w-full max-w-[500px] animate-slide-up">
                    {/* Pass / Fail Banner */}
                    <div className={`text-center mb-8 p-6 rounded-2xl border ${
                        passed
                            ? 'bg-[#e2b714]/5 border-[#e2b714]/30'
                            : 'bg-[#ca4754]/5 border-[#ca4754]/30'
                    }`}>
                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${
                            passed
                                ? 'bg-[#e2b714]/15 text-[#e2b714]'
                                : 'bg-[#ca4754]/15 text-[#ca4754]'
                        }`}>
                            {passed ? (
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            ) : (
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            )}
                        </div>

                        <h2 className={`text-2xl font-bold mb-1 ${
                            passed ? 'text-[#e2b714]' : 'text-[#ca4754]'
                        }`}>
                            {passed ? 'Level Passed!' : 'Level Failed'}
                        </h2>

                        <p className="text-sm text-[#646669]">
                            {passed
                                ? levelId < 3
                                    ? `Level ${levelId + 1} is now unlocked!`
                                    : 'Congratulations! All levels complete.'
                                : `Need ${level.targetWPM} WPM and ${level.accuracyThreshold}% accuracy.`
                            }
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="bg-[#2c2e31] rounded-xl p-4 border border-[#363739] text-center">
                            <div className="text-[10px] text-[#646669] uppercase tracking-wider mb-1">Your WPM</div>
                            <div className={`font-[var(--font-mono)] text-3xl font-bold ${
                                wpm >= level.targetWPM ? 'text-[#e2b714]' : 'text-[#ca4754]'
                            }`}>
                                {wpm}
                            </div>
                            <div className="text-[10px] text-[#646669] mt-1">Target: {level.targetWPM}</div>
                        </div>
                        <div className="bg-[#2c2e31] rounded-xl p-4 border border-[#363739] text-center">
                            <div className="text-[10px] text-[#646669] uppercase tracking-wider mb-1">Your Accuracy</div>
                            <div className={`font-[var(--font-mono)] text-3xl font-bold ${
                                accuracy >= level.accuracyThreshold ? 'text-[#e2b714]' : 'text-[#ca4754]'
                            }`}>
                                {accuracy}%
                            </div>
                            <div className="text-[10px] text-[#646669] mt-1">Target: {level.accuracyThreshold}%</div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate('/levels')}
                            className="flex-1 py-3 bg-[#2c2e31] text-[#646669] rounded-xl hover:bg-[#363739] hover:text-[#d1d0c5] transition-all duration-200 text-sm font-medium border border-[#363739] hover:border-[#454647] btn-hover-lift"
                        >
                            Back to Levels
                        </button>
                        <button
                            onClick={handleRetry}
                            className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-200 btn-hover-lift ${
                                passed
                                    ? 'bg-[#2c2e31] text-[#e2b714] border border-[#e2b714]/30 hover:bg-[#e2b714]/10 hover:border-[#e2b714]'
                                    : 'bg-[#e2b714] text-[#323437] hover:bg-[#c9a312] hover:shadow-[0_0_15px_rgba(226,183,20,0.3)]'
                            }`}
                        >
                            {passed ? 'Play Again' : 'Retry'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
