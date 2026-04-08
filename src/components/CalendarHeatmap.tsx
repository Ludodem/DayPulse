import { getDaysInMonth, getMondayBasedDay, parseDate, today } from '../utils/dates';
import { scoreToColor, NO_SCORE_COLOR } from '../utils/colors';
import type { DayScore } from '../types';
import { getAverageForDate } from '../utils/storage';

interface CalendarHeatmapProps {
  year: number;
  month: number;
  scores: DayScore[];
  notes?: Record<string, string>;
  onDayClick?: (date: string) => void;
  metricId?: string;
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function CalendarHeatmap({ year, month, scores, notes, onDayClick, metricId }: CalendarHeatmapProps) {
  const days = getDaysInMonth(year, month);
  const firstDayOffset = getMondayBasedDay(parseDate(days[0]));
  const todayStr = today();

  const getColor = (date: string): string => {
    if (metricId) {
      const score = scores.find((s) => s.date === date && s.metricId === metricId);
      return score ? scoreToColor(score.value) : NO_SCORE_COLOR;
    }
    const avg = getAverageForDate(scores, date);
    return avg !== null ? scoreToColor(avg) : NO_SCORE_COLOR;
  };

  const getValue = (date: string): string => {
    if (metricId) {
      const score = scores.find((s) => s.date === date && s.metricId === metricId);
      return score ? String(score.value) : '';
    }
    const avg = getAverageForDate(scores, date);
    return avg !== null ? avg.toFixed(1) : '';
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Day labels */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {DAY_LABELS.map((d) => (
          <span key={d} className="text-xs text-slate-400 font-medium">{d}</span>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for offset */}
        {Array.from({ length: firstDayOffset }, (_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {days.map((date) => {
          const dayNum = parseDate(date).getDate();
          const color = getColor(date);
          const value = getValue(date);
          const isToday = date === todayStr;
          const hasNote = !!notes?.[date];

          return (
            <button
              key={date}
              onClick={() => onDayClick?.(date)}
              className={`relative aspect-square rounded-lg flex flex-col items-center justify-center text-xs cursor-pointer transition-transform hover:scale-105 ${
                isToday ? 'ring-2 ring-emerald-500 ring-offset-1' : ''
              }`}
              style={{ backgroundColor: color }}
              title={`${date}: ${value || 'no score'}`}
            >
              <span className={`font-medium ${color !== NO_SCORE_COLOR ? 'text-white' : 'text-slate-500'}`}>
                {dayNum}
              </span>
              {value && (
                <span className={`text-[10px] font-bold ${color !== NO_SCORE_COLOR ? 'text-white/80' : ''}`}>
                  {value}
                </span>
              )}
              {hasNote && (
                <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-blue-500" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
