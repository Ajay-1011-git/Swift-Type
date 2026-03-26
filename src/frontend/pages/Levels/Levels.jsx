import { useNavigate } from 'react-router-dom';
import { useLevelStore } from '@/backend/store/levelStore';
import levelsConfig from '@/config/levels.json';

export default function Levels() {
    const navigate = useNavigate();
    const { unlockedLevels, levelResults, isCustomUnlocked } = useLevelStore();

    const customUnlocked = isCustomUnlocked();

    return (
        <div className="flex-1 flex flex-col items-center px-4 py-12 animate-fade-in">
            {/* Header */}
            <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-[#e2b714] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(226,183,20,0.2)]">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#323437" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-[#d1d0c5]">Levels</h1>
                </div>
                <p className="text-[#646669] text-sm max-w-md">
                    Complete each level to unlock the next. Pass all levels to unlock Custom Mode.
                </p>
            </div>

            {/* Level Cards Grid */}
            <div className="w-full max-w-[750px] grid gap-4">
                {levelsConfig.levels.map((level, idx) => {
                    const isUnlocked = unlockedLevels.includes(level.id);
                    const result = levelResults[level.id];
                    const isPassed = result?.passed;

                    return (
                        <button
                            key={level.id}
                            onClick={() => isUnlocked && navigate(`/levels/${level.id}`)}
                            disabled={!isUnlocked}
                            className={`level-card group relative w-full text-left rounded-2xl border p-5 md:p-6 transition-all duration-300 outline-none
                                ${isUnlocked
                                    ? isPassed
                                        ? 'bg-[#2c2e31] border-[#e2b714]/40 hover:border-[#e2b714] hover:shadow-[0_0_30px_rgba(226,183,20,0.08)] cursor-pointer'
                                        : 'bg-[#2c2e31] border-[#363739] hover:border-[#646669] hover:shadow-[0_4px_24px_rgba(0,0,0,0.3)] cursor-pointer'
                                    : 'bg-[#2a2c2f] border-[#323437] opacity-50 cursor-not-allowed'
                                }`}
                            style={{ animationDelay: `${idx * 80}ms` }}
                        >
                            {/* Top Row: Level number + Name + Status */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    {/* Level badge */}
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 transition-all duration-200
                                        ${isPassed
                                            ? 'bg-[#e2b714]/15 text-[#e2b714]'
                                            : isUnlocked
                                                ? 'bg-[#363739] text-[#d1d0c5]'
                                                : 'bg-[#323437] text-[#646669]'
                                        }`}>
                                        {isPassed ? (
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        ) : isUnlocked ? (
                                            level.id
                                        ) : (
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                            </svg>
                                        )}
                                    </div>

                                    {/* Name */}
                                    <div>
                                        <div className={`text-lg font-semibold ${isUnlocked ? 'text-[#d1d0c5]' : 'text-[#646669]'}`}>
                                            {level.name}
                                        </div>
                                        <div className="text-xs text-[#646669]">Level {level.id}</div>
                                    </div>
                                </div>

                                {/* Pass/Lock Status */}
                                {isPassed && (
                                    <div className="px-3 py-1 bg-[#e2b714]/10 text-[#e2b714] rounded-lg text-xs font-semibold uppercase tracking-wider">
                                        Passed
                                    </div>
                                )}
                                {!isUnlocked && (
                                    <div className="px-3 py-1 bg-[#363739] text-[#646669] rounded-lg text-xs font-medium">
                                        Locked
                                    </div>
                                )}
                            </div>

                            {/* Stats Row */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="bg-[#323437]/60 rounded-xl p-3 text-center">
                                    <div className="text-[10px] text-[#646669] uppercase tracking-wider mb-1">Target WPM</div>
                                    <div className={`font-[var(--font-mono)] text-lg font-bold ${isUnlocked ? 'text-[#d1d0c5]' : 'text-[#646669]'}`}>
                                        {level.targetWPM}
                                    </div>
                                </div>
                                <div className="bg-[#323437]/60 rounded-xl p-3 text-center">
                                    <div className="text-[10px] text-[#646669] uppercase tracking-wider mb-1">Words</div>
                                    <div className={`font-[var(--font-mono)] text-lg font-bold ${isUnlocked ? 'text-[#d1d0c5]' : 'text-[#646669]'}`}>
                                        {level.wordCount}
                                    </div>
                                </div>
                                <div className="bg-[#323437]/60 rounded-xl p-3 text-center">
                                    <div className="text-[10px] text-[#646669] uppercase tracking-wider mb-1">Accuracy</div>
                                    <div className={`font-[var(--font-mono)] text-lg font-bold ${isUnlocked ? 'text-[#d1d0c5]' : 'text-[#646669]'}`}>
                                        {level.accuracyThreshold}%
                                    </div>
                                </div>
                            </div>

                            {/* Best Result (if passed) */}
                            {result && (
                                <div className="mt-3 pt-3 border-t border-[#363739]/60 flex items-center justify-between">
                                    <span className="text-xs text-[#646669]">Best Result</span>
                                    <div className="flex items-center gap-4">
                                        <span className="font-[var(--font-mono)] text-sm text-[#e2b714] font-semibold">
                                            {result.wpm} <span className="text-[10px] text-[#646669]">wpm</span>
                                        </span>
                                        <span className="font-[var(--font-mono)] text-sm text-[#d1d0c5] font-semibold">
                                            {result.accuracy}% <span className="text-[10px] text-[#646669]">acc</span>
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Hover arrow indicator for unlocked */}
                            {isUnlocked && !isPassed && (
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-1">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#646669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="9 18 15 12 9 6" />
                                    </svg>
                                </div>
                            )}
                        </button>
                    );
                })}

                {/* Custom Mode Card */}
                <button
                    onClick={() => customUnlocked && navigate('/')}
                    disabled={!customUnlocked}
                    className={`level-card group relative w-full text-left rounded-2xl border p-5 md:p-6 transition-all duration-300 outline-none
                        ${customUnlocked
                            ? 'bg-gradient-to-br from-[#2c2e31] to-[#323437] border-[#e2b714]/30 hover:border-[#e2b714] hover:shadow-[0_0_30px_rgba(226,183,20,0.12)] cursor-pointer'
                            : 'bg-[#2a2c2f] border-[#323437] opacity-50 cursor-not-allowed'
                        }`}
                    style={{ animationDelay: '240ms' }}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0
                                ${customUnlocked
                                    ? 'bg-gradient-to-br from-[#e2b714] to-[#c9a312] shadow-[0_0_12px_rgba(226,183,20,0.3)]'
                                    : 'bg-[#323437]'
                                }`}>
                                {customUnlocked ? (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#323437" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="6" width="20" height="12" rx="2" />
                                        <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8" />
                                    </svg>
                                ) : (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#646669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                )}
                            </div>
                            <div>
                                <div className={`text-lg font-semibold ${customUnlocked ? 'text-[#d1d0c5]' : 'text-[#646669]'}`}>
                                    Custom Mode
                                </div>
                                <div className="text-xs text-[#646669]">
                                    {customUnlocked
                                        ? 'Unlocked — free typing mode'
                                        : `Complete Level 3 with ${levelsConfig.customUnlock.minWPM}+ WPM & ${levelsConfig.customUnlock.minAccuracy}%+ accuracy`
                                    }
                                </div>
                            </div>
                        </div>

                        {customUnlocked ? (
                            <div className="px-3 py-1 bg-[#e2b714]/10 text-[#e2b714] rounded-lg text-xs font-semibold uppercase tracking-wider">
                                Unlocked
                            </div>
                        ) : (
                            <div className="px-3 py-1 bg-[#363739] text-[#646669] rounded-lg text-xs font-medium">
                                Locked
                            </div>
                        )}
                    </div>
                </button>
            </div>

            {/* Footer hint */}
            <div className="mt-8 text-center">
                <p className="text-xs text-[#646669]/60">
                    Progress is saved automatically
                </p>
            </div>
        </div>
    );
}
