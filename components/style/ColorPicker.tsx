'use client';

import { useCallback, useEffect, useState, useRef } from 'react';
import { RgbaColorPicker } from 'react-colorful';
import { useStyleStore } from '@/stores';
import { COLOR_ROLES, getRoleColor } from '@/lib/themes/colorRoles';

interface RgbaColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

/** Parse any CSS color string into RgbaColor */
function parseToRgba(color: string): RgbaColor {
  const rgbaMatch = color.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)$/);
  if (rgbaMatch) {
    return {
      r: parseInt(rgbaMatch[1]),
      g: parseInt(rgbaMatch[2]),
      b: parseInt(rgbaMatch[3]),
      a: rgbaMatch[4] !== undefined ? parseFloat(rgbaMatch[4]) : 1,
    };
  }
  let hex = color;
  if (/^#[0-9A-Fa-f]{3}$/.test(hex)) {
    hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  }
  if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
    return {
      r: parseInt(hex.slice(1, 3), 16),
      g: parseInt(hex.slice(3, 5), 16),
      b: parseInt(hex.slice(5, 7), 16),
      a: 1,
    };
  }
  return { r: 0, g: 0, b: 0, a: 1 };
}

/** Convert RgbaColor to CSS string */
function rgbaToCss(c: RgbaColor): string {
  if (c.a >= 1) {
    return `#${c.r.toString(16).padStart(2, '0')}${c.g.toString(16).padStart(2, '0')}${c.b.toString(16).padStart(2, '0')}`;
  }
  return `rgba(${c.r},${c.g},${c.b},${c.a})`;
}

/** Format display string */
function formatDisplay(c: RgbaColor): string {
  if (c.a >= 1) {
    return `#${c.r.toString(16).padStart(2, '0')}${c.g.toString(16).padStart(2, '0')}${c.b.toString(16).padStart(2, '0')}`;
  }
  return `rgba(${c.r},${c.g},${c.b},${parseFloat(c.a.toFixed(2))})`;
}

export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const colorPresets = useStyleStore((state) => state.colorPresets);
  const globalStyles = useStyleStore((state) => state.globalStyles);
  const elementStyles = useStyleStore((state) => state.elementStyles);

  const rgba = parseToRgba(value);

  useEffect(() => {
    setInputValue(formatDisplay(parseToRgba(value)));
  }, [value]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handlePickerChange = useCallback((c: RgbaColor) => {
    const css = rgbaToCss(c);
    setInputValue(formatDisplay(c));
    onChange(css);
  }, [onChange]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setInputValue(v);
    if (/^#[0-9A-Fa-f]{6}$/.test(v) || /^#[0-9A-Fa-f]{3}$/.test(v) || /^rgba?\(/.test(v)) {
      const parsed = parseToRgba(v);
      if (parsed.r || parsed.g || parsed.b || parsed.a < 1 || v.includes('0,0,0')) {
        onChange(rgbaToCss(parsed));
      }
    }
  }, [onChange]);

  const handleInputBlur = useCallback(() => {
    setInputValue(formatDisplay(rgba));
  }, [rgba]);

  const handleSwatchSelect = useCallback((color: string) => {
    const parsed = parseToRgba(color);
    setInputValue(formatDisplay(parsed));
    onChange(rgbaToCss(parsed));
  }, [onChange]);

  // Build role swatches from current styles
  const roleSwatches = COLOR_ROLES.map((r) => ({
    name: r.role,
    color: getRoleColor(r, globalStyles, elementStyles),
  }));

  // Custom presets (non-role)
  const roleNameSet = new Set(COLOR_ROLES.map((r) => r.role));
  const customSwatches = colorPresets.filter((p) => !roleNameSet.has(p.name));

  return (
    <div className="flex flex-col gap-1" ref={wrapperRef}>
      <div className="flex items-center justify-between gap-2">
        <label className="text-sm text-[var(--ui-text-muted)]">{label}</label>
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className="w-28 rounded border border-[var(--ui-border)] bg-transparent px-2 py-1 text-xs font-mono"
          />
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="h-7 w-7 shrink-0 cursor-pointer rounded border border-[var(--ui-border)] p-0.5"
            style={{ backgroundColor: value }}
            aria-label="Open color picker"
          />
        </div>
      </div>

      {open && (
        <div className="rounded-lg border border-[var(--ui-border)] bg-[var(--background)] p-3 shadow-lg flex flex-col gap-3">
          {/* react-colorful picker */}
          <RgbaColorPicker
            color={rgba}
            onChange={handlePickerChange}
            style={{ width: '100%', height: 150 }}
          />

          {/* Role swatches */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-medium text-[var(--ui-text-muted)] uppercase">Color Roles</span>
            <div className="flex flex-wrap gap-1">
              {roleSwatches.map((s) => {
                const isActive = rgbaToCss(rgba).toLowerCase() === rgbaToCss(parseToRgba(s.color)).toLowerCase();
                return (
                  <button
                    key={s.name}
                    type="button"
                    onClick={() => handleSwatchSelect(s.color)}
                    className={`flex items-center gap-1 rounded border px-1.5 py-1 text-[10px] transition-colors ${
                      isActive
                        ? 'border-[var(--printmd-link-color)] font-medium'
                        : 'border-[var(--ui-border)] hover:border-[var(--ui-border-hover)]'
                    }`}
                    title={s.color}
                  >
                    <span
                      className="h-3 w-3 shrink-0 rounded-sm border border-[var(--ui-border)]"
                      style={{ backgroundColor: s.color }}
                    />
                    {s.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom preset swatches */}
          {customSwatches.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-medium text-[var(--ui-text-muted)] uppercase">Custom</span>
              <div className="flex flex-wrap gap-1">
                {customSwatches.map((s) => (
                  <button
                    key={s.name}
                    type="button"
                    onClick={() => handleSwatchSelect(s.color)}
                    className="flex items-center gap-1 rounded border border-[var(--ui-border)] px-1.5 py-1 text-[10px] hover:border-[var(--ui-border-hover)]"
                    title={s.color}
                  >
                    <span
                      className="h-3 w-3 shrink-0 rounded-sm border border-[var(--ui-border)]"
                      style={{ backgroundColor: s.color }}
                    />
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ColorPicker;
