import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { DayScore, Metric } from '../types';
import { scoreToColor, NO_SCORE_COLOR } from '../utils/colors';

interface MonthlyChartProps {
  year: number;
  scores: DayScore[];
  metricId?: string;
  metrics: Metric[];
}

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function MonthlyChart({ year, scores, metricId, metrics }: MonthlyChartProps) {
  const data = MONTH_LABELS.map((label, monthIndex) => {
    const prefix = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
    const monthScores = metricId
      ? scores.filter((s) => s.date.startsWith(prefix) && s.metricId === metricId)
      : scores.filter((s) => s.date.startsWith(prefix));

    const avg = monthScores.length > 0
      ? monthScores.reduce((sum, s) => sum + s.value, 0) / monthScores.length
      : null;

    return { month: label, value: avg };
  });

  const metricLabel = metricId
    ? metrics.find((m) => m.id === metricId)?.name || 'Metric'
    : 'All metrics';

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-medium text-slate-500">
        Monthly average — {metricLabel}
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
          <YAxis domain={[0, 10]} tick={{ fontSize: 10 }} />
          <Tooltip
            formatter={(value) => [Number(value).toFixed(1), 'Avg']}
            contentStyle={{ fontSize: 12 }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
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
