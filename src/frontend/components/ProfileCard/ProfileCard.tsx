import { formatDate, formatDuration } from '@/backend/utils/wpmCalculator';

interface ProfileCardProps {
  displayName: string;
  email: string;
  joinedAt?: Date;
  testsStarted?: number;
  testsCompleted?: number;
  totalTypingTime?: number;
}

export default function ProfileCard({
  displayName,
  email,
  joinedAt,
  testsStarted = 0,
  testsCompleted = 0,
  totalTypingTime = 0,
}: ProfileCardProps) {
  return (
    <div className="bg-[#2c2e31] rounded-xl p-6 border border-[#363739] animate-fade-in">
      {/* Avatar and Name */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-[#e2b714] to-[#c9a312] rounded-full flex items-center justify-center text-[#323437] font-bold text-2xl shadow-lg">
          {displayName[0].toUpperCase()}
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#d1d0c5]">{displayName}</h2>
          <p className="text-sm text-[#646669]">{email}</p>
          {joinedAt && (
            <p className="text-xs text-[#454647] mt-1">
              Joined {formatDate(joinedAt)}
            </p>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <StatItem 
          label="Tests Started" 
          value={testsStarted.toString()} 
        />
        <StatItem 
          label="Tests Completed" 
          value={testsCompleted.toString()} 
        />
        <StatItem 
          label="Time Typed" 
          value={formatDuration(totalTypingTime)} 
        />
      </div>
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="text-lg font-bold text-[#d1d0c5] font-[var(--font-mono)]">
        {value}
      </div>
      <div className="text-[10px] text-[#646669] uppercase tracking-wider mt-1">
        {label}
      </div>
    </div>
  );
}
