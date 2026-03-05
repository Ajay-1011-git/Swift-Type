import { useTypingStore, type TestMode } from '../../store/typingStore';
import { useState } from 'react';

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
        customText,
        setCustomText,
        status,
        resetTest,
    } = useTypingStore();

    const [showCustomInput, setShowCustomInput] = useState(false);
    const [customTimeInput, setCustomTimeInput] = useState('');

    const handleModeChange = (m: TestMode) => {
        if (status !== 'idle') resetTest();
        setMode(m);
        setShowCustomInput(m === 'custom');
    };

    const handleTimeSelect = (t: number) => {
        if (status !== 'idle') resetTest();
        setTimeLimit(t);
    };

    const handleWordSelect = (w: number) => {
        if (status !== 'idle') resetTest();
        setWordLimit(w);
    };

    const handleCustomTime = () => {
        const t = parseInt(customTimeInput);
        if (t > 0 && t <= 300) {
            handleTimeSelect(t);
            setCustomTimeInput('');
        }
    };

    if (status === 'running') return null;

    return (
        <div className="w-full max-w-4xl mx-auto animate-fade-in">
            {/* Toggles row */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                <Toggle
                    label="punctuation"
                    active={punctuation}
                    onClick={togglePunctuation}
                    icon={
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="18" r="1" /><path d="M12 2v14" />
                        </svg>
                    }
                />
                <Toggle
                    label="numbers"
                    active={numbers}
                    onClick={toggleNumbers}
                    icon={
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 17l6-10M10 7h4M10 17h4M14 7l6 10" />
                        </svg>
                    }
                />

                <Divider />

                <ModeButton label="time" active={mode === 'time'} onClick={() => handleModeChange('time')} />
                <ModeButton label="words" active={mode === 'words'} onClick={() => handleModeChange('words')} />
                <ModeButton label="custom" active={mode === 'custom'} onClick={() => handleModeChange('custom')} />
            </div>

            {/* Time options */}
            {mode === 'time' && (
                <div className="flex flex-wrap items-center justify-center gap-2">
                    {[15, 30, 60, 120].map((t) => (
                        <OptionButton key={t} label={`${t}`} active={timeLimit === t} onClick={() => handleTimeSelect(t)} />
                    ))}
                    <div className="flex items-center gap-1">
                        <input
                            type="number"
                            placeholder="custom"
                            value={customTimeInput}
                            onChange={(e) => setCustomTimeInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleCustomTime()}
                            className="w-20 px-2 py-1 text-xs bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] rounded border border-transparent focus:border-[var(--color-accent)] outline-none transition-colors"
                        />
                    </div>
                </div>
            )}

            {/* Word options */}
            {mode === 'words' && (
                <div className="flex flex-wrap items-center justify-center gap-2">
                    {[10, 25, 50, 100].map((w) => (
                        <OptionButton key={w} label={`${w}`} active={wordLimit === w} onClick={() => handleWordSelect(w)} />
                    ))}
                </div>
            )}

            {/* Custom text */}
            {(mode === 'custom' || showCustomInput) && (
                <div className="mt-3">
                    <textarea
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value)}
                        placeholder="Type or paste your custom text here..."
                        rows={3}
                        className="w-full px-4 py-3 text-sm bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-lg border border-[var(--color-bg-tertiary)] focus:border-[var(--color-accent)] outline-none resize-none transition-colors font-[var(--font-mono)]"
                    />
                </div>
            )}
        </div>
    );
}

function Toggle({ label, active, onClick, icon }: { label: string; active: boolean; onClick: () => void; icon?: React.ReactNode }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all ${active
                    ? 'bg-[var(--color-accent)] text-[var(--color-bg-primary)]'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]'
                }`}
        >
            {icon}
            {label}
        </button>
    );
}

function ModeButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${active
                    ? 'text-[var(--color-accent)] bg-[var(--color-bg-tertiary)]'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
        >
            {label}
        </button>
    );
}

function OptionButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${active
                    ? 'text-[var(--color-accent)] bg-[var(--color-bg-tertiary)]'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
        >
            {label}
        </button>
    );
}

function Divider() {
    return <div className="w-px h-5 bg-[var(--color-bg-tertiary)] mx-1" />;
}
