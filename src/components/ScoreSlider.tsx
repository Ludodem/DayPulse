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
          className="text-lg font-bold min-w-[2ch] text-center rounded px-2 py-0.5"
          style={value !== null ? { backgroundColor: scoreToColor(value), color: '#fff' } : undefined}
        >
          {value !== null ? value : '–'}
        </span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: 11 }, (_, i) => (
          <button
            key={i}
            onClick={() => onChange(i)}
            className="flex-1 h-9 rounded text-xs font-semibold transition-all cursor-pointer border-2"
            style={{
              backgroundColor: value === i ? scoreToColor(i) : undefined,
              color: value === i ? '#fff' : undefined,
              borderColor: value === i ? scoreToColor(i) : 'transparent',
              opacity: value !== null && value !== i ? 0.4 : 1,
            }}
          >
            {i}
          </button>
        ))}
      </div>
    </div>
  );
}
