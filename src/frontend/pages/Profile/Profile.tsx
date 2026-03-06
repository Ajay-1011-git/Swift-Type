import { useEffect, useState } from 'react';
import { useUserStore } from '@/backend/store/userStore';
import { getUserTests, type TypingTestResult } from '@/backend/services/firebase';
import { PerformanceChart } from '../../components/Graphs/Graphs';
import { formatNumber, formatDate, formatDuration } from '@/backend/utils/wpmCalculator';

export default function Profile() {
  const { user, profile } = useUserStore();
  const [loading, setLoading] = useState(true);
  const [tests, setTests] = useState<(TypingTestResult & { id: string })[]>([]);
  const [durationStats, setDurationStats] = useState<Record<number, { bestWPM: number; avgWPM: number; avgAccuracy: number }>>({});
  const [overallStats, setOverallStats] = useState({ avgWpm: 0, avgAccuracy: 0, totalTests: 0, bestWpm: 0 });

  useEffect(() => {
    if (user?.uid) {
      getUserTests(user.uid, 50).then((fetchedTests) => {
        setTests(fetchedTests);

        // Calculate per-duration stats
        const stats: Record<number, { bestWPM: number; avgWPM: number; avgAccuracy: number; count: number; sumWpm: number; sumAcc: number }> = {};
        let totalWpm = 0;
        let totalAcc = 0;
        let bestWpm = 0;

        fetchedTests.forEach(t => {
          totalWpm += t.wpm;
          totalAcc += t.accuracy;
          if (t.wpm > bestWpm) bestWpm = t.wpm;

          if (!stats[t.duration]) {
            stats[t.duration] = { bestWPM: t.wpm, avgWPM: t.wpm, avgAccuracy: t.accuracy, count: 1, sumWpm: t.wpm, sumAcc: t.accuracy };
          } else {
            if (t.wpm > stats[t.duration].bestWPM) stats[t.duration].bestWPM = t.wpm;
            stats[t.duration].count += 1;
            stats[t.duration].sumWpm += t.wpm;
            stats[t.duration].sumAcc += t.accuracy;
            stats[t.duration].avgWPM = stats[t.duration].sumWpm / stats[t.duration].count;
            stats[t.duration].avgAccuracy = stats[t.duration].sumAcc / stats[t.duration].count;
          }
        });

        setDurationStats(stats);
        setOverallStats({
          avgWpm: fetchedTests.length > 0 ? Math.round(totalWpm / fetchedTests.length) : 0,
          avgAccuracy: fetchedTests.length > 0 ? Math.round((totalAcc / fetchedTests.length) * 100) / 100 : 0,
          totalTests: fetchedTests.length,
          bestWpm,
        });
        setLoading(false);
      }).catch((err) => {
        console.error(err);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading || !profile) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#646669]">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="31.4 31.4" />
          </svg>
          Loading your stats...
        </div>
      </div>
    );
  }

  const displayName = profile.displayName || user?.displayName || 'User';
  const email = profile.email || user?.email || '';
  const joinedAt = profile.createdAt?.toDate() || new Date();

  const wpmOverTime = tests.slice().reverse().map((t, i) => ({
    label: `#${i + 1}`,
    value: t.wpm,
  }));

  return (
    <div className="flex-1 px-6 py-12 animate-fade-in flex flex-col items-center">
      <div className="w-full max-w-[1000px]">
        {/* Profile Header Block */}
        <div className="bg-[#2c2e31] rounded-2xl p-8 border border-[#363739] mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 bg-gradient-to-br from-[#e2b714] to-[#c9a312] rounded-full flex items-center justify-center text-[#323437] font-bold text-4xl shadow-lg flex-shrink-0">
                {displayName[0].toUpperCase()}
              </div>
              {/* Info */}
              <div>
                <h1 className="text-3xl font-bold text-[#d1d0c5]">{displayName}</h1>
                <p className="text-sm text-[#646669] mt-1">{email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2.5 py-1 bg-[#363739] text-[#d1d0c5] text-[10px] rounded uppercase font-semibold tracking-wider">
                    Member
                  </span>
                  <span className="text-xs text-[#646669]">Joined {formatDate(joinedAt)}</span>
                </div>
              </div>
            </div>

            {/* Quick stats */}
            <div className="flex gap-8">
              <QuickStat label="tests started" value={profile.testsStarted || 0} />
              <QuickStat label="tests completed" value={profile.testsCompleted || 0} />
              <QuickStat label="time typed" value={formatDuration(profile.totalTypingTime || 0)} />
            </div>
          </div>
        </div>

        {/* Average Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard label="best wpm" value={formatNumber(overallStats.bestWpm)} accent />
          <StatCard label="avg wpm" value={formatNumber(overallStats.avgWpm)} />
          <StatCard label="avg accuracy" value={`${formatNumber(overallStats.avgAccuracy)}%`} />
          <StatCard label="total tests" value={formatNumber(overallStats.totalTests)} />
        </div>

        {/* Personal Bests by Duration */}
        <div className="mb-10">
          <h2 className="text-sm font-semibold text-[#646669] mb-4 uppercase tracking-wider">
            Personal Bests
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[15, 30, 60, 120].map((d) => {
              const stat = durationStats[d] || { bestWPM: 0, avgWPM: 0, avgAccuracy: 0 };
              return (
                <div
                  key={d}
                  className="bg-[#2c2e31] rounded-xl p-5 border border-[#363739] hover:border-[#e2b714]/30 hover:shadow-[0_0_15px_rgba(226,183,20,0.05)] transition-all duration-300"
                >
                  <div className="text-xl font-bold text-[#e2b714] font-[var(--font-mono)] mb-1">
                    {d}s
                  </div>
                  <div className="text-3xl font-bold text-[#d1d0c5] font-[var(--font-mono)] leading-tight">
                    {formatNumber(stat.bestWPM)}
                    <span className="text-base text-[#646669] ml-1">wpm</span>
                  </div>
                  <div className="text-xs text-[#646669] font-[var(--font-mono)] mt-3">
                    avg {formatNumber(stat.avgWPM)} wpm · {formatNumber(stat.avgAccuracy)}% acc
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* WPM Chart */}
        {wpmOverTime.length > 1 && (
          <div className="bg-[#2c2e31] rounded-xl p-6 border border-[#363739] mb-10 shadow-sm">
            <h2 className="text-sm font-semibold text-[#646669] mb-6 uppercase tracking-wider">
              WPM Over Time
            </h2>
            <div className="h-[250px] w-full">
              <PerformanceChart data={wpmOverTime} title="WPM" />
            </div>
          </div>
        )}

        {/* Recent Tests Table using pure HTML matching Shadcn aesthetic */}
        {tests.length > 0 && (
          <div className="bg-[#2c2e31] rounded-xl p-6 border border-[#363739] shadow-sm">
            <h2 className="text-sm font-semibold text-[#646669] mb-6 uppercase tracking-wider">
              Recent Tests
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left align-middle border-collapse">
                <thead>
                  <tr className="border-b border-[#363739]">
                    <th className="h-10 px-4 py-2 font-medium text-[#646669] uppercase tracking-wider">WPM</th>
                    <th className="h-10 px-4 py-2 font-medium text-[#646669] uppercase tracking-wider">Raw</th>
                    <th className="h-10 px-4 py-2 font-medium text-[#646669] uppercase tracking-wider">Accuracy</th>
                    <th className="h-10 px-4 py-2 font-medium text-[#646669] uppercase tracking-wider">Mode</th>
                    <th className="h-10 px-4 py-2 font-medium text-[#646669] uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {tests.slice(0, 10).map((test) => (
                    <tr
                      key={test.id}
                      className="border-b border-[#363739]/50 transition-colors hover:bg-[#363739]/30"
                    >
                      <td className="p-4 align-middle font-[var(--font-mono)] text-[#e2b714] font-semibold text-lg">{test.wpm}</td>
                      <td className="p-4 align-middle font-[var(--font-mono)] text-[#d1d0c5] text-base">{test.rawWpm}</td>
                      <td className="p-4 align-middle font-[var(--font-mono)] text-[#d1d0c5] text-base">{formatNumber(test.accuracy)}%</td>
                      <td className="p-4 align-middle text-[#646669]">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#363739] text-[#d1d0c5]">
                          {test.mode} {test.mode === 'time' ? `${test.duration}s` : `${test.wordCount} w`}
                        </span>
                      </td>
                      <td className="p-4 align-middle font-[var(--font-mono)] text-[#646669] text-xs">
                        {test.timestamp?.toDate().toLocaleString(undefined, {
                          month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
                        }) || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function QuickStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="text-center">
      <div className="text-2xl font-bold text-[#d1d0c5] font-[var(--font-mono)]">{value}</div>
      <div className="text-[10px] text-[#646669] uppercase tracking-wider mt-1 font-semibold">{label}</div>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number | string; accent?: boolean }) {
  return (
    <div className="bg-[#2c2e31] rounded-xl p-6 border border-[#363739] text-center transition-all duration-300 shadow-sm hover:shadow-md hover:border-[#454647]">
      <div className="text-[11px] font-semibold text-[#646669] mb-3 uppercase tracking-wider">{label}</div>
      <div className={`text-4xl font-bold font-[var(--font-mono)] tracking-tight ${accent ? 'text-[#e2b714] drop-shadow-[0_0_8px_rgba(226,183,20,0.2)]' : 'text-[#d1d0c5]'}`}>
        {value}
      </div>
    </div>
  );
}
