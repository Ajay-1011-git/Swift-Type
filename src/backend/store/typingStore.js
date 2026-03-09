import { create } from 'zustand';
import { generateWordsArray } from '../utils/textGenerator';
import {
    calculateWPM,
    calculateRawWPM,
    calculateConsistency,
} from '../utils/wpmCalculator';





















































export const useTypingStore = create((set, get) => ({
    mode: 'time',
    timeLimit: 30,
    wordLimit: 25,
    punctuation: false,
    numbers: false,
    customText: '',

    status: 'idle',
    words: [],
    currentWordIndex: 0,
    currentCharIndex: 0,
    inputHistory: [],
    currentInput: '',

    timeElapsed: 0,
    timeRemaining: 30,
    timerInterval: null,

    correctChars: 0,
    incorrectChars: 0,
    extraChars: 0,
    missedChars: 0,
    totalKeypresses: 0,
    errors: 0,
    wpmHistory: [],
    errorHistory: [],
    wpm: 0,
    rawWpm: 0,
    accuracy: 0,
    consistency: 0,
    bestWpm: 0,

    charStates: [],

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

        let count;
        if (state.mode === 'time') {
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
            timeRemaining: state.timeLimit,
            correctChars: 0,
            incorrectChars: 0,
            extraChars: 0,
            missedChars: 0,
            totalKeypresses: 0,
            errors: 0,
            wpmHistory: [],
            errorHistory: [],
            wpm: 0,
            rawWpm: 0,
            accuracy: 0,
            consistency: 0,
            bestWpm: state.bestWpm,
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
        const newRemaining = state.timeLimit - newElapsed;

        // Count correct chars in the current (in-progress) word
        let liveCorrectChars = state.correctChars;
        const currentWord = state.words[state.currentWordIndex];
        if (currentWord && state.currentInput.length > 0) {
            for (let i = 0; i < Math.min(state.currentInput.length, currentWord.length); i++) {
                if (state.currentInput[i] === currentWord[i]) {
                    liveCorrectChars++;
                }
            }
        }

        // WPM = (correctChars / 5) / minutes — includes live chars
        const currentWPM = calculateWPM(liveCorrectChars, newElapsed);
        // Raw WPM = (totalKeypresses / 5) / minutes
        const currentRawWPM = calculateRawWPM(state.totalKeypresses, newElapsed);

        // Errors this second (delta)
        const previousTotalErrors = state.errorHistory.reduce((a, b) => a + b, 0);
        const errorsThisSecond = state.errors - previousTotalErrors;

        // Accuracy = correct / (correct + incorrect) — character-level, NOT keystroke-level
        const totalCharResults = state.correctChars + state.incorrectChars;
        const currentAccuracy = totalCharResults > 0
            ? Math.round((state.correctChars / totalCharResults) * 10000) / 100
            : 100;

        set({
            timeElapsed: newElapsed,
            timeRemaining: Math.max(0, newRemaining),
            wpmHistory: [...state.wpmHistory, currentWPM],
            errorHistory: [...state.errorHistory, errorsThisSecond],
            wpm: currentWPM,
            rawWpm: currentRawWPM,
            accuracy: currentAccuracy,
        });

        // Timer ends test in BOTH modes
        if (newRemaining <= 0) {
            get().endTest();
        }
    },

    handleKeyPress: (key) => {
        const state = get();
        if (state.status === 'finished') return;

        // Start test on first keypress
        if (state.status === 'idle' && key.length === 1) {
            state.startTest();
        }

        const currentWord = state.words[state.currentWordIndex];
        if (!currentWord) return;

        if (key === 'Backspace') {
            if (state.currentInput.length > 0) {
                const newInput = state.currentInput.slice(0, -1);
                const newCharIndex = newInput.length;
                const newCharStates = [...state.charStates];
                const wordStates = [...newCharStates[state.currentWordIndex]];

                if (state.currentInput.length > currentWord.length) {
                    wordStates.pop();
                } else {
                    wordStates[state.currentInput.length - 1] = 'pending';
                }
                newCharStates[state.currentWordIndex] = wordStates;
                set({
                    currentInput: newInput,
                    currentCharIndex: newCharIndex,
                    charStates: newCharStates,
                    // Backspace also counts as a keypress for rawWPM
                    totalKeypresses: state.totalKeypresses + 1,
                });
            }
            return;
        }

        if (key === ' ') {
            if (state.currentInput.length === 0) return;

            const typedWord = state.currentInput;
            let wordCorrectChars = 0;
            let wordIncorrectChars = 0;
            let wordExtraChars = 0;
            let wordMissedChars = 0;

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

            const newCharStates = [...state.charStates];
            const wordStates = [...newCharStates[state.currentWordIndex]];
            for (let i = typedWord.length; i < currentWord.length; i++) {
                wordStates[i] = 'incorrect';
            }
            newCharStates[state.currentWordIndex] = wordStates;

            const isWordCorrect = typedWord === currentWord;
            const newErrors = isWordCorrect ? state.errors : state.errors + 1;

            set({
                currentWordIndex: state.currentWordIndex + 1,
                currentCharIndex: 0,
                currentInput: '',
                inputHistory: [...state.inputHistory, typedWord],
                correctChars: state.correctChars + wordCorrectChars,
                incorrectChars: state.incorrectChars + wordIncorrectChars,
                extraChars: state.extraChars + wordExtraChars,
                missedChars: state.missedChars + wordMissedChars,
                totalKeypresses: state.totalKeypresses + 1, // space is a keypress
                errors: newErrors,
                charStates: newCharStates,
            });

            // In words mode, end when all words typed
            if (
                state.mode === 'words' &&
                state.currentWordIndex + 1 >= state.words.length
            ) {
                setTimeout(() => get().endTest(), 50);
            }

            return;
        }

        // Regular character
        if (key.length === 1) {
            const charIndex = state.currentInput.length;
            const newInput = state.currentInput + key;
            const newCharStates = [...state.charStates];
            const wordStates = [...newCharStates[state.currentWordIndex]];

            if (charIndex < currentWord.length) {
                wordStates[charIndex] = key === currentWord[charIndex] ? 'correct' : 'incorrect';
            } else {
                wordStates.push('extra');
            }
            newCharStates[state.currentWordIndex] = wordStates;

            set({
                currentInput: newInput,
                currentCharIndex: charIndex + 1,
                charStates: newCharStates,
                totalKeypresses: state.totalKeypresses + 1,
            });
        }
    },

    endTest: () => {
        const state = get();
        if (state.timerInterval) {
            clearInterval(state.timerInterval);
        }

        // Process last word if partially typed
        let finalCorrect = state.correctChars;
        let finalIncorrect = state.incorrectChars;
        let finalExtra = state.extraChars;
        let finalMissed = state.missedChars;
        let finalErrors = state.errors;
        let finalKeypresses = state.totalKeypresses;

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
        }

        const elapsed = Math.max(state.timeElapsed, 1);

        // WPM = (correct chars / 5) / minutes
        const wpm = calculateWPM(finalCorrect, elapsed);
        // Raw WPM = (all keypresses / 5) / minutes
        const rawWpm = calculateRawWPM(finalKeypresses, elapsed);
        // Accuracy = correct / (correct + incorrect) at character level
        const totalCharResults = finalCorrect + finalIncorrect;
        const accuracy = totalCharResults > 0
            ? Math.round((finalCorrect / totalCharResults) * 10000) / 100
            : 0;
        const consistency = calculateConsistency(state.wpmHistory);

        set({
            status: 'finished',
            timerInterval: null,
            correctChars: finalCorrect,
            incorrectChars: finalIncorrect,
            extraChars: finalExtra,
            missedChars: finalMissed,
            errors: finalErrors,
            totalKeypresses: finalKeypresses,
            wpm,
            rawWpm,
            accuracy,
            consistency,
            bestWpm: Math.max(state.bestWpm, wpm),
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
            timeRemaining: state.timeLimit,
            timerInterval: null,
            correctChars: 0,
            incorrectChars: 0,
            extraChars: 0,
            missedChars: 0,
            totalKeypresses: 0,
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
