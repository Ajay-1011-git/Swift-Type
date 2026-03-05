import { useEffect, useRef, useCallback, useMemo } from 'react';
import { useTypingStore } from '../../store/typingStore';
import { formatTime } from '../../utils/wpmCalculator';

export default function TypingArea() {
    const {
        words,
        currentWordIndex,
        currentCharIndex,
        charStates,
        status,
        mode,
        timeRemaining,
        timeElapsed,
        wpm,
        handleKeyPress,
        resetTest,
        generateWords,
    } = useTypingStore();

    const containerRef = useRef<HTMLDivElement>(null);
    const wordsRef = useRef<HTMLDivElement>(null);
    const activeWordRef = useRef<HTMLDivElement>(null);
    const lastTabRef = useRef(false);

    // Focus container on mount and after reset
    useEffect(() => {
        containerRef.current?.focus();
    }, [status]);

    // Generate words on mount
    useEffect(() => {
        generateWords();
    }, [generateWords]);

    // Scroll active word into view
    useEffect(() => {
        if (activeWordRef.current && wordsRef.current) {
            const wordEl = activeWordRef.current;
            const container = wordsRef.current;
            const wordTop = wordEl.offsetTop;
            const containerScroll = container.scrollTop;
            const containerHeight = container.clientHeight;

            if (wordTop > containerScroll + containerHeight - 50) {
                container.scrollTo({
                    top: wordTop - 40,
                    behavior: 'smooth',
                });
            }
        }
    }, [currentWordIndex]);

    const handleKey = useCallback(
        (e: React.KeyboardEvent) => {
            // Tab + Enter = restart
            if (e.key === 'Tab') {
                e.preventDefault();
                lastTabRef.current = true;
                setTimeout(() => {
                    lastTabRef.current = false;
                }, 500);
                return;
            }

            if (e.key === 'Enter' && lastTabRef.current) {
                e.preventDefault();
                lastTabRef.current = false;
                resetTest();
                return;
            }

            // Esc = reset
            if (e.key === 'Escape') {
                e.preventDefault();
                resetTest();
                return;
            }

            // Prevent default for space (scrolling)
            if (e.key === ' ') {
                e.preventDefault();
            }

            // Don't handle special keys (except Backspace and Space)
            if (
                e.key !== 'Backspace' &&
                e.key !== ' ' &&
                (e.key.length !== 1 || e.ctrlKey || e.altKey || e.metaKey)
            ) {
                return;
            }

            handleKeyPress(e.key);
        },
        [handleKeyPress, resetTest]
    );

    // Memoize the visible words slice for rendering
    const visibleRange = useMemo(() => {
        const start = Math.max(0, currentWordIndex - 15);
        const end = Math.min(words.length, currentWordIndex + 80);
        return { start, end };
    }, [currentWordIndex, words.length]);

    const getCharColor = (state: string) => {
        switch (state) {
            case 'correct':
                return 'text-[var(--color-correct)]';
            case 'incorrect':
                return 'text-[var(--color-error)]';
            case 'extra':
                return 'text-[var(--color-extra)]';
            default:
                return 'text-[var(--color-text-tertiary)]';
        }
    };

    if (words.length === 0) return null;

    return (
        <div className="w-full max-w-4xl mx-auto relative">
            {/* Timer / WPM display */}
            {status === 'running' && (
                <div className="flex items-center justify-between mb-4 animate-fade-in">
                    <div className="text-3xl font-bold text-[var(--color-accent)] font-[var(--font-mono)] tabular-nums">
                        {mode === 'time' ? timeRemaining : formatTime(timeElapsed)}
                    </div>
                    <div className="text-lg text-[var(--color-text-secondary)] font-[var(--font-mono)]">
                        {wpm} <span className="text-xs">wpm</span>
                    </div>
                </div>
            )}

            {/* Main typing container */}
            <div
                ref={containerRef}
                tabIndex={0}
                onKeyDown={handleKey}
                className="relative outline-none cursor-text"
                role="textbox"
                aria-label="Typing test area"
            >
                {/* Click to focus overlay */}
                {status === 'idle' && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                        <div className="text-[var(--color-text-secondary)] text-sm animate-pulse-subtle">
                            Click here and start typing...
                        </div>
                    </div>
                )}

                {/* Words display */}
                <div
                    ref={wordsRef}
                    className={`relative font-[var(--font-mono)] text-2xl leading-relaxed overflow-hidden transition-all ${status === 'idle' ? 'opacity-60' : 'opacity-100'
                        }`}
                    style={{ maxHeight: '160px' }}
                >
                    <div className="flex flex-wrap gap-x-3 gap-y-2">
                        {words.slice(visibleRange.start, visibleRange.end).map((word, sliceIdx) => {
                            const wordIdx = visibleRange.start + sliceIdx;
                            const isActive = wordIdx === currentWordIndex;
                            const charStateArr = charStates[wordIdx] || [];

                            return (
                                <div
                                    key={wordIdx}
                                    ref={isActive ? activeWordRef : null}
                                    className={`relative inline-block ${wordIdx < currentWordIndex ? 'opacity-50' : ''
                                        }`}
                                >
                                    {word.split('').map((char, charIdx) => {
                                        const state = charStateArr[charIdx] || 'pending';
                                        const isCursor = isActive && charIdx === currentCharIndex && status !== 'finished';

                                        return (
                                            <span key={charIdx} className="relative">
                                                {isCursor && (
                                                    <span className="absolute left-0 top-0 w-[2px] h-full bg-[var(--color-caret)] caret-blink rounded-full" />
                                                )}
                                                <span
                                                    className={`${getCharColor(state)} transition-colors duration-75 ${state === 'correct' ? 'drop-shadow-[0_0_4px_rgba(209,208,197,0.3)]' : ''
                                                        }`}
                                                >
                                                    {char}
                                                </span>
                                            </span>
                                        );
                                    })}

                                    {/* Render extra characters */}
                                    {charStateArr.slice(word.length).map((state, extraIdx) => (
                                        <span key={`extra-${extraIdx}`} className={getCharColor(state)}>
                                            {isActive ? useTypingStore.getState().currentInput[word.length + extraIdx] || '' : ''}
                                        </span>
                                    ))}

                                    {/* Cursor at end of word */}
                                    {isActive && currentCharIndex >= word.length && status !== 'finished' && (
                                        <span className="relative">
                                            <span className="absolute left-0 top-0 w-[2px] h-full bg-[var(--color-caret)] caret-blink rounded-full" />
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Restart hint */}
            {status !== 'idle' && (
                <div className="mt-6 text-center">
                    <span className="text-xs text-[var(--color-text-secondary)]">
                        <kbd className="px-1.5 py-0.5 bg-[var(--color-bg-secondary)] rounded text-[10px] border border-[var(--color-bg-tertiary)]">tab</kbd>
                        {' + '}
                        <kbd className="px-1.5 py-0.5 bg-[var(--color-bg-secondary)] rounded text-[10px] border border-[var(--color-bg-tertiary)]">enter</kbd>
                        {' — restart'}
                        <span className="mx-3">|</span>
                        <kbd className="px-1.5 py-0.5 bg-[var(--color-bg-secondary)] rounded text-[10px] border border-[var(--color-bg-tertiary)]">esc</kbd>
                        {' — reset'}
                    </span>
                </div>
            )}
        </div>
    );
}
