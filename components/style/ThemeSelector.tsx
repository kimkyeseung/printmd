'use client';

import { useState, useRef, useCallback } from 'react';
import type { ThemePreset, CustomTheme, ElementStyles, GlobalStyles } from '@/types/style';
import { THEME_NAMES, THEME_DESCRIPTIONS } from '@/types/theme';
import { themePresets } from '@/stores/styleStore';
import { themeElementStyles } from '@/lib/themes/presets';
import { showToast } from '@/components/ui/Toast';
import { useStyleStore } from '@/stores/styleStore';
import { buildShareUrl } from '@/lib/share/presetUrl';

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

const themes: ThemePreset[] = [
  'default', 'dark', 'document', 'blog', 'minimal',
  'sepia', 'ocean', 'forest', 'sunset', 'newspaper',
  'academic', 'notebook', 'terminal', 'elegant', 'pastel',
];

function ColorSwatches({ globalStyles, headingColor }: { globalStyles: GlobalStyles; headingColor?: string }) {
  const colors = [
    { color: globalStyles.backgroundColor, label: 'BG' },
    { color: globalStyles.textColor, label: 'Text' },
    { color: headingColor || globalStyles.textColor, label: 'Heading' },
    { color: globalStyles.linkColor, label: 'Link' },
  ];
  return (
    <div className="flex items-center gap-1.5">
      {colors.map(({ color, label }) => (
        <div key={label} className="flex flex-col items-center gap-0.5">
          <span
            className="h-5 w-5 shrink-0 rounded-full border border-[var(--ui-border)]"
            style={{ backgroundColor: color }}
            title={`${label}: ${color}`}
          />
          <span className="text-[10px] text-[var(--ui-text-muted)]">{label}</span>
        </div>
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
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const globalStyles = useStyleStore((s) => s.globalStyles);
  const listStyles = useStyleStore((s) => s.listStyles);
  const headingStyles = useStyleStore((s) => s.headingStyles);

  const hasModifiedStyles = (() => {
    const presetEs = themeElementStyles[currentTheme] || {};
    return JSON.stringify(elementStyles) !== JSON.stringify(presetEs);
  })();

  const handleShare = async () => {
    try {
      const url = buildShareUrl(globalStyles, elementStyles, listStyles, headingStyles);
      await navigator.clipboard.writeText(url);
      showToast('Link copied!', 'success');
    } catch {
      showToast('Failed to copy link.', 'error');
    }
  };

  const handleSave = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    onSaveCustom(trimmed);
    setNewName('');
    setIsAdding(false);
    showToast('프리셋이 저장되었습니다.', 'success');
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
      showToast('이름이 변경되었습니다.', 'success');
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

  const handleDelete = (id: string) => {
    if (confirmDeleteId === id) {
      onDeleteCustom(id);
      setConfirmDeleteId(null);
      showToast('프리셋이 삭제되었습니다.', 'success');
    } else {
      setConfirmDeleteId(id);
      setTimeout(() => setConfirmDeleteId(null), 3000);
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
    showToast('프리셋을 내보냈습니다.', 'success');
  };

  const handleLoad = (id: string) => {
    onLoadCustom(id);
    showToast('프리셋을 불러왔습니다.', 'success');
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
            showToast('유효하지 않은 프리셋 파일입니다.', 'error');
            return;
          }
          onImportCustom(parsed as CustomTheme);
          showToast('프리셋을 가져왔습니다.', 'success');
        } catch {
          showToast('JSON 파일을 읽을 수 없습니다.', 'error');
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
                    {isActive && hasModifiedStyles && (
                      <span className="ml-1.5 inline-block rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
                        Modified
                      </span>
                    )}
                  </span>
                  <span className="text-xs text-[var(--ui-text-muted)]">
                    {THEME_DESCRIPTIONS[theme]}
                  </span>
                </div>
                <ColorSwatches globalStyles={themePresets[theme]} headingColor={themeElementStyles[theme]?.h1?.color} />
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
                className="flex flex-col gap-2 rounded-lg border border-[var(--ui-border)] p-3 transition-colors hover:border-[var(--ui-border-hover)]"
              >
                {/* Row 1: Name + Swatches */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {editingId === theme.id ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={handleRenameKeyDown}
                        onBlur={handleRenameConfirm}
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 rounded border border-[var(--printmd-link-color)] bg-transparent px-2 py-1 text-sm outline-none"
                        autoFocus
                      />
                    ) : (
                      <>
                        <span className="text-sm font-medium truncate">{theme.name}</span>
                        <button
                          onClick={() => handleRenameStart(theme)}
                          className="shrink-0 rounded p-1 text-[var(--ui-text-muted)] hover:bg-[var(--ui-bg-hover)] hover:text-[var(--foreground)]"
                          aria-label={`${theme.name} 이름 변경`}
                          title="이름 변경"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[var(--ui-text-muted)]">{formatDate(theme.createdAt)}</span>
                    <ColorSwatches globalStyles={theme.globalStyles} headingColor={theme.elementStyles?.h1?.color} />
                  </div>
                </div>

                {/* Row 2: Action buttons */}
                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleLoad(theme.id)}
                    className="flex-1 rounded border border-[var(--ui-border)] px-2 py-1.5 text-xs hover:bg-[var(--ui-bg-hover)]"
                  >
                    Load
                  </button>
                  <button
                    onClick={() => handleExport(theme)}
                    className="flex-1 rounded border border-[var(--ui-border)] px-2 py-1.5 text-xs hover:bg-[var(--ui-bg-hover)]"
                  >
                    Export
                  </button>
                  <button
                    onClick={() => handleDelete(theme.id)}
                    className={`flex-1 rounded border px-2 py-1.5 text-xs ${
                      confirmDeleteId === theme.id
                        ? 'border-red-300 bg-red-50 text-red-600'
                        : 'border-[var(--ui-border)] hover:bg-[var(--ui-bg-hover)] hover:text-red-500'
                    }`}
                  >
                    {confirmDeleteId === theme.id ? 'Confirm?' : 'Delete'}
                  </button>
                </div>
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
              className="flex items-center gap-1.5 rounded-lg border border-dashed border-[var(--ui-border)] px-3 py-3 text-sm text-[var(--ui-text-muted)] transition-colors hover:border-[var(--ui-border-hover)] hover:bg-[var(--ui-bg-hover)]"
              title="Import Preset (.json)"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Import
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 rounded-lg border border-dashed border-[var(--ui-border)] px-3 py-3 text-sm text-[var(--ui-text-muted)] transition-colors hover:border-[var(--ui-border-hover)] hover:bg-[var(--ui-bg-hover)]"
              title="Share current style as URL"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
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
