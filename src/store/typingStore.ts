import { create } from 'zustand';
import { generateWordsArray } from '../utils/textGenerator';
import {
    calculateWPM,
    calculateRawWPM,
    calculateAccuracy,
    calculateConsistency,
} from '../utils/wpmCalculator';

export type TestMode = 'time' | 'words' | 'custom';
export type TestStatus = 'idle' | 'running' | 'finished';

interface TypingState {
    // Mode settings
    mode: TestMode;
    timeLimit: number;
    wordLimit: number;
    punctuation: boolean;
    numbers: boolean;
    customText: string;

    // Test state
    status: TestStatus;
    words: string[];
    currentWordIndex: number;
    currentCharIndex: number;
    inputHistory: string[];
    currentInput: string;

    // Timer
    timeElapsed: number;
    timeRemaining: number;
    timerInterval: ReturnType<typeof setInterval> | null;

    // Stats
    correctChars: number;
    incorrectChars: number;
    extraChars: number;
    missedChars: number;
    totalCharsTyped: number;
    errors: number;
    wpmHistory: number[];
    errorHistory: number[];
    wpm: number;
    rawWpm: number;
    accuracy: number;
    consistency: number;

    // Character-level tracking — each word is an array of char states
    charStates: ('correct' | 'incorrect' | 'extra' | 'pending')[][];

    // Actions
    setMode: (mode: TestMode) => void;
    setTimeLimit: (t: number) => void;
    setWordLimit: (w: number) => void;
    togglePunctuation: () => void;
    toggleNumbers: () => void;
    setCustomText: (text: string) => void;
    generateWords: () => void;
    startTest: () => void;
    handleKeyPress: (key: string) => void;
    endTest: () => void;
    resetTest: () => void;
    tick: () => void;
}

export const useTypingStore = create<TypingState>((set, get) => ({
    // Mode settings
    mode: 'time',
    timeLimit: 30,
    wordLimit: 25,
    punctuation: false,
    numbers: false,
    customText: '',

    // Test state
    status: 'idle',
    words: [],
    currentWordIndex: 0,
    currentCharIndex: 0,
    inputHistory: [],
    currentInput: '',

    // Timer
    timeElapsed: 0,
    timeRemaining: 30,
    timerInterval: null,

    // Stats
    correctChars: 0,
    incorrectChars: 0,
    extraChars: 0,
    missedChars: 0,
    totalCharsTyped: 0,
    errors: 0,
    wpmHistory: [],
    errorHistory: [],
    wpm: 0,
    rawWpm: 0,
    accuracy: 0,
    consistency: 0,

    charStates: [],

    // Actions
    setMode: (mode) => {
        set({ mode });
        get().generateWords();
    },

    setTimeLimit: (t) => {
        set({ timeLimit: t, timeRemaining: t });
        get().generateWords();
    },

    setWordLimit: (w) => {
        set({ wordLimit: w });
        get().generateWords();
    },

    togglePunctuation: () => {
        set((s) => ({ punctuation: !s.punctuation }));
        get().generateWords();
    },

    toggleNumbers: () => {
        set((s) => ({ numbers: !s.numbers }));
        get().generateWords();
    },

    setCustomText: (text) => {
        set({ customText: text });
        if (text.trim()) {
            const words = text.trim().split(/\s+/);
            set({
                words,
                charStates: words.map((w) => Array(w.length).fill('pending')),
            });
        }
    },

    generateWords: () => {
        const state = get();
        if (state.customText.trim()) {
            const words = state.customText.trim().split(/\s+/);
            set({
                words,
                charStates: words.map((w) => Array(w.length).fill('pending')),
                currentWordIndex: 0,
                currentCharIndex: 0,
                currentInput: '',
                inputHistory: [],
            });
            return;
        }

        let count: number;
        if (state.mode === 'time') {
            // Generate enough words for the time limit
            count = Math.max(200, state.timeLimit * 4);
        } else {
            count = state.wordLimit;
        }

        const words = generateWordsArray(count, {
            punctuation: state.punctuation,
            numbers: state.numbers,
        });
        set({
            words,
            charStates: words.map((w) => Array(w.length).fill('pending')),
            currentWordIndex: 0,
            currentCharIndex: 0,
            currentInput: '',
            inputHistory: [],
        });
    },

    startTest: () => {
        const state = get();
        if (state.status !== 'idle') return;

        set({
            status: 'running',
            timeElapsed: 0,
            timeRemaining: state.mode === 'time' ? state.timeLimit : Infinity,
            correctChars: 0,
            incorrectChars: 0,
            extraChars: 0,
            missedChars: 0,
            totalCharsTyped: 0,
            errors: 0,
            wpmHistory: [],
            errorHistory: [],
            wpm: 0,
            rawWpm: 0,
            accuracy: 0,
            consistency: 0,
        });

        const interval = setInterval(() => {
            get().tick();
        }, 1000);
        set({ timerInterval: interval });
    },

    tick: () => {
        const state = get();
        if (state.status !== 'running') return;

        const newElapsed = state.timeElapsed + 1;
        const newRemaining = state.mode === 'time' ? state.timeLimit - newElapsed : Infinity;

        // Snapshot WPM
        const currentWPM = calculateWPM(state.correctChars, newElapsed);
        const errorsThisSecond = state.errors;

        set({
            timeElapsed: newElapsed,
            timeRemaining: Math.max(0, newRemaining),
            wpmHistory: [...state.wpmHistory, currentWPM],
            errorHistory: [...state.errorHistory, errorsThisSecond],
            wpm: currentWPM,
            rawWpm: calculateRawWPM(state.totalCharsTyped, newElapsed),
        });

        if (state.mode === 'time' && newRemaining <= 0) {
            get().endTest();
        }
    },

    handleKeyPress: (key: string) => {
        const state = get();
        if (state.status === 'finished') return;

        // Start test on first keypress
        if (state.status === 'idle' && key.length === 1) {
            state.startTest();
        }

        const currentWord = state.words[state.currentWordIndex];
        if (!currentWord) return;

        if (key === 'Backspace') {
            // Handle backspace
            if (state.currentInput.length > 0) {
                const newInput = state.currentInput.slice(0, -1);
                const newCharIndex = newInput.length;

                // Update char states
                const newCharStates = [...state.charStates];
                const wordStates = [...newCharStates[state.currentWordIndex]];

                // If we were in extra territory, remove the last extra state
                if (state.currentInput.length > currentWord.length) {
                    wordStates.pop();
                } else {
                    // Reset the character that was just deleted
                    wordStates[state.currentInput.length - 1] = 'pending';
                }
                newCharStates[state.currentWordIndex] = wordStates;

                set({
                    currentInput: newInput,
                    currentCharIndex: newCharIndex,
                    charStates: newCharStates,
                });
            }
            return;
        }

        if (key === ' ') {
            // Space — move to next word
            if (state.currentInput.length === 0) return; // Don't skip empty words

            const typedWord = state.currentInput;
            let wordCorrectChars = 0;
            let wordIncorrectChars = 0;
            let wordExtraChars = 0;
            let wordMissedChars = 0;

            // Count correct/incorrect chars for this word
            for (let i = 0; i < Math.max(typedWord.length, currentWord.length); i++) {
                if (i < typedWord.length && i < currentWord.length) {
                    if (typedWord[i] === currentWord[i]) {
                        wordCorrectChars++;
                    } else {
                        wordIncorrectChars++;
                    }
                } else if (i >= currentWord.length) {
                    wordExtraChars++;
                } else {
                    wordMissedChars++;
                }
            }

            // Mark missed chars in charStates
            const newCharStates = [...state.charStates];
            const wordStates = [...newCharStates[state.currentWordIndex]];
            for (let i = typedWord.length; i < currentWord.length; i++) {
                wordStates[i] = 'incorrect';
            }
            newCharStates[state.currentWordIndex] = wordStates;

            const isWordCorrect = typedWord === currentWord;
            const newErrors = isWordCorrect ? state.errors : state.errors + 1;

            // Add space as correct char for WPM calculation
            const spaceChar = 1;

            const newState = {
                currentWordIndex: state.currentWordIndex + 1,
                currentCharIndex: 0,
                currentInput: '',
                inputHistory: [...state.inputHistory, typedWord],
                correctChars: state.correctChars + wordCorrectChars + spaceChar,
                incorrectChars: state.incorrectChars + wordIncorrectChars,
                extraChars: state.extraChars + wordExtraChars,
                missedChars: state.missedChars + wordMissedChars,
                totalCharsTyped: state.totalCharsTyped + typedWord.length + 1,
                errors: newErrors,
                charStates: newCharStates,
            };

            set(newState);

            // Check: in word mode, if we've completed the last word
            if (
                state.mode === 'words' &&
                state.currentWordIndex + 1 >= state.words.length
            ) {
                setTimeout(() => get().endTest(), 50);
            }

            return;
        }

        // Regular character input
        if (key.length === 1) {
            const charIndex = state.currentInput.length;
            const newInput = state.currentInput + key;
            const newCharStates = [...state.charStates];
            const wordStates = [...newCharStates[state.currentWordIndex]];

            if (charIndex < currentWord.length) {
                // Within word bounds
                wordStates[charIndex] = key === currentWord[charIndex] ? 'correct' : 'incorrect';
            } else {
                // Extra character
                wordStates.push('extra');
            }

            newCharStates[state.currentWordIndex] = wordStates;

            set({
                currentInput: newInput,
                currentCharIndex: charIndex + 1,
                charStates: newCharStates,
                totalCharsTyped: state.totalCharsTyped + 1,
            });
        }
    },

    endTest: () => {
        const state = get();
        if (state.timerInterval) {
            clearInterval(state.timerInterval);
        }

        // Process the last word if there's input
        let finalCorrect = state.correctChars;
        let finalIncorrect = state.incorrectChars;
        let finalExtra = state.extraChars;
        let finalMissed = state.missedChars;
        let finalErrors = state.errors;
        let finalTotal = state.totalCharsTyped;

        if (state.currentInput.length > 0) {
            const currentWord = state.words[state.currentWordIndex];
            const typedWord = state.currentInput;

            for (let i = 0; i < Math.max(typedWord.length, currentWord.length); i++) {
                if (i < typedWord.length && i < currentWord.length) {
                    if (typedWord[i] === currentWord[i]) {
                        finalCorrect++;
                    } else {
                        finalIncorrect++;
                    }
                } else if (i >= currentWord.length) {
                    finalExtra++;
                } else {
                    finalMissed++;
                }
            }

            if (typedWord !== currentWord) {
                finalErrors++;
            }
            finalTotal += typedWord.length;
        }

        const elapsed = state.timeElapsed || 1;
        const wpm = calculateWPM(finalCorrect, elapsed);
        const rawWpm = calculateRawWPM(finalTotal, elapsed);
        const accuracy = calculateAccuracy(finalCorrect, finalTotal);
        const consistency = calculateConsistency(state.wpmHistory);

        set({
            status: 'finished',
            timerInterval: null,
            correctChars: finalCorrect,
            incorrectChars: finalIncorrect,
            extraChars: finalExtra,
            missedChars: finalMissed,
            errors: finalErrors,
            totalCharsTyped: finalTotal,
            wpm,
            rawWpm,
            accuracy,
            consistency,
        });
    },

    resetTest: () => {
        const state = get();
        if (state.timerInterval) {
            clearInterval(state.timerInterval);
        }

        set({
            status: 'idle',
            currentWordIndex: 0,
            currentCharIndex: 0,
            inputHistory: [],
            currentInput: '',
            timeElapsed: 0,
            timeRemaining: state.mode === 'time' ? state.timeLimit : Infinity,
            timerInterval: null,
            correctChars: 0,
            incorrectChars: 0,
            extraChars: 0,
            missedChars: 0,
            totalCharsTyped: 0,
            errors: 0,
            wpmHistory: [],
            errorHistory: [],
            wpm: 0,
            rawWpm: 0,
            accuracy: 0,
            consistency: 0,
        });

        get().generateWords();
    },
}));
