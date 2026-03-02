'use client';

import { useCallback, useEffect, useState } from 'react';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (/^#[0-9A-Fa-f]{6}$/.test(newValue)) {
      onChange(newValue);
    }
  }, [onChange]);

  const handleColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
  }, [onChange]);

  return (
    <div className="flex items-center justify-between gap-2">
      <label className="text-sm text-[var(--ui-text-muted)]">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          className="w-20 rounded border border-[var(--ui-border)] bg-transparent px-2 py-1 text-xs font-mono"
          placeholder="#000000"
        />
        <input
          type="color"
          value={value}
          onChange={handleColorChange}
          className="h-7 w-7 cursor-pointer rounded border border-[var(--ui-border)] bg-transparent p-0.5"
        />
      </div>
    </div>
  );
}

export default ColorPicker;
