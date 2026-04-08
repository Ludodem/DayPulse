import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import type { Metric } from '../types';
import { today, parseDate, toDateString, formatDateLong } from '../utils/dates';
import DayInput from '../components/DayInput';

interface HomeProps {
  metrics: Metric[];
  getScore: (date: string, metricId: string) => number | null;
  setScore: (date: string, metricId: string, value: number) => void;
}

export default function Home({ metrics, getScore, setScore }: HomeProps) {
  const location = useLocation();
  const [selectedDate, setSelectedDate] = useState(today());

  useEffect(() => {
    const navDate = (location.state as { date?: string } | null)?.date;
    if (navDate) setSelectedDate(navDate);
  }, [location.state]);

  const goDay = (offset: number) => {
    const d = parseDate(selectedDate);
    d.setDate(d.getDate() + offset);
    setSelectedDate(toDateString(d));
  };

  const isToday = selectedDate === today();

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

      {/* Score inputs */}
      <DayInput date={selectedDate} metrics={metrics} getScore={getScore} setScore={setScore} />
    </div>
  );
}
