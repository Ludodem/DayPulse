import type { Metric } from '../types';
import ScoreSlider from './ScoreSlider';

interface DayInputProps {
  date: string;
  metrics: Metric[];
  getScore: (date: string, metricId: string) => number | null;
  setScore: (date: string, metricId: string, value: number) => void;
}

export default function DayInput({ date, metrics, getScore, setScore }: DayInputProps) {
  if (metrics.length === 0) {
    return (
      <p className="text-slate-400 text-center py-8">
        No metrics configured. Go to Settings to add some.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {metrics.map((metric) => (
        <ScoreSlider
          key={metric.id}
          label={metric.name}
          emoji={metric.emoji}
          value={getScore(date, metric.id)}
          onChange={(v) => setScore(date, metric.id, v)}
        />
      ))}
    </div>
  );
}
