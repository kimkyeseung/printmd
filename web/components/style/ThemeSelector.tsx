'use client';

import { useState, useRef, useCallback } from 'react';
import type { ThemePreset, CustomTheme, ElementStyles, GlobalStyles } from '@/types/style';
import { THEME_NAMES, THEME_DESCRIPTIONS } from '@/types/theme';
import { themePresets } from '@/stores/styleStore';

interface ThemeSelectorProps {
  currentTheme: ThemePreset;
  onSelect: (theme: ThemePreset) => void;
  customThemes: CustomTheme[];
  onLoadCustom: (id: string) => void;
  onDeleteCustom: (id: string) => void;
  onSaveCustom: (name: string) => void;
  onRenameCustom: (id: string, name: string) => void;
  onImportCustom: (theme: CustomTheme) => void;
  elementStyles: ElementStyles;
}

const themes: ThemePreset[] = ['default', 'dark', 'document', 'blog', 'minimal'];

function ColorSwatches({ globalStyles }: { globalStyles: GlobalStyles }) {
  const colors = [
    { color: globalStyles.backgroundColor, label: 'bg' },
    { color: globalStyles.textColor, label: 'text' },
    { color: globalStyles.linkColor, label: 'link' },
  ];
  return (
    <div className="flex items-center gap-1">
      {colors.map(({ color, label }) => (
        <span
          key={label}
          className="h-4 w-4 shrink-0 rounded-full border border-[var(--ui-border)]"
          style={{ backgroundColor: color }}
          title={`${label}: ${color}`}
        />
      ))}
    </div>
  );
}

export function ThemeSelector({
  currentTheme,
  onSelect,
  customThemes,
  onLoadCustom,
  onDeleteCustom,
  onSaveCustom,
  onRenameCustom,
  onImportCustom,
  elementStyles,
}: ThemeSelectorProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasElementStyles = Object.keys(elementStyles).length > 0;

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

  const handleRenameStart = (theme: CustomTheme) => {
    setEditingId(theme.id);
    setEditName(theme.name);
  };

  const handleRenameConfirm = () => {
    if (editingId && editName.trim()) {
      onRenameCustom(editingId, editName.trim());
    }
    setEditingId(null);
    setEditName('');
  };

  const handleRenameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleRenameConfirm();
    if (e.key === 'Escape') {
      setEditingId(null);
      setEditName('');
    }
  };

  const handleExport = (theme: CustomTheme) => {
    const data = JSON.stringify(theme, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${theme.name.replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(reader.result as string);
          if (!parsed.name || !parsed.globalStyles) {
            alert('Invalid preset file.');
            return;
          }
          onImportCustom(parsed as CustomTheme);
        } catch {
          alert('Failed to parse JSON file.');
        }
      };
      reader.readAsText(file);
      e.target.value = '';
    },
    [onImportCustom]
  );

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
          {themes.map((theme) => {
            const isActive = currentTheme === theme;
            return (
              <button
                key={theme}
                onClick={() => onSelect(theme)}
                className={`flex items-center justify-between rounded-lg border p-3 text-left transition-colors ${
                  isActive
                    ? 'border-[var(--printmd-link-color)] bg-[var(--ui-bg-hover)]'
                    : 'border-[var(--ui-border)] hover:border-[var(--ui-border-hover)] hover:bg-[var(--ui-bg-hover)]'
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {THEME_NAMES[theme]}
                    {isActive && hasElementStyles && (
                      <span className="ml-1.5 inline-block rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
                        Modified
                      </span>
                    )}
                  </span>
                  <span className="text-xs text-[var(--ui-text-muted)]">
                    {THEME_DESCRIPTIONS[theme]}
                  </span>
                </div>
                <ColorSwatches globalStyles={themePresets[theme]} />
              </button>
            );
          })}
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
                  className="flex flex-1 items-center justify-between text-left"
                >
                  <div className="flex flex-col" onDoubleClick={(e) => { e.stopPropagation(); handleRenameStart(theme); }}>
                    {editingId === theme.id ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={handleRenameKeyDown}
                        onBlur={handleRenameConfirm}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded border border-[var(--printmd-link-color)] bg-transparent px-1 py-0.5 text-sm outline-none"
                        autoFocus
                      />
                    ) : (
                      <span className="text-sm font-medium">{theme.name}</span>
                    )}
                    <span className="text-xs text-[var(--ui-text-muted)]">
                      {formatDate(theme.createdAt)}
                    </span>
                  </div>
                  <ColorSwatches globalStyles={theme.globalStyles} />
                </button>
                {/* Export */}
                <button
                  onClick={() => handleExport(theme)}
                  className="shrink-0 rounded p-1 text-[var(--ui-text-muted)] hover:bg-[var(--ui-bg-hover)] hover:text-[var(--foreground)]"
                  aria-label={`${theme.name} export`}
                  title="Export JSON"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
                {/* Delete */}
                <button
                  onClick={() => onDeleteCustom(theme.id)}
                  className="shrink-0 rounded p-1 text-[var(--ui-text-muted)] hover:bg-[var(--ui-bg-hover)] hover:text-red-500"
                  aria-label={`${theme.name} delete`}
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
              placeholder="Preset name"
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
          <div className="flex gap-2">
            <button
              onClick={() => setIsAdding(true)}
              className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-dashed border-[var(--ui-border)] p-3 text-sm text-[var(--ui-text-muted)] transition-colors hover:border-[var(--ui-border-hover)] hover:bg-[var(--ui-bg-hover)]"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Save Current Style
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1 rounded-lg border border-dashed border-[var(--ui-border)] px-3 py-3 text-sm text-[var(--ui-text-muted)] transition-colors hover:border-[var(--ui-border-hover)] hover:bg-[var(--ui-bg-hover)]"
              title="Import Preset (.json)"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ThemeSelector;
