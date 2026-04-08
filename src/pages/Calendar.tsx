import { useState } from 'react';
import type { Metric, DayScore } from '../types';
import { formatMonth } from '../utils/dates';
import CalendarHeatmap from '../components/CalendarHeatmap';
import YearHeatmap from '../components/YearHeatmap';

interface CalendarProps {
  metrics: Metric[];
  scores: DayScore[];
  onDayClick: (date: string) => void;
}

type View = 'month' | 'year';

export default function Calendar({ metrics, scores, onDayClick }: CalendarProps) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [view, setView] = useState<View>('month');
  const [selectedMetric, setSelectedMetric] = useState<string>('');

  const goMonth = (offset: number) => {
    let m = month + offset;
    let y = year;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setMonth(m);
    setYear(y);
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Calendar</h2>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2">
        {/* View toggle */}
        <div className="flex bg-slate-200 dark:bg-slate-700 rounded-lg p-0.5">
          <button
            onClick={() => setView('month')}
            className={`px-3 py-1 text-sm rounded-md cursor-pointer ${
              view === 'month' ? 'bg-white dark:bg-slate-600 font-medium shadow-sm' : ''
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setView('year')}
            className={`px-3 py-1 text-sm rounded-md cursor-pointer ${
              view === 'year' ? 'bg-white dark:bg-slate-600 font-medium shadow-sm' : ''
            }`}
          >
            Year
          </button>
        </div>

        {/* Metric filter */}
        <select
          value={selectedMetric}
          onChange={(e) => setSelectedMetric(e.target.value)}
          className="text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5"
        >
          <option value="">All metrics (avg)</option>
          {metrics.map((m) => (
            <option key={m.id} value={m.id}>
              {m.emoji ? `${m.emoji} ` : ''}{m.name}
            </option>
          ))}
        </select>
      </div>

      {view === 'month' ? (
        <>
          {/* Month navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => goMonth(-1)}
              className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-lg cursor-pointer"
            >
              ←
            </button>
            <span className="text-lg font-semibold capitalize">{formatMonth(year, month)}</span>
            <button
              onClick={() => goMonth(1)}
              className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-lg cursor-pointer"
            >
              →
            </button>
          </div>

          <CalendarHeatmap
            year={year}
            month={month}
            scores={scores}
            onDayClick={onDayClick}
            metricId={selectedMetric || undefined}
          />
        </>
      ) : (
        <>
          {/* Year navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setYear((y) => y - 1)}
              className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-lg cursor-pointer"
            >
              ←
            </button>
            <span className="text-lg font-semibold">{year}</span>
            <button
              onClick={() => setYear((y) => y + 1)}
              className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-lg cursor-pointer"
            >
              →
            </button>
          </div>

          <YearHeatmap
            year={year}
            scores={scores}
            onDayClick={onDayClick}
            metricId={selectedMetric || undefined}
          />
        </>
      )}
    </div>
  );
}
