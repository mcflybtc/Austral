'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export type AreaData = { date: string; value: number };

export function AreaChartComponent({ data }: { data: AreaData[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#93c5fd" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#93c5fd" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          className="text-xs text-slate-500"
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          className="text-xs text-slate-500"
        />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#2563eb"
          fill="url(#fill)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
