'use client';

import type { ViewMode } from '@/stores/uiStore';

interface HeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onStylePanelToggle: () => void;
  onPrintClick: () => void;
  onSaveClick: () => void;
  onLoadClick: () => void;
}

export function Header({
  viewMode,
  onViewModeChange,
  onStylePanelToggle,
  onPrintClick,
  onSaveClick,
  onLoadClick,
}: HeaderProps) {
  return (
    <header className="flex h-11 items-center justify-between border-b border-[var(--ui-border)] px-4">
      {/* Logo */}
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold">printmd</h1>

        {/* View mode toggle */}
        <div className="flex items-center rounded-md border border-[var(--ui-border)] p-0.5">
          <button
            onClick={() => onViewModeChange('editor')}
            className={`rounded px-2 py-1 text-xs ${
              viewMode === 'editor'
                ? 'bg-[var(--ui-bg-hover)]'
                : 'hover:bg-[var(--ui-bg-hover)]'
            }`}
          >
            Editor
          </button>
          <button
            onClick={() => onViewModeChange('split')}
            className={`rounded px-2 py-1 text-xs ${
              viewMode === 'split'
                ? 'bg-[var(--ui-bg-hover)]'
                : 'hover:bg-[var(--ui-bg-hover)]'
            }`}
          >
            Split
          </button>
          <button
            onClick={() => onViewModeChange('preview')}
            className={`rounded px-2 py-1 text-xs ${
              viewMode === 'preview'
                ? 'bg-[var(--ui-bg-hover)]'
                : 'hover:bg-[var(--ui-bg-hover)]'
            }`}
          >
            Preview
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <button
          onClick={onLoadClick}
          className="rounded px-3 py-1.5 text-sm hover:bg-[var(--ui-bg-hover)]"
          title="Open file"
        >
          Open
        </button>
        <button
          onClick={onSaveClick}
          className="rounded px-3 py-1.5 text-sm hover:bg-[var(--ui-bg-hover)]"
          title="Save as .md"
        >
          Save
        </button>
        <div className="mx-1 h-5 w-px bg-[var(--ui-border)]" />
        <button
          onClick={onStylePanelToggle}
          className="rounded px-3 py-1.5 text-sm hover:bg-[var(--ui-bg-hover)]"
          title="Style settings"
        >
          Theme
        </button>
        <button
          onClick={onPrintClick}
          className="rounded bg-[var(--foreground)] px-3 py-1.5 text-sm text-[var(--background)] hover:opacity-90"
          title="Print / PDF"
        >
          Print
        </button>
      </div>
    </header>
  );
}

export default Header;
