'use client';

import { useState, useCallback } from 'react';
import { useStyleStore } from '@/stores';
import { showToast } from '@/components/ui/Toast';
import type { ColorPreset } from '@/types/style';

/** Standard design system color roles */
const COLOR_ROLES = [
  { role: 'Primary', desc: 'Main brand / action color' },
  { role: 'Secondary', desc: 'Supporting accent' },
  { role: 'Accent', desc: 'Highlight / emphasis' },
  { role: 'Neutral', desc: 'Text / borders / background' },
  { role: 'Success', desc: 'Positive feedback' },
  { role: 'Warning', desc: 'Caution indicator' },
  { role: 'Error', desc: 'Error / destructive' },
] as const;

/** Built-in palette sets — each fills all 7 roles at once */
const PALETTE_SETS: { name: string; colors: Record<string, string> }[] = [
  {
    name: 'Ocean',
    colors: {
      Primary: '#0066cc',
      Secondary: '#4d94ff',
      Accent: '#00b4d8',
      Neutral: '#475569',
      Success: '#10b981',
      Warning: '#f59e0b',
      Error: '#ef4444',
    },
  },
  {
    name: 'Forest',
    colors: {
      Primary: '#166534',
      Secondary: '#4ade80',
      Accent: '#a3e635',
      Neutral: '#44403c',
      Success: '#22c55e',
      Warning: '#eab308',
      Error: '#dc2626',
    },
  },
  {
    name: 'Sunset',
    colors: {
      Primary: '#dc2626',
      Secondary: '#f97316',
      Accent: '#fbbf24',
      Neutral: '#57534e',
      Success: '#16a34a',
      Warning: '#ea580c',
      Error: '#be123c',
    },
  },
  {
    name: 'Midnight',
    colors: {
      Primary: '#6366f1',
      Secondary: '#8b5cf6',
      Accent: '#c084fc',
      Neutral: '#94a3b8',
      Success: '#34d399',
      Warning: '#fbbf24',
      Error: '#f87171',
    },
  },
  {
    name: 'Monochrome',
    colors: {
      Primary: '#171717',
      Secondary: '#404040',
      Accent: '#737373',
      Neutral: '#a3a3a3',
      Success: '#22c55e',
      Warning: '#eab308',
      Error: '#ef4444',
    },
  },
];

export function ColorPresetEditor() {
  const colorPresets = useStyleStore((state) => state.colorPresets);
  const addColorPreset = useStyleStore((state) => state.addColorPreset);
  const removeColorPreset = useStyleStore((state) => state.removeColorPreset);
  const updateColorPreset = useStyleStore((state) => state.updateColorPreset);

  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('#3b82f6');
  const [confirmDeleteName, setConfirmDeleteName] = useState<string | null>(null);

  // Apply a full palette set — replaces existing role slots, keeps custom extras
  const applyPaletteSet = useCallback((paletteColors: Record<string, string>) => {
    // Remove existing role-based presets
    const roleNames = new Set<string>(COLOR_ROLES.map((r) => r.role));
    const customOnly = colorPresets.filter((p) => !roleNames.has(p.name));

    // Build new array: roles first, then custom
    const rolePresets: ColorPreset[] = COLOR_ROLES.map((r) => ({
      name: r.role,
      color: paletteColors[r.role] || '#000000',
    }));

    // Replace all presets at once via store
    // Remove all then add back
    colorPresets.forEach((p) => removeColorPreset(p.name));
    [...rolePresets, ...customOnly].forEach((p) => addColorPreset(p));

    showToast('Palette applied.', 'success');
  }, [colorPresets, addColorPreset, removeColorPreset]);

  const handleAdd = useCallback(() => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    if (colorPresets.some((p) => p.name === trimmed)) {
      showToast('Same name already exists.', 'error');
      return;
    }
    addColorPreset({ name: trimmed, color: newColor });
    setNewName('');
    setNewColor('#3b82f6');
    setIsAdding(false);
    showToast('Color added.', 'success');
  }, [newName, newColor, colorPresets, addColorPreset]);

  const handleAddKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd();
    if (e.key === 'Escape') { setIsAdding(false); setNewName(''); }
  };

  const handleDelete = (name: string) => {
    if (confirmDeleteName === name) {
      removeColorPreset(name);
      setConfirmDeleteName(null);
      showToast('Color removed.', 'success');
    } else {
      setConfirmDeleteName(name);
      setTimeout(() => setConfirmDeleteName(null), 3000);
    }
  };

  // Separate role-based presets from custom extras
  const roleNames = new Set<string>(COLOR_ROLES.map((r) => r.role));
  const rolePresets = COLOR_ROLES.map((r) => ({
    ...r,
    preset: colorPresets.find((p) => p.name === r.role),
  }));
  const customPresets = colorPresets.filter((p) => !roleNames.has(p.name));

  // Check which palette set is currently active
  const activePalette = PALETTE_SETS.find((ps) =>
    COLOR_ROLES.every((r) => {
      const preset = colorPresets.find((p) => p.name === r.role);
      return preset && preset.color === ps.colors[r.role];
    })
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Palette Sets */}
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-medium border-b border-[var(--ui-border)] pb-2">Palette</h3>
        <div className="grid grid-cols-1 gap-2">
          {PALETTE_SETS.map((ps) => {
            const isActive = activePalette?.name === ps.name;
            return (
              <button
                key={ps.name}
                onClick={() => applyPaletteSet(ps.colors)}
                className={`flex items-center justify-between rounded-lg border p-3 text-left transition-colors ${
                  isActive
                    ? 'border-[var(--printmd-link-color)] bg-[var(--ui-bg-hover)]'
                    : 'border-[var(--ui-border)] hover:border-[var(--ui-border-hover)] hover:bg-[var(--ui-bg-hover)]'
                }`}
              >
                <span className="text-sm font-medium">{ps.name}</span>
                <div className="flex gap-1">
                  {COLOR_ROLES.map((r) => (
                    <span
                      key={r.role}
                      className="h-5 w-5 rounded-full border border-[var(--ui-border)]"
                      style={{ backgroundColor: ps.colors[r.role] }}
                      title={r.role}
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <hr className="border-[var(--ui-border)]" />

      {/* Role Slots */}
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-medium border-b border-[var(--ui-border)] pb-2">Color Roles</h3>
        <div className="flex flex-col gap-1.5">
          {rolePresets.map(({ role, desc, preset }) => (
            <div
              key={role}
              className="flex items-center gap-2 rounded-lg border border-[var(--ui-border)] px-3 py-2"
            >
              {/* Color picker */}
              <input
                type="color"
                value={preset?.color || '#cccccc'}
                onChange={(e) => {
                  if (preset) {
                    updateColorPreset(role, { color: e.target.value });
                  } else {
                    addColorPreset({ name: role, color: e.target.value });
                  }
                }}
                className="h-7 w-7 cursor-pointer rounded border border-[var(--ui-border)] bg-transparent p-0.5 shrink-0"
              />

              {/* Role name + desc */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{role}</div>
                <div className="text-[10px] text-[var(--ui-text-muted)] truncate">{desc}</div>
              </div>

              {/* Hex */}
              <span className="text-xs font-mono text-[var(--ui-text-muted)] shrink-0">
                {preset?.color || '—'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <hr className="border-[var(--ui-border)]" />

      {/* Custom Extras */}
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-medium border-b border-[var(--ui-border)] pb-2">Custom Colors</h3>

        {customPresets.length > 0 && (
          <div className="flex flex-col gap-1.5">
            {customPresets.map((preset) => (
              <div
                key={preset.name}
                className="flex items-center gap-2 rounded-lg border border-[var(--ui-border)] px-3 py-2"
              >
                <input
                  type="color"
                  value={preset.color}
                  onChange={(e) => updateColorPreset(preset.name, { color: e.target.value })}
                  className="h-7 w-7 cursor-pointer rounded border border-[var(--ui-border)] bg-transparent p-0.5 shrink-0"
                />
                <span className="flex-1 text-sm truncate">{preset.name}</span>
                <span className="text-xs font-mono text-[var(--ui-text-muted)] shrink-0">
                  {preset.color}
                </span>
                <button
                  onClick={() => handleDelete(preset.name)}
                  className={`shrink-0 rounded px-2 py-1 text-xs ${
                    confirmDeleteName === preset.name
                      ? 'bg-red-50 text-red-600 border border-red-300'
                      : 'text-[var(--ui-text-muted)] hover:text-red-500'
                  }`}
                >
                  {confirmDeleteName === preset.name ? 'Confirm?' : 'Delete'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add custom */}
        {isAdding ? (
          <div className="flex items-center gap-2 rounded-lg border border-[var(--ui-border)] p-3">
            <input
              type="color"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              className="h-7 w-7 cursor-pointer rounded border border-[var(--ui-border)] bg-transparent p-0.5 shrink-0"
            />
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={handleAddKeyDown}
              placeholder="Color name"
              className="flex-1 rounded border border-[var(--ui-border)] bg-transparent px-2 py-1.5 text-sm outline-none focus:border-[var(--printmd-link-color)]"
              autoFocus
            />
            <button
              onClick={handleAdd}
              disabled={!newName.trim()}
              className="rounded bg-[var(--foreground)] px-3 py-1.5 text-sm text-[var(--background)] disabled:opacity-40"
            >
              Add
            </button>
            <button
              onClick={() => { setIsAdding(false); setNewName(''); }}
              className="rounded border border-[var(--ui-border)] px-3 py-1.5 text-sm hover:bg-[var(--ui-bg-hover)]"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-[var(--ui-border)] p-3 text-sm text-[var(--ui-text-muted)] transition-colors hover:border-[var(--ui-border-hover)] hover:bg-[var(--ui-bg-hover)]"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Custom Color
          </button>
        )}
      </div>
    </div>
  );
}

export default ColorPresetEditor;
