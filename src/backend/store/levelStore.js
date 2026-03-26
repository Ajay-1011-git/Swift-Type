import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import levelsConfig from '@/config/levels.json';

export const useLevelStore = create(
    persist(
        (set, get) => ({
            currentLevel: 1,
            unlockedLevels: [1],
            levelResults: {},

            completeLevel: (levelId, stats) => {
                const level = levelsConfig.levels.find((l) => l.id === levelId);
                if (!level) return;

                const passed =
                    stats.wpm >= level.targetWPM &&
                    stats.accuracy >= level.accuracyThreshold;

                if (!passed) return;

                const state = get();
                const nextLevelId = levelId + 1;
                const newUnlocked = state.unlockedLevels.includes(nextLevelId)
                    ? state.unlockedLevels
                    : [...state.unlockedLevels, nextLevelId];

                // Store best result — keep highest WPM
                const existing = state.levelResults[levelId];
                const best =
                    !existing || stats.wpm > existing.wpm ? stats : existing;

                set({
                    currentLevel: Math.max(state.currentLevel, nextLevelId),
                    unlockedLevels: newUnlocked,
                    levelResults: {
                        ...state.levelResults,
                        [levelId]: {
                            wpm: best.wpm,
                            accuracy: best.accuracy,
                            passed: true,
                        },
                    },
                });
            },

            isCustomUnlocked: () => {
                const state = get();
                const level3Result = state.levelResults[3];
                if (!level3Result || !level3Result.passed) return false;
                return (
                    level3Result.wpm >= levelsConfig.customUnlock.minWPM &&
                    level3Result.accuracy >= levelsConfig.customUnlock.minAccuracy
                );
            },

            getLevelResult: (levelId) => {
                return get().levelResults[levelId] || null;
            },

            isLevelUnlocked: (levelId) => {
                return get().unlockedLevels.includes(levelId);
            },
        }),
        {
            name: 'swifttype-levels',
        }
    )
);
