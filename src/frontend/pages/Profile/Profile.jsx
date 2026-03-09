import { useEffect, useState } from 'react';
import { useUserStore } from '@/backend/store/userStore';
import { getUserTests } from '@/backend/services/firebase';
import { PerformanceChart } from '../../components/Graphs/Graphs';
import { formatNumber, formatDate, formatDuration } from '@/backend/utils/wpmCalculator';
import { Clock, Trophy, Target, Zap, BarChart3, Hash, TrendingUp, Timer } from 'lucide-react';

export default function Profile() {
  const { user, profile } = useUserStore();
  const [loading, setLoading] = useState(true);
  const [tests, setTests] = useState([]);
  const [durationStats, setDurationStats] = useState({});
  const [overallStats, setOverallStats] = useState({ avgWpm: 0, avgAccuracy: 0, totalTests: 0, bestWpm: 0 });

  useEffect(() => {
    if (user?.uid) {
      getUserTests(user.uid, 50).then((fetchedTests) => {
        setTests(fetchedTests);

        const stats = {};
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
        console.error('Failed to fetch tests:', err);
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
    <div className="flex-1 px-4 sm:px-6 py-10 animate-fade-in flex flex-col items-center">
      <div className="w-full max-w-[1100px]">

        {/* ═══════════ Profile Header ═══════════ */}
        <div className="bg-[#2c2e31] rounded-2xl p-8 md:p-10 border border-[#363739] mb-8 shadow-lg relative overflow-hidden">
          {/* Subtle decorative gradient */}
          <div className="absolute top-0 right-0 w-60 h-60 bg-[#e2b714]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            {/* Left: Avatar + Info */}
            <div className="flex items-center gap-6">
              <div className="w-28 h-28 bg-gradient-to-br from-[#e2b714] to-[#c9a312] rounded-full flex items-center justify-center text-[#323437] font-bold text-5xl shadow-[0_0_30px_rgba(226,183,20,0.15)] flex-shrink-0 ring-4 ring-[#363739]">
                {displayName[0].toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#d1d0c5] mb-1">{displayName}</h1>
                <p className="text-sm text-[#646669]">{email}</p>
                <div className="flex items-center gap-3 mt-3">
                  <span className="px-3 py-1 bg-gradient-to-r from-[#e2b714]/20 to-[#e2b714]/10 text-[#e2b714] text-[10px] rounded-full uppercase font-bold tracking-widest border border-[#e2b714]/20">
                    Member
                  </span>
                  <span className="text-xs text-[#646669]">Joined {formatDate(joinedAt)}</span>
                </div>
              </div>
            </div>

            {/* Right: Quick Stats */}
            <div className="flex gap-10">
              <QuickStat icon={<Hash className="w-4 h-4" />} label="tests started" value={profile.testsStarted || 0} />
              <QuickStat icon={<Target className="w-4 h-4" />} label="tests completed" value={profile.testsCompleted || 0} />
              <QuickStat icon={<Clock className="w-4 h-4" />} label="time typed" value={formatDuration(profile.totalTypingTime || 0)} />
            </div>
          </div>
        </div>

        {/* ═══════════ Overview Stats Grid ═══════════ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard
            icon={<Trophy className="w-5 h-5 text-[#e2b714]" />}
            label="best wpm"
            value={formatNumber(overallStats.bestWpm)}
            accent
          />
          <StatCard
            icon={<Zap className="w-5 h-5 text-[#e2b714]" />}
            label="avg wpm"
            value={formatNumber(overallStats.avgWpm)}
          />
          <StatCard
            icon={<Target className="w-5 h-5 text-[#e2b714]" />}
            label="avg accuracy"
            value={`${formatNumber(overallStats.avgAccuracy)}%`}
          />
          <StatCard
            icon={<BarChart3 className="w-5 h-5 text-[#e2b714]" />}
            label="total tests"
            value={formatNumber(overallStats.totalTests)}
          />
        </div>

        {/* ═══════════ Personal Bests ═══════════ */}
        <div className="mb-10">
          <SectionTitle>Personal Bests</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[15, 30, 60, 120].map((d) => {
              const stat = durationStats[d] || { bestWPM: 0, avgWPM: 0, avgAccuracy: 0 };
              return (
                <div
                  key={d}
                  className="bg-[#2c2e31] rounded-xl p-6 border border-[#363739] hover:border-[#e2b714]/30 hover:shadow-[0_0_20px_rgba(226,183,20,0.06)] transition-all duration-300 group"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Timer className="w-4 h-4 text-[#e2b714] opacity-60 group-hover:opacity-100 transition-opacity" />
                    <span className="text-lg font-bold text-[#e2b714] font-[var(--font-mono)]">{d}s</span>
                  </div>
                  <div className="text-4xl font-bold text-[#d1d0c5] font-[var(--font-mono)] leading-tight mb-1">
                    {formatNumber(stat.bestWPM)}
                    <span className="text-sm text-[#646669] ml-1.5 font-normal">wpm</span>
                  </div>
                  <div className="text-xs text-[#646669] font-[var(--font-mono)] mt-4 pt-3 border-t border-[#363739]">
                    avg {formatNumber(stat.avgWPM)} wpm · {formatNumber(stat.avgAccuracy)}% acc
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ═══════════ WPM Over Time Chart ═══════════ */}
        {wpmOverTime.length > 1 && (
          <div className="mb-10">
            <SectionTitle>Performance History</SectionTitle>
            <div className="bg-[#2c2e31] rounded-xl p-6 md:p-8 border border-[#363739] shadow-sm">
              <div className="h-[280px] w-full">
                <PerformanceChart data={wpmOverTime} title="WPM" />
              </div>
            </div>
          </div>
        )}

        {/* ═══════════ Recent Tests Table ═══════════ */}
        {tests.length > 0 && (
          <div className="mb-10">
            <SectionTitle>Recent Tests</SectionTitle>
            <div className="bg-[#2c2e31] rounded-xl border border-[#363739] shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left align-middle border-collapse">
                  <thead>
                    <tr className="bg-[#363739]/30">
                      <th className="h-12 px-6 py-3 font-medium text-[#646669] uppercase tracking-wider text-xs">#</th>
                      <th className="h-12 px-6 py-3 font-medium text-[#646669] uppercase tracking-wider text-xs">WPM</th>
                      <th className="h-12 px-6 py-3 font-medium text-[#646669] uppercase tracking-wider text-xs">Raw</th>
                      <th className="h-12 px-6 py-3 font-medium text-[#646669] uppercase tracking-wider text-xs">Accuracy</th>
                      <th className="h-12 px-6 py-3 font-medium text-[#646669] uppercase tracking-wider text-xs">Mode</th>
                      <th className="h-12 px-6 py-3 font-medium text-[#646669] uppercase tracking-wider text-xs">Date</th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {tests.slice(0, 15).map((test, idx) => (
                      <tr
                        key={test.id}
                        className="border-b border-[#363739]/40 transition-colors hover:bg-[#363739]/20"
                      >
                        <td className="px-6 py-4 align-middle text-[#646669] font-[var(--font-mono)] text-xs">
                          {idx + 1}
                        </td>
                        <td className="px-6 py-4 align-middle font-[var(--font-mono)] text-[#e2b714] font-bold text-lg">
                          {test.wpm}
                        </td>
                        <td className="px-6 py-4 align-middle font-[var(--font-mono)] text-[#d1d0c5]">
                          {test.rawWpm}
                        </td>
                        <td className="px-6 py-4 align-middle font-[var(--font-mono)] text-[#d1d0c5]">
                          {formatNumber(test.accuracy)}%
                        </td>
                        <td className="px-6 py-4 align-middle">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-[#363739] text-[#d1d0c5]">
                            {test.mode} {test.mode === 'time' ? `${test.duration}s` : `${test.wordCount}w`}
                          </span>
                        </td>
                        <td className="px-6 py-4 align-middle font-[var(--font-mono)] text-[#646669] text-xs">
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
          </div>
        )}

        {/* ═══════════ Empty State ═══════════ */}
        {tests.length === 0 && (
          <div className="mb-10">
            <SectionTitle>Test History</SectionTitle>
            <div className="bg-[#2c2e31] rounded-xl p-14 border border-[#363739] text-center">
              <div className="w-16 h-16 bg-[#363739] rounded-2xl flex items-center justify-center mx-auto mb-5">
                <TrendingUp className="w-8 h-8 text-[#646669]" />
              </div>
              <h3 className="text-lg font-semibold text-[#d1d0c5] mb-2">No tests yet</h3>
              <p className="text-sm text-[#646669] max-w-sm mx-auto leading-relaxed">
                Complete your first typing test to start tracking your progress. Your results, charts, and personal bests will appear here.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

/* ─── Sub-components ─── */

function SectionTitle({ children }) {
  return (
    <h2 className="text-xs font-bold text-[#646669] mb-5 uppercase tracking-[0.15em] flex items-center gap-2">
      <span className="w-1 h-4 bg-[#e2b714] rounded-full" />
      {children}
    </h2>
  );
}

function QuickStat({ icon, label, value }) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-1.5 text-[#646669] mb-1">
        {icon}
      </div>
      <div className="text-2xl font-bold text-[#d1d0c5] font-[var(--font-mono)]">{value}</div>
      <div className="text-[10px] text-[#646669] uppercase tracking-wider mt-1 font-semibold">{label}</div>
    </div>
  );
}

function StatCard({ icon, label, value, accent }) {
  return (
    <div className="bg-[#2c2e31] rounded-xl p-6 border border-[#363739] text-center transition-all duration-300 shadow-sm hover:shadow-lg hover:border-[#454647] group">
      <div className="flex items-center justify-center mb-3 opacity-60 group-hover:opacity-100 transition-opacity">
        {icon}
      </div>
      <div className="text-[10px] font-bold text-[#646669] mb-2 uppercase tracking-widest">{label}</div>
      <div className={`text-4xl font-bold font-[var(--font-mono)] tracking-tight ${accent ? 'text-[#e2b714] drop-shadow-[0_0_12px_rgba(226,183,20,0.2)]' : 'text-[#d1d0c5]'}`}>
        {value}
      </div>
    </div>
  );
}
