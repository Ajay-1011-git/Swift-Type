import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
  Bar,
  LineChart,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#2c2e31] border border-[#363739] rounded-lg p-3 shadow-xl">
        <p className="text-xs text-[#646669] mb-1">{`Time: ${label}s`}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm font-[var(--font-mono)]" style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function WPMChart({ wpmHistory, errorHistory }) {
  const data = wpmHistory.map((point, index) => {
    const time = typeof point === 'number' ? index + 1 : point.time;
    const wpm = typeof point === 'number' ? point : point.wpm;
    const errObj = errorHistory?.[index];
    const errors = typeof errObj === 'number' ? errObj : errObj?.errors || 0;
    return { time, wpm, errors };
  });

  if (data.length === 0) {
    return (
      <div className="h-48 md:h-64 flex items-center justify-center text-[#646669] text-sm">
        No data available
      </div>
    );
  }

  return (
    <div className="h-48 md:h-64" style={{ minWidth: 0, minHeight: 0 }}>
      <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
        <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="wpmGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#e2b714" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#e2b714" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#363739" vertical={false} />
          <XAxis
            dataKey="time"
            stroke="#646669"
            tick={{ fill: '#646669', fontSize: 11, fontFamily: 'JetBrains Mono' }}
            tickLine={false}
            axisLine={{ stroke: '#363739' }}
            label={{ value: 'time (s)', position: 'insideBottom', offset: -5, fill: '#646669', fontSize: 10 }}
          />
          <YAxis
            yAxisId="wpm"
            stroke="#646669"
            tick={{ fill: '#646669', fontSize: 11, fontFamily: 'JetBrains Mono' }}
            tickLine={false}
            axisLine={false}
            domain={[0, 'auto']}
          />
          <YAxis
            yAxisId="errors"
            orientation="right"
            stroke="#ca4754"
            tick={{ fill: '#ca4754', fontSize: 11, fontFamily: 'JetBrains Mono' }}
            tickLine={false}
            axisLine={false}
            domain={[0, 'auto']}
            hide
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            yAxisId="wpm"
            type="monotone"
            dataKey="wpm"
            stroke="#e2b714"
            strokeWidth={2}
            fill="url(#wpmGradient)"
            dot={false}
            activeDot={{ r: 4, fill: '#e2b714', stroke: '#323437', strokeWidth: 2 }}
            name="WPM"
          />
          {errorHistory && errorHistory.some((e) => (typeof e === 'number' ? e : e?.errors) > 0) && (
            <Bar
              yAxisId="errors"
              dataKey="errors"
              fill="#ca4754"
              opacity={0.6}
              radius={[2, 2, 0, 0]}
              barSize={8}
              name="Errors"
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PerformanceChart({ data, title = 'WPM' }) {
  if (data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-[#646669] text-sm">
        No data available
      </div>
    );
  }

  return (
    <div className="h-full w-full" style={{ minWidth: 0, minHeight: 0 }}>
      <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="performanceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#e2b714" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#e2b714" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#363739" vertical={false} />
          <XAxis
            dataKey="label"
            stroke="#646669"
            tick={{ fill: '#646669', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            tickLine={false}
            axisLine={{ stroke: '#363739' }}
            interval="preserveStartEnd"
          />
          <YAxis
            stroke="#646669"
            tick={{ fill: '#646669', fontSize: 11, fontFamily: 'JetBrains Mono' }}
            tickLine={false}
            axisLine={false}
            domain={[0, 'auto']}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#2c2e31',
              border: '1px solid #363739',
              borderRadius: '8px',
              padding: '12px',
            }}
            labelStyle={{ color: '#646669', fontSize: '11px', marginBottom: '4px' }}
            itemStyle={{ color: '#e2b714', fontSize: '13px', fontFamily: 'JetBrains Mono' }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#e2b714"
            strokeWidth={2}
            fill="url(#performanceGradient)"
            dot={false}
            activeDot={{ r: 4, fill: '#e2b714', stroke: '#323437', strokeWidth: 2 }}
            name={title}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
