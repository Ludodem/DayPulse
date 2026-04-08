import { scoreToColor } from '../utils/colors';

interface ScoreSliderProps {
  value: number | null;
  onChange: (value: number) => void;
  label: string;
  emoji?: string;
}

export default function ScoreSlider({ value, onChange, label, emoji }: ScoreSliderProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="font-medium text-sm">
          {emoji && <span className="mr-1">{emoji}</span>}
          {label}
        </span>
        <span
          className="text-2xl font-bold min-w-[2.5ch] text-center rounded-lg px-3 py-1"
          style={value !== null ? { backgroundColor: scoreToColor(value), color: '#fff' } : undefined}
        >
          {value !== null ? value : '–'}
        </span>
      </div>
      <div className="grid grid-cols-5 gap-1.5 md:grid-cols-10 md:gap-1">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className="h-11 md:h-9 rounded-lg text-sm md:text-xs font-semibold transition-all cursor-pointer border-2"
            style={{
              backgroundColor: value === n ? scoreToColor(n) : undefined,
              color: value === n ? '#fff' : undefined,
              borderColor: value === n ? scoreToColor(n) : 'transparent',
              opacity: value !== null && value !== n ? 0.4 : 1,
            }}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}
