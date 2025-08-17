"use client";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

export type CycleData = { date: string; [key: string]: number | string };

export function CycleChart({ data }: { data: CycleData[] }) {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 360]} />
          <Tooltip />
          <Legend />
          {Object.keys(data[0] || {}).filter(k => k !== "date").map((key, idx) => (
            <Line key={key} type="monotone" dataKey={key} stroke={idx === 0 ? "#f59e0b" : "#6366f1"} dot={false} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
