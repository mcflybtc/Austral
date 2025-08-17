'use client';

import { useState } from 'react';
import { Circle, Divide, Hexagon, Square, Triangle } from 'lucide-react';

const aspects = [0, 60, 90, 120, 180] as const;
const aspectIcons: Record<number, JSX.Element> = {
  0: <Circle className="h-4 w-4" />,
  60: <Hexagon className="h-4 w-4" />,
  90: <Square className="h-4 w-4" />,
  120: <Triangle className="h-4 w-4" />,
  180: <Divide className="h-4 w-4" />,
};

export function AstroCalculator() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [aspect, setAspect] = useState<(typeof aspects)[number]>(0);

  const diff = Math.abs(a - b);
  const match = Math.abs(diff - aspect) < 1;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={a}
          onChange={(e) => setA(Number(e.target.value))}
          className="w-24 border bg-transparent px-2 py-1 text-sm"
        />
        <input
          type="number"
          value={b}
          onChange={(e) => setB(Number(e.target.value))}
          className="w-24 border bg-transparent px-2 py-1 text-sm"
        />
        <select
          value={aspect}
          onChange={(e) =>
            setAspect(Number(e.target.value) as (typeof aspects)[number])
          }
          className="border bg-transparent px-2 py-1 text-sm"
        >
          {aspects.map((a) => (
            <option key={a} value={a}>
              {a}°
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2 text-sm">
        {aspectIcons[aspect]}
        <span>
          Diferença: {diff.toFixed(2)}° {match ? '(alinhado)' : ''}
        </span>
      </div>
    </div>
  );
}
