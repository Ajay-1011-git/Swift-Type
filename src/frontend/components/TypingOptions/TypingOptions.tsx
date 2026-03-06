import { useTypingStore, type TestMode } from '@/backend/store/typingStore';

export default function TypingOptions() {
  const {
    mode,
    setMode,
    timeLimit,
    setTimeLimit,
    wordLimit,
    setWordLimit,
    punctuation,
    togglePunctuation,
    numbers,
    toggleNumbers,
    status,
    resetTest,
  } = useTypingStore();

  const handleModeChange = (m: TestMode) => {
    if (status !== 'idle') resetTest();
    setMode(m);
  };

  const handleTimeSelect = (t: number) => {
    if (status !== 'idle') resetTest();
    setTimeLimit(t);
  };

  const handleWordSelect = (w: number) => {
    if (status !== 'idle') resetTest();
    setWordLimit(w);
  };

  if (status === 'running') return null;

  return (
    <div className="w-full flex justify-center mb-2">
      <div className="flex flex-wrap items-center justify-center bg-[#2c2e31] rounded-2xl px-6 py-3 gap-1 shadow-lg border border-[#363739]/50">
        {/* Punctuation */}
        <OptBtn
          active={punctuation}
          onClick={togglePunctuation}
          label={<><span className="text-lg font-bold mr-1.5">@</span>punctuation</>}
        />
        {/* Numbers */}
        <OptBtn
          active={numbers}
          onClick={toggleNumbers}
          label={<><span className="text-lg font-bold mr-1.5">#</span>numbers</>}
        />

        <Divider />

        {/* Mode selectors */}
        <OptBtn
          active={mode === 'time'}
          onClick={() => handleModeChange('time')}
          label={<><ClockIcon /> time</>}
        />
        <OptBtn
          active={mode === 'words'}
          onClick={() => handleModeChange('words')}
          label={<><TextIcon /> words</>}
        />

        <Divider />

        {/* Sub-options */}
        {mode === 'time' && (
          <>
            {[15, 30, 60, 120].map((t) => (
              <OptBtn key={t} active={timeLimit === t} onClick={() => handleTimeSelect(t)} label={`${t}`} />
            ))}
          </>
        )}
        {mode === 'words' && (
          <>
            {[10, 25, 50, 100].map((w) => (
              <OptBtn key={w} active={wordLimit === w} onClick={() => handleWordSelect(w)} label={`${w}`} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

function OptBtn({ active, onClick, label }: { active: boolean; onClick: () => void; label: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 px-4 py-2 rounded-xl text-[15px] font-medium transition-all duration-150 whitespace-nowrap ${active ? 'text-[#e2b714]' : 'text-[#646669] hover:text-[#d1d0c5]'
        }`}
    >
      {label}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-6 bg-[#646669]/20 mx-3" />;
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1.5">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function TextIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1.5">
      <path d="M4 7V4h16v3M9 20h6M12 4v16" />
    </svg>
  );
}
