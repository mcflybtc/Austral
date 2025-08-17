'use client';

import { useState } from 'react';
import { Calendar, Moon, Sun } from 'lucide-react';

type Event = { date: string; label: string; icon: JSX.Element };

function generateEvents(year: number): Event[] {
  return [
    {
      date: `${year}-03-20`,
      label: 'Equinócio de Primavera',
      icon: <Sun className="h-4 w-4" />,
    },
    {
      date: `${year}-06-21`,
      label: 'Solstício de Verão',
      icon: <Sun className="h-4 w-4" />,
    },
    {
      date: `${year}-09-22`,
      label: 'Equinócio de Outono',
      icon: <Sun className="h-4 w-4" />,
    },
    {
      date: `${year}-12-21`,
      label: 'Solstício de Inverno',
      icon: <Sun className="h-4 w-4" />,
    },
    {
      date: `${year}-04-08`,
      label: 'Eclipse Solar',
      icon: <Moon className="h-4 w-4" />,
    },
    {
      date: `${year}-10-02`,
      label: 'Eclipse Lunar',
      icon: <Moon className="h-4 w-4" />,
    },
  ];
}

export function SeasonsCalendar() {
  const [year, setYear] = useState(new Date().getFullYear());
  const events = generateEvents(year);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4" />
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="w-24 border bg-transparent px-2 py-1 text-sm"
        />
      </div>
      <ul className="space-y-1 text-sm">
        {events.map((ev) => (
          <li key={ev.date} className="flex items-center gap-2">
            {ev.icon}
            <span>
              {ev.label}: {ev.date}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
