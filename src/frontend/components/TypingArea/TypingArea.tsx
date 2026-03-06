import { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import { useTypingStore } from '@/backend/store/typingStore';
import { formatTime } from '@/backend/utils/wpmCalculator';

type CharState = 'correct' | 'incorrect' | 'extra' | 'pending';

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
  const activeWordRef = useRef<HTMLDivElement>(null);
  const lastTabRef = useRef(false);
  const [isFocused, setIsFocused] = useState(true);

  // Auto-focus on mount and after reset
  useEffect(() => {
    if (status !== 'finished') {
      containerRef.current?.focus();
    }
  }, [status]);

  // Generate words on mount
  useEffect(() => {
    generateWords();
  }, [generateWords]);

  // Global keydown listener: auto-focus + forward keys to typing area
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (status === 'finished') return;
      // Don't capture if user is typing in an input/textarea
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      // Focus the container automatically
      if (document.activeElement !== containerRef.current) {
        containerRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [status]);

  const handleKey = useCallback(
    (e: React.KeyboardEvent) => {
      // Tab + Enter = restart
      if (e.key === 'Tab') {
        e.preventDefault();
        lastTabRef.current = true;
        setTimeout(() => { lastTabRef.current = false; }, 500);
        return;
      }
      if (e.key === 'Enter' && lastTabRef.current) {
        e.preventDefault();
        lastTabRef.current = false;
        resetTest();
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        resetTest();
        return;
      }
      if (e.key === ' ') {
        e.preventDefault();
      }
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

  // Paginated word display (no scrolling)
  const PAGE_SIZE = 30;
  const currentPage = Math.floor(currentWordIndex / PAGE_SIZE);
  const visibleRange = useMemo(() => {
    const start = currentPage * PAGE_SIZE;
    const end = Math.min(words.length, (currentPage + 1) * PAGE_SIZE);
    return { start, end };
  }, [currentPage, words.length]);

  const getCharColor = (state: CharState): string => {
    switch (state) {
      case 'correct': return 'text-[#d1d0c5]';
      case 'incorrect': return 'text-[#ca4754]';
      case 'extra': return 'text-[#7e2a33]';
      default: return 'text-[#646669]';
    }
  };

  if (words.length === 0) return null;

  return (
    <div className="w-full max-w-[850px] mx-auto relative">
      {/* Timer / WPM display */}
      {status === 'running' && (
        <div className="flex items-center justify-between mb-6">
          <div className="text-4xl font-bold text-[#e2b714] font-[var(--font-mono)] tabular-nums">
            {timeRemaining}
          </div>
          <div className="text-xl text-[#646669] font-[var(--font-mono)]">
            {wpm} <span className="text-sm">wpm</span>
          </div>
        </div>
      )}

      {/* Main typing container */}
      <div
        ref={containerRef}
        tabIndex={0}
        onKeyDown={handleKey}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="relative outline-none cursor-text"
        role="textbox"
        aria-label="Typing test area"
      >
        {/* Words display */}
        <div
          className={`relative font-[var(--font-mono)] text-[24px] leading-[2.2] transition-opacity duration-200 ${!isFocused && status !== 'finished' ? 'opacity-40 blur-[2px]' : 'opacity-100'
            }`}
        >
          <div className="flex flex-wrap gap-x-[12px] gap-y-1">
            {words.slice(visibleRange.start, visibleRange.end).map((word, sliceIdx) => {
              const wordIdx = visibleRange.start + sliceIdx;
              const isActive = wordIdx === currentWordIndex;
              const charStateArr = charStates[wordIdx] || [];

              return (
                <div
                  key={wordIdx}
                  ref={isActive ? activeWordRef : null}
                  className={`relative inline-flex ${wordIdx < currentWordIndex ? 'opacity-60' : ''
                    }`}
                >
                  {word.split('').map((char, charIdx) => {
                    const state = charStateArr[charIdx] || 'pending';
                    const isCursor = isActive && charIdx === currentCharIndex && status !== 'finished';

                    return (
                      <span key={charIdx} className="relative inline-block">
                        {isCursor && (
                          <span
                            className="absolute left-0 top-[4px] w-[2px] bg-[#e2b714] rounded-full caret-blink z-10"
                            style={{ height: 'calc(100% - 8px)', transform: 'translateX(-1px)' }}
                          />
                        )}
                        <span className={`${getCharColor(state)} transition-colors duration-75`}>
                          {char}
                        </span>
                      </span>
                    );
                  })}

                  {/* Extra characters */}
                  {charStateArr.slice(word.length).map((state, extraIdx) => {
                    const store = useTypingStore.getState();
                    const extraChar = store.currentInput[word.length + extraIdx] || '';
                    return (
                      <span key={`extra-${extraIdx}`} className={getCharColor(state)}>
                        {extraChar}
                      </span>
                    );
                  })}

                  {/* Cursor at end of word */}
                  {isActive && currentCharIndex >= word.length && status !== 'finished' && (
                    <span className="relative inline-block w-0">
                      <span
                        className="absolute left-0 top-[4px] w-[2px] bg-[#e2b714] rounded-full caret-blink z-10"
                        style={{ height: 'calc(100% - 8px)', transform: 'translateX(-1px)' }}
                      />
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Restart hint */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={resetTest}
          className="p-2 rounded-lg text-[#646669] hover:text-[#d1d0c5] transition-colors"
          title="Restart test"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
        </button>
      </div>

      {/* Keyboard hints */}
      {status !== 'idle' && (
        <div className="mt-2 text-center">
          <span className="text-xs text-[#646669]">
            <kbd className="px-1.5 py-0.5 bg-[#2c2e31] rounded text-[10px] border border-[#363739]">tab</kbd>
            {' + '}
            <kbd className="px-1.5 py-0.5 bg-[#2c2e31] rounded text-[10px] border border-[#363739]">enter</kbd>
            {' — restart'}
          </span>
        </div>
      )}
    </div>
  );
}
