'use client';

import { useState } from 'react';
import { ColorPicker } from './ColorPicker';
import { Slider } from './Slider';
import type { HeadingStyles, HeadingStyle } from '@/types/style';

interface HeadingStyleControlsProps {
  styles: HeadingStyles;
  onChange: (styles: Partial<HeadingStyles>) => void;
}

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

const HEADINGS: { key: HeadingLevel; label: string; defaultSize: number }[] = [
  { key: 'h1', label: 'H1', defaultSize: 32 },
  { key: 'h2', label: 'H2', defaultSize: 24 },
  { key: 'h3', label: 'H3', defaultSize: 20 },
  { key: 'h4', label: 'H4', defaultSize: 16 },
  { key: 'h5', label: 'H5', defaultSize: 14 },
  { key: 'h6', label: 'H6', defaultSize: 13 },
];

export function HeadingStyleControls({ styles, onChange }: HeadingStyleControlsProps) {
  const [activeHeading, setActiveHeading] = useState<HeadingLevel | null>(null);

  const handleHeadingStyleChange = (level: HeadingLevel, style: Partial<HeadingStyle>) => {
    const current = styles[level] || {};
    onChange({ [level]: { ...current, ...style } });
  };

  const clearHeadingStyle = (level: HeadingLevel) => {
    onChange({ [level]: undefined });
  };

  const activeConfig = HEADINGS.find(h => h.key === activeHeading);

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-medium border-b border-[var(--ui-border)] pb-2">
        Heading Styles
        <span className="ml-2 text-xs text-[var(--ui-text-muted)]">(Advanced)</span>
      </h3>

      {/* Heading selector */}
      <div className="flex flex-wrap gap-1">
        {HEADINGS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveHeading(activeHeading === key ? null : key)}
            className={`rounded px-3 py-1 text-xs font-medium ${
              activeHeading === key
                ? 'bg-[var(--printmd-link-color)] text-white'
                : styles[key]
                ? 'bg-[var(--ui-bg-hover)] border border-[var(--printmd-link-color)]'
                : 'bg-[var(--ui-bg-secondary)] hover:bg-[var(--ui-bg-hover)]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Active heading controls */}
      {activeHeading && activeConfig && (
        <div className="rounded border border-[var(--ui-border)] p-3 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">{activeConfig.label} Settings</span>
            <button
              onClick={() => clearHeadingStyle(activeHeading)}
              className="text-xs text-[var(--ui-text-muted)] hover:text-red-500"
            >
              Reset
            </button>
          </div>

          <Slider
            label="Font Size"
            value={styles[activeHeading]?.fontSize || activeConfig.defaultSize}
            onChange={(fontSize) => handleHeadingStyleChange(activeHeading, { fontSize })}
            min={10}
            max={48}
            unit="px"
          />

          <div className="flex flex-col gap-1">
            <label className="text-xs text-[var(--ui-text-muted)]">Font Weight</label>
            <select
              value={styles[activeHeading]?.fontWeight || '600'}
              onChange={(e) => handleHeadingStyleChange(activeHeading, { fontWeight: e.target.value })}
              className="rounded border border-[var(--ui-border)] bg-transparent px-2 py-1 text-sm"
            >
              <option value="400">Normal</option>
              <option value="500">Medium</option>
              <option value="600">Semibold</option>
              <option value="700">Bold</option>
              <option value="800">Extra Bold</option>
            </select>
          </div>

          <ColorPicker
            label="Color"
            value={styles[activeHeading]?.color || '#000000'}
            onChange={(color) => handleHeadingStyleChange(activeHeading, { color })}
          />

          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[var(--ui-text-muted)]">Margin Top</label>
              <input
                type="number"
                value={styles[activeHeading]?.marginTop ?? 24}
                onChange={(e) => handleHeadingStyleChange(activeHeading, { marginTop: Number(e.target.value) })}
                className="rounded border border-[var(--ui-border)] bg-transparent px-2 py-1 text-sm"
                min={0}
                max={100}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[var(--ui-text-muted)]">Margin Bottom</label>
              <input
                type="number"
                value={styles[activeHeading]?.marginBottom ?? 8}
                onChange={(e) => handleHeadingStyleChange(activeHeading, { marginBottom: Number(e.target.value) })}
                className="rounded border border-[var(--ui-border)] bg-transparent px-2 py-1 text-sm"
                min={0}
                max={100}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HeadingStyleControls;
