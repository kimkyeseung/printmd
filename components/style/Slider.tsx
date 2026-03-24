'use client';

interface SliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
}

export function Slider({ label, value, onChange, min, max, step = 1, unit = '' }: SliderProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <label className="text-sm text-[var(--ui-text-muted)]">{label}</label>
        <span className="text-xs font-mono text-[var(--ui-text-muted)]">
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="w-full accent-[var(--printmd-link-color)]"
      />
    </div>
  );
}

export default Slider;
