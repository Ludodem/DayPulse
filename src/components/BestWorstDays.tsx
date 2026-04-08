import { useState } from 'react';
import type { DayScore, Metric } from '../types';
import { formatDateLong } from '../utils/dates';
import { scoreToColor } from '../utils/colors';

interface BestWorstDaysProps {
  year: number;
  scores: DayScore[];
  metricId?: string;
  metrics: Metric[];
  onDayClick: (date: string) => void;
}

export default function BestWorstDays({ year, scores, metricId, metrics, onDayClick }: BestWorstDaysProps) {
  const [open, setOpen] = useState(false);

  // Build daily averages for the year
  const prefix = `${year}-`;
  const dayMap = new Map<string, number[]>();

  for (const s of scores) {
    if (!s.date.startsWith(prefix)) continue;
    if (metricId && s.metricId !== metricId) continue;
    if (!dayMap.has(s.date)) dayMap.set(s.date, []);
    dayMap.get(s.date)!.push(s.value);
  }

  const ranked = Array.from(dayMap.entries())
    .map(([date, values]) => ({
      date,
      avg: values.reduce((a, b) => a + b, 0) / values.length,
    }))
    .sort((a, b) => b.avg - a.avg);

  if (ranked.length === 0) return null;

  const best = ranked.slice(0, 5);
  const worst = [...ranked].reverse().slice(0, 5);

  const metricLabel = metricId
    ? metrics.find((m) => m.id === metricId)?.name || 'Metric'
    : 'All metrics';

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-sm text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 cursor-pointer"
      >
        Show best & worst days...
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-500">
          Best & worst days — {metricLabel}
        </h3>
        <button
          onClick={() => setOpen(false)}
          className="text-xs text-slate-400 hover:text-slate-500 cursor-pointer"
        >
          Hide
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DayList title="Best" days={best} onDayClick={onDayClick} />
        <DayList title="Worst" days={worst} onDayClick={onDayClick} />
      </div>
    </div>
  );
}

function DayList({ title, days, onDayClick }: {
  title: string;
  days: { date: string; avg: number }[];
  onDayClick: (date: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{title}</span>
      {days.map(({ date, avg }) => (
        <button
          key={date}
          onClick={() => onDayClick(date)}
          className="flex items-center justify-between px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-sm"
        >
          <span className="text-slate-600 dark:text-slate-300">{formatDateLong(date)}</span>
          <span
            className="font-bold text-white text-xs px-2 py-0.5 rounded"
            style={{ backgroundColor: scoreToColor(avg) }}
          >
            {avg.toFixed(1)}
          </span>
        </button>
      ))}
    </div>
  );
}
