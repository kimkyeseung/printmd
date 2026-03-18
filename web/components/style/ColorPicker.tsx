'use client';

import { useCallback, useEffect, useState, useRef } from 'react';
import { useStyleStore } from '@/stores';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  const [inputValue, setInputValue] = useState(value);
  const [showPresets, setShowPresets] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const colorPresets = useStyleStore((state) => state.colorPresets);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Close popover on outside click
  useEffect(() => {
    if (!showPresets) return;
    const handler = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setShowPresets(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showPresets]);

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

  const handlePresetSelect = useCallback((color: string) => {
    setInputValue(color);
    onChange(color);
    setShowPresets(false);
  }, [onChange]);

  return (
    <div className="flex items-center justify-between gap-2">
      <label className="text-sm text-[var(--ui-text-muted)]">{label}</label>
      <div className="relative flex items-center gap-1.5" ref={popoverRef}>
        {/* Preset toggle button */}
        {colorPresets.length > 0 && (
          <button
            type="button"
            onClick={() => setShowPresets(!showPresets)}
            className={`flex items-center gap-0.5 rounded border px-1.5 py-1 text-xs transition-colors ${
              showPresets
                ? 'border-[var(--printmd-link-color)] text-[var(--printmd-link-color)]'
                : 'border-[var(--ui-border)] text-[var(--ui-text-muted)] hover:border-[var(--ui-border-hover)]'
            }`}
            title="Color presets"
          >
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
          </button>
        )}

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

        {/* Preset popover */}
        {showPresets && colorPresets.length > 0 && (
          <div
            className="absolute right-0 top-full z-10 mt-1 rounded-lg border border-[var(--ui-border)] bg-[var(--background)] p-2 shadow-lg"
            style={{ minWidth: '200px' }}
          >
            <div className="flex flex-col gap-1">
              {colorPresets.map((preset) => {
                const isSelected = value.toLowerCase() === preset.color.toLowerCase();
                return (
                  <button
                    key={preset.name}
                    onClick={() => handlePresetSelect(preset.color)}
                    className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors ${
                      isSelected
                        ? 'bg-[var(--ui-bg-hover)] font-medium'
                        : 'hover:bg-[var(--ui-bg-hover)]'
                    }`}
                  >
                    <span
                      className={`h-5 w-5 shrink-0 rounded-md border ${
                        isSelected
                          ? 'border-[var(--printmd-link-color)] ring-1 ring-[var(--printmd-link-color)]'
                          : 'border-[var(--ui-border)]'
                      }`}
                      style={{ backgroundColor: preset.color }}
                    />
                    <span className="flex-1 truncate">{preset.name}</span>
                    <span className="font-mono text-[10px] text-[var(--ui-text-muted)]">
                      {preset.color}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ColorPicker;
