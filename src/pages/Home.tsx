import { useState } from 'react';
import type { Metric, DayScore } from '../types';
import { today, parseDate, toDateString, formatDateLong } from '../utils/dates';
import { getAverageForDate } from '../utils/storage';
import { scoreToColor } from '../utils/colors';
import DayInput from '../components/DayInput';

interface HomeProps {
  metrics: Metric[];
  scores: DayScore[];
  getScore: (date: string, metricId: string) => number | null;
  setScore: (date: string, metricId: string, value: number) => void;
}

export default function Home({ metrics, scores, getScore, setScore }: HomeProps) {
  const [selectedDate, setSelectedDate] = useState(today());

  const goDay = (offset: number) => {
    const d = parseDate(selectedDate);
    d.setDate(d.getDate() + offset);
    setSelectedDate(toDateString(d));
  };

  const isToday = selectedDate === today();
  const avg = getAverageForDate(scores, selectedDate);

  return (
    <div className="flex flex-col gap-6">
      {/* Date navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => goDay(-1)}
          className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-lg cursor-pointer"
        >
          ←
        </button>
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={() => setSelectedDate(today())}
            className={`text-lg font-bold cursor-pointer ${isToday ? '' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
          >
            {isToday ? "Today" : formatDateLong(selectedDate)}
          </button>
          {!isToday && (
            <span className="text-xs text-slate-400">{formatDateLong(selectedDate)}</span>
          )}
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
            className="text-xs text-slate-400 bg-transparent cursor-pointer"
          />
        </div>
        <button
          onClick={() => goDay(1)}
          className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-lg cursor-pointer"
        >
          →
        </button>
      </div>

      {/* Average badge */}
      {avg !== null && (
        <div className="flex justify-center">
          <div
            className="px-4 py-1.5 rounded-full text-white text-sm font-semibold"
            style={{ backgroundColor: scoreToColor(avg) }}
          >
            Average: {avg.toFixed(1)}
          </div>
        </div>
      )}

      {/* Score inputs */}
      <DayInput date={selectedDate} metrics={metrics} getScore={getScore} setScore={setScore} />
    </div>
  );
}
