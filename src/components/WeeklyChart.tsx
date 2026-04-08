import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { DayScore, Metric } from '../types';
import { toDateString } from '../utils/dates';
import { scoreToColor, NO_SCORE_COLOR } from '../utils/colors';

interface WeeklyChartProps {
  year: number;
  scores: DayScore[];
  metricId?: string;
  metrics: Metric[];
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

export default function WeeklyChart({ year, scores, metricId, metrics }: WeeklyChartProps) {
  // Build weekly averages
  const weekMap = new Map<number, number[]>();

  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);
  const d = new Date(startDate);
  while (d <= endDate) {
    const dateStr = toDateString(d);
    const week = getWeekNumber(d);

    const dayScores = metricId
      ? scores.filter((s) => s.date === dateStr && s.metricId === metricId)
      : scores.filter((s) => s.date === dateStr);

    if (dayScores.length > 0) {
      const avg = dayScores.reduce((sum, s) => sum + s.value, 0) / dayScores.length;
      if (!weekMap.has(week)) weekMap.set(week, []);
      weekMap.get(week)!.push(avg);
    }

    d.setDate(d.getDate() + 1);
  }

  const data = Array.from({ length: 53 }, (_, i) => {
    const week = i + 1;
    const values = weekMap.get(week);
    const avg = values ? values.reduce((a, b) => a + b, 0) / values.length : null;
    return { week: `W${week}`, value: avg, rawWeek: week };
  });

  const metricLabel = metricId
    ? metrics.find((m) => m.id === metricId)?.name || 'Metric'
    : 'All metrics';

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-medium text-slate-500">
        Weekly average — {metricLabel}
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
          <XAxis
            dataKey="week"
            tick={{ fontSize: 10 }}
            interval={3}
          />
          <YAxis domain={[0, 10]} tick={{ fontSize: 10 }} />
          <Tooltip
            formatter={(value) => [Number(value).toFixed(1), 'Avg']}
            contentStyle={{ fontSize: 12 }}
          />
          <Bar dataKey="value" radius={[2, 2, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.value !== null ? scoreToColor(entry.value) : NO_SCORE_COLOR}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
