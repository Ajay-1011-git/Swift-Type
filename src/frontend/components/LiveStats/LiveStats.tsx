import { Timer, TrendingUp, Target, Award } from 'lucide-react';
import { useTypingStore } from '@/backend/store/typingStore';

export default function LiveStats() {
  const { status, wpm, accuracy, timeRemaining, bestWpm } = useTypingStore();

  if (status !== 'running') return null;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-4 animate-fade-in-up">
      <div className="flex items-center justify-center gap-8 text-sm font-mono-swift">
        {/* WPM */}
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#646669]" />
          <span className="text-[#646669]">WPM:</span>
          <span className="text-[#e2b714] font-bold text-lg">{wpm}</span>
        </div>

        {/* Accuracy */}
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-[#646669]" />
          <span className="text-[#646669]">Accuracy:</span>
          <span
            className={`font-bold text-lg ${
              accuracy >= 95
                ? 'text-[#d1d0c5]'
                : accuracy >= 85
                  ? 'text-[#e2b714]'
                  : 'text-[#ca4754]'
            }`}
          >
            {accuracy.toFixed(1)}%
          </span>
        </div>

        {/* Best WPM */}
        {bestWpm > 0 && (
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#646669]" />
            <span className="text-[#646669]">Best:</span>
            <span className="text-[#d1d0c5] font-bold text-lg">{bestWpm}</span>
          </div>
        )}

        {/* Time */}
        <div className="flex items-center gap-2">
          <Timer className="w-4 h-4 text-[#646669]" />
          <span className="text-[#646669]">Time:</span>
          <span className="text-[#d1d0c5] font-bold text-lg">
            {`${timeRemaining}s`}
          </span>
        </div>
      </div>
    </div>
  );
}
