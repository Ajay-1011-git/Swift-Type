import { useTypingStore } from '@/backend/store/typingStore';
import { useUserStore } from '@/backend/store/userStore';
import { useEffect, useRef } from 'react';
import { formatNumber } from '@/backend/utils/wpmCalculator';
import { saveTypingTest, updateUserStats, incrementTestsStarted } from '@/backend/services/firebase';
import { WPMChart } from '../Graphs/Graphs';

export default function ResultsPanel() {
  const {
    status,
    wpm,
    rawWpm,
    accuracy,
    consistency,
    errors,
    correctChars,
    incorrectChars,
    extraChars,
    missedChars,
    wpmHistory,
    errorHistory,
    timeElapsed,
    mode,
    timeLimit,
    wordLimit,
    words,
    resetTest,
  } = useTypingStore();

  const { user, fetchProfile } = useUserStore();
  const savedRef = useRef(false);

  // Reset saved flag when test resets
  useEffect(() => {
    if (status === 'idle') {
      savedRef.current = false;
    }
  }, [status]);

  // Save test results to Firestore when a test finishes
  useEffect(() => {
    if (status === 'finished' && user?.uid && !savedRef.current) {
      savedRef.current = true;

      const testResult = {
        userId: user.uid,
        mode,
        duration: timeLimit,
        wordCount: mode === 'words' ? wordLimit : words.length,
        wpm,
        rawWpm,
        accuracy,
        errors,
        correctChars,
        incorrectChars,
        extraChars,
        missedChars,
        consistency,
        wpmHistory,
        errorHistory,
      };

      saveTypingTest(testResult)
        .then(() => {
          console.log('Test saved successfully');
          return updateUserStats(user.uid, wpm, accuracy, timeElapsed);
        })
        .then(() => {
          // Refresh the user profile so profile page shows updated stats
          fetchProfile(user.uid);
        })
        .catch((err) => {
          console.error('Failed to save test:', err);
        });
    }
  }, [status]);

  // Increment tests started when the test begins
  useEffect(() => {
    if (status === 'running' && user?.uid) {
      incrementTestsStarted(user.uid).catch((err) => {
        console.error('Failed to increment tests started:', err);
      });
    }
  }, [status]);

  if (status !== 'finished') return null;

  return (
    <div className="w-full max-w-[850px] mx-auto px-4 animate-slide-up">
      {/* Main Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        <StatCard label="wpm" value={wpm} accent large />
        <StatCard label="accuracy" value={`${formatNumber(accuracy)}%`} />
        <StatCard label="raw wpm" value={rawWpm} />
        <StatCard label="consistency" value={`${formatNumber(consistency || 100)}%`} />
      </div>

      {/* Chart Section */}
      <div className="bg-[#2c2e31] rounded-xl p-4 md:p-5 mb-6 border border-[#363739] shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)]">
        <WPMChart wpmHistory={wpmHistory} errorHistory={errorHistory} />
      </div>

      {/* Detail Stats Grid */}
      <div className="grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-3 mb-6">
        <DetailCard label="errors" value={errors} color="text-[#ca4754]" />
        <DetailCard label="correct" value={correctChars} color="text-[#d1d0c5]" />
        <DetailCard label="incorrect" value={incorrectChars} color="text-[#ca4754]" />
        <DetailCard label="extra" value={extraChars} color="text-[#7e2a33]" />
        <DetailCard label="missed" value={missedChars} color="text-[#646669]" />
      </div>

      {/* Character Summary */}
      <div className="bg-[#2c2e31] rounded-xl p-4 mb-6 border border-[#363739]">
        <div className="text-xs text-[#646669] mb-2 uppercase tracking-wider">characters</div>
        <div className="font-[var(--font-mono)] text-sm flex items-center gap-2 flex-wrap">
          <span className="text-[#d1d0c5] font-medium">{correctChars}</span>
          <span className="text-[#454647]">/</span>
          <span className="text-[#ca4754] font-medium">{incorrectChars}</span>
          <span className="text-[#454647]">/</span>
          <span className="text-[#7e2a33] font-medium">{extraChars}</span>
          <span className="text-[#454647]">/</span>
          <span className="text-[#646669] font-medium">{missedChars}</span>
        </div>
        <div className="mt-2 text-xs text-[#646669]">
          correct / incorrect / extra / missed
        </div>
      </div>

      {/* Test Info */}
      <div className="flex items-center justify-between mb-6 px-1">
        <div className="text-xs text-[#646669]">
          Mode: <span className="text-[#d1d0c5]">{mode}</span>
          {mode === 'time' && <span className="text-[#d1d0c5]"> {timeLimit}s</span>}
          {mode === 'words' && <span className="text-[#d1d0c5]"> {wordLimit} words</span>}
        </div>
        <div className="text-xs text-[#646669]">
          Time: <span className="text-[#d1d0c5]">{timeElapsed}s</span>
        </div>
      </div>

      {/* Restart Button */}
      <div className="text-center">
        <button
          onClick={resetTest}
          className="group px-6 py-3 bg-[#2c2e31] text-[#646669] rounded-xl hover:bg-[#363739] hover:text-[#d1d0c5] transition-all duration-200 text-sm font-medium border border-[#363739] hover:border-[#e2b714] btn-hover-lift"
        >
          <span className="flex items-center gap-2">
            <svg
              width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="transition-transform duration-200 group-hover:rotate-180"
            >
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            Next Test
          </span>
        </button>
      </div>
    </div>
  );
}

function StatCard({ label, value, accent, large }) {
  return (
    <div className="stat-card group">
      <div className="text-xs text-[#646669] mb-1 uppercase tracking-wider">{label}</div>
      <div className={`stat-value ${large ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'} ${accent ? 'text-[#e2b714]' : 'text-[#d1d0c5]'}`}>
        {value}
      </div>
    </div>
  );
}

function DetailCard({ label, value, color }) {
  return (
    <div className="bg-[#2c2e31] rounded-lg p-3 border border-[#363739] transition-all duration-200 hover:border-[#454647]">
      <div className="text-[10px] text-[#646669] mb-1 uppercase tracking-wider">{label}</div>
      <div className={`font-[var(--font-mono)] font-semibold text-lg ${color || 'text-[#d1d0c5]'}`}>
        {value}
      </div>
    </div>
  );
}
