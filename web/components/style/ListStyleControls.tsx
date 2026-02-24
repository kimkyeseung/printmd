'use client';

import { useState } from 'react';
import { ColorPicker } from './ColorPicker';
import type { ListStyles, ItemStyle } from '@/types/style';

interface ListStyleControlsProps {
  styles: ListStyles;
  onChange: (styles: Partial<ListStyles>) => void;
}

type ListPosition = 'firstChild' | 'lastChild' | 'oddChild' | 'evenChild';

const POSITIONS: { key: ListPosition; label: string }[] = [
  { key: 'firstChild', label: 'First Item' },
  { key: 'lastChild', label: 'Last Item' },
  { key: 'oddChild', label: 'Odd Items' },
  { key: 'evenChild', label: 'Even Items' },
];

export function ListStyleControls({ styles, onChange }: ListStyleControlsProps) {
  const [activePosition, setActivePosition] = useState<ListPosition | null>(null);

  const handleItemStyleChange = (position: ListPosition, itemStyle: Partial<ItemStyle>) => {
    const current = styles[position] || {};
    onChange({ [position]: { ...current, ...itemStyle } });
  };

  const clearItemStyle = (position: ListPosition) => {
    onChange({ [position]: undefined });
  };

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-medium border-b border-[var(--ui-border)] pb-2">
        List Item Styles
        <span className="ml-2 text-xs text-[var(--ui-text-muted)]">(Advanced)</span>
      </h3>

      {/* Prefix/Suffix */}
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-[var(--ui-text-muted)]">Prefix</label>
          <input
            type="text"
            value={styles.prefix || ''}
            onChange={(e) => onChange({ prefix: e.target.value || undefined })}
            placeholder="e.g. ✓"
            className="rounded border border-[var(--ui-border)] bg-transparent px-2 py-1 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-[var(--ui-text-muted)]">Suffix</label>
          <input
            type="text"
            value={styles.suffix || ''}
            onChange={(e) => onChange({ suffix: e.target.value || undefined })}
            placeholder="e.g. →"
            className="rounded border border-[var(--ui-border)] bg-transparent px-2 py-1 text-sm"
          />
        </div>
      </div>

      {/* Position-based styles */}
      <div className="flex flex-col gap-2">
        <label className="text-xs text-[var(--ui-text-muted)]">Position Styles</label>
        <div className="flex flex-wrap gap-1">
          {POSITIONS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActivePosition(activePosition === key ? null : key)}
              className={`rounded px-2 py-1 text-xs ${
                activePosition === key
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
      </div>

      {/* Active position controls */}
      {activePosition && (
        <div className="rounded border border-[var(--ui-border)] p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">
              {POSITIONS.find(p => p.key === activePosition)?.label}
            </span>
            <button
              onClick={() => clearItemStyle(activePosition)}
              className="text-xs text-[var(--ui-text-muted)] hover:text-red-500"
            >
              Clear
            </button>
          </div>

          <ColorPicker
            label="Text Color"
            value={styles[activePosition]?.color || '#000000'}
            onChange={(color) => handleItemStyleChange(activePosition, { color })}
          />

          <ColorPicker
            label="Background"
            value={styles[activePosition]?.backgroundColor || '#ffffff'}
            onChange={(backgroundColor) => handleItemStyleChange(activePosition, { backgroundColor })}
          />

          <div className="flex flex-col gap-1">
            <label className="text-xs text-[var(--ui-text-muted)]">Font Weight</label>
            <select
              value={styles[activePosition]?.fontWeight || 'normal'}
              onChange={(e) => handleItemStyleChange(activePosition, {
                fontWeight: e.target.value === 'normal' ? undefined : e.target.value
              })}
              className="rounded border border-[var(--ui-border)] bg-transparent px-2 py-1 text-sm"
            >
              <option value="normal">Normal</option>
              <option value="500">Medium</option>
              <option value="600">Semibold</option>
              <option value="700">Bold</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListStyleControls;
