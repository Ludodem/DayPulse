import { useState } from 'react';
import type { Metric, DayScore } from '../types';
import WeeklyChart from '../components/WeeklyChart';
import MonthlyChart from '../components/MonthlyChart';

interface StatsProps {
  metrics: Metric[];
  scores: DayScore[];
}

type View = 'weekly' | 'monthly';

export default function Stats({ metrics, scores }: StatsProps) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [view, setView] = useState<View>('weekly');
  const [selectedMetric, setSelectedMetric] = useState<string>('');

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Stats</h2>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2">
        {/* View toggle */}
        <div className="flex bg-slate-200 dark:bg-slate-700 rounded-lg p-0.5">
          <button
            onClick={() => setView('weekly')}
            className={`px-3 py-1 text-sm rounded-md cursor-pointer ${
              view === 'weekly' ? 'bg-white dark:bg-slate-600 font-medium shadow-sm' : ''
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setView('monthly')}
            className={`px-3 py-1 text-sm rounded-md cursor-pointer ${
              view === 'monthly' ? 'bg-white dark:bg-slate-600 font-medium shadow-sm' : ''
            }`}
          >
            Monthly
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

      {/* Chart */}
      {view === 'weekly' ? (
        <WeeklyChart
          year={year}
          scores={scores}
          metricId={selectedMetric || undefined}
          metrics={metrics}
        />
      ) : (
        <MonthlyChart
          year={year}
          scores={scores}
          metricId={selectedMetric || undefined}
          metrics={metrics}
        />
      )}
    </div>
  );
}
