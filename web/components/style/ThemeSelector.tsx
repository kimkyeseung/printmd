'use client';

import { useState } from 'react';
import type { ThemePreset, CustomTheme } from '@/types/style';
import { THEME_NAMES, THEME_DESCRIPTIONS } from '@/types/theme';

interface ThemeSelectorProps {
  currentTheme: ThemePreset;
  onSelect: (theme: ThemePreset) => void;
  customThemes: CustomTheme[];
  onLoadCustom: (id: string) => void;
  onDeleteCustom: (id: string) => void;
  onSaveCustom: (name: string) => void;
}

const themes: ThemePreset[] = ['default', 'dark', 'document', 'blog', 'minimal'];

export function ThemeSelector({
  currentTheme,
  onSelect,
  customThemes,
  onLoadCustom,
  onDeleteCustom,
  onSaveCustom,
}: ThemeSelectorProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');

  const handleSave = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    onSaveCustom(trimmed);
    setNewName('');
    setIsAdding(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setIsAdding(false);
      setNewName('');
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Built-in presets */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Theme Preset</label>
        <div className="grid grid-cols-1 gap-2">
          {themes.map((theme) => (
            <button
              key={theme}
              onClick={() => onSelect(theme)}
              className={`flex flex-col items-start rounded-lg border p-3 text-left transition-colors ${
                currentTheme === theme
                  ? 'border-[var(--printmd-link-color)] bg-[var(--ui-bg-hover)]'
                  : 'border-[var(--ui-border)] hover:border-[var(--ui-border-hover)] hover:bg-[var(--ui-bg-hover)]'
              }`}
            >
              <span className="text-sm font-medium">{THEME_NAMES[theme]}</span>
              <span className="text-xs text-[var(--ui-text-muted)]">
                {THEME_DESCRIPTIONS[theme]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <hr className="border-[var(--ui-border)]" />

      {/* Custom presets */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Custom Preset</label>

        {customThemes.length > 0 && (
          <div className="grid grid-cols-1 gap-2">
            {customThemes.map((theme) => (
              <div
                key={theme.id}
                className="flex items-center gap-2 rounded-lg border border-[var(--ui-border)] p-3 transition-colors hover:border-[var(--ui-border-hover)] hover:bg-[var(--ui-bg-hover)]"
              >
                <button
                  onClick={() => onLoadCustom(theme.id)}
                  className="flex flex-1 flex-col items-start text-left"
                >
                  <span className="text-sm font-medium">{theme.name}</span>
                  <span className="text-xs text-[var(--ui-text-muted)]">
                    {formatDate(theme.createdAt)}
                  </span>
                </button>
                <button
                  onClick={() => onDeleteCustom(theme.id)}
                  className="shrink-0 rounded p-1 text-[var(--ui-text-muted)] hover:bg-[var(--ui-bg-hover)] hover:text-red-500"
                  aria-label={`${theme.name} 삭제`}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {isAdding ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="프리셋 이름"
              className="flex-1 rounded border border-[var(--ui-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--printmd-link-color)]"
              autoFocus
            />
            <button
              onClick={handleSave}
              disabled={!newName.trim()}
              className="rounded bg-[var(--foreground)] px-3 py-2 text-sm text-[var(--background)] disabled:opacity-40"
            >
              Save
            </button>
            <button
              onClick={() => { setIsAdding(false); setNewName(''); }}
              className="rounded border border-[var(--ui-border)] px-3 py-2 text-sm hover:bg-[var(--ui-bg-hover)]"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center justify-center gap-1 rounded-lg border border-dashed border-[var(--ui-border)] p-3 text-sm text-[var(--ui-text-muted)] transition-colors hover:border-[var(--ui-border-hover)] hover:bg-[var(--ui-bg-hover)]"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Save Current Style
          </button>
        )}
      </div>
    </div>
  );
}

export default ThemeSelector;
