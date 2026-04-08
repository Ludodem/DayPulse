import { toDateString, getMondayBasedDay, today } from '../utils/dates';
import { scoreToColor, NO_SCORE_COLOR } from '../utils/colors';
import type { DayScore } from '../types';
import { getAverageForDate } from '../utils/storage';

interface YearHeatmapProps {
  year: number;
  scores: DayScore[];
  onDayClick?: (date: string) => void;
  metricId?: string;
}

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function YearHeatmap({ year, scores, onDayClick, metricId }: YearHeatmapProps) {
  const todayStr = today();

  // Build all days of the year grouped by week
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);
  const weeks: { date: string; dayOfWeek: number }[][] = [];
  let currentWeek: { date: string; dayOfWeek: number }[] = [];

  const d = new Date(startDate);
  while (d <= endDate) {
    const dateStr = toDateString(d);
    const dow = getMondayBasedDay(d);

    if (dow === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push({ date: dateStr, dayOfWeek: dow });
    d.setDate(d.getDate() + 1);
  }
  if (currentWeek.length > 0) weeks.push(currentWeek);

  const getColor = (date: string): string => {
    if (metricId) {
      const score = scores.find((s) => s.date === date && s.metricId === metricId);
      return score ? scoreToColor(score.value) : NO_SCORE_COLOR;
    }
    const avg = getAverageForDate(scores, date);
    return avg !== null ? scoreToColor(avg) : NO_SCORE_COLOR;
  };

  // Calculate month label positions
  const monthPositions: { label: string; weekIndex: number }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, weekIndex) => {
    const firstDay = week[0];
    const month = new Date(firstDay.date).getMonth();
    if (month !== lastMonth) {
      monthPositions.push({ label: MONTH_LABELS[month], weekIndex });
      lastMonth = month;
    }
  });

  return (
    <div className="flex flex-col gap-1 overflow-x-auto">
      {/* Month labels */}
      <div className="flex gap-[3px] ml-0 text-xs text-slate-400 min-w-fit">
        {monthPositions.map(({ label, weekIndex }) => (
          <span
            key={label}
            className="absolute"
            style={{ marginLeft: weekIndex * 15 }}
          >
            {label}
          </span>
        ))}
      </div>

      {/* Heatmap grid */}
      <div className="flex gap-[3px] mt-5 min-w-fit">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {Array.from({ length: 7 }, (_, dow) => {
              const day = week.find((d) => d.dayOfWeek === dow);
              if (!day) return <div key={dow} className="w-[11px] h-[11px]" />;

              const color = getColor(day.date);
              const isToday = day.date === todayStr;

              return (
                <button
                  key={dow}
                  onClick={() => onDayClick?.(day.date)}
                  className={`w-[11px] h-[11px] rounded-sm cursor-pointer transition-transform hover:scale-150 ${
                    isToday ? 'ring-1 ring-emerald-500' : ''
                  }`}
                  style={{ backgroundColor: color }}
                  title={day.date}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
