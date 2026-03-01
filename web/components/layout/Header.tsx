'use client';

import { useState } from 'react';
import type { ViewMode } from '@/stores/uiStore';

interface HeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onStylePanelToggle: () => void;
  onPrintClick: () => void;
  onSaveClick: () => void;
  onLoadClick: () => void;
  onDownloadMd: () => void;
  onDownloadPdf: () => void;
}

export function Header({
  viewMode,
  onViewModeChange,
  onStylePanelToggle,
  onPrintClick,
  onSaveClick,
  onLoadClick,
  onDownloadMd,
  onDownloadPdf,
}: HeaderProps) {
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showDownload, setShowDownload] = useState(false);

  return (
    <header
      className="flex h-11 items-center justify-between border-b border-[var(--ui-border)] px-2 sm:px-4"
      role="banner"
    >
      {/* Logo */}
      <div className="flex items-center gap-2 sm:gap-4">
        <h1 className="text-base font-semibold sm:text-lg">printmd</h1>

        {/* View mode toggle */}
        <nav
          className="flex items-center rounded-md border border-[var(--ui-border)] p-0.5"
          role="tablist"
          aria-label="View mode"
        >
          <button
            onClick={() => onViewModeChange('editor')}
            className={`rounded px-1.5 py-1 text-xs sm:px-2 ${
              viewMode === 'editor'
                ? 'bg-[var(--ui-bg-hover)]'
                : 'hover:bg-[var(--ui-bg-hover)]'
            }`}
            role="tab"
            aria-selected={viewMode === 'editor'}
            aria-controls="editor-panel"
          >
            <span className="hidden sm:inline">Editor</span>
            <span className="sm:hidden">Ed</span>
          </button>
          <button
            onClick={() => onViewModeChange('split')}
            className={`rounded px-1.5 py-1 text-xs sm:px-2 ${
              viewMode === 'split'
                ? 'bg-[var(--ui-bg-hover)]'
                : 'hover:bg-[var(--ui-bg-hover)]'
            }`}
            role="tab"
            aria-selected={viewMode === 'split'}
            aria-controls="split-panel"
          >
            Split
          </button>
          <button
            onClick={() => onViewModeChange('preview')}
            className={`rounded px-1.5 py-1 text-xs sm:px-2 ${
              viewMode === 'preview'
                ? 'bg-[var(--ui-bg-hover)]'
                : 'hover:bg-[var(--ui-bg-hover)]'
            }`}
            role="tab"
            aria-selected={viewMode === 'preview'}
            aria-controls="preview-panel"
          >
            <span className="hidden sm:inline">Preview</span>
            <span className="sm:hidden">Pre</span>
          </button>
        </nav>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-0.5 sm:gap-1">
        {/* Keyboard shortcuts help */}
        <div className="relative hidden sm:block">
          <button
            onClick={() => setShowShortcuts(!showShortcuts)}
            onBlur={() => setTimeout(() => setShowShortcuts(false), 200)}
            className="rounded px-2 py-1.5 text-sm text-gray-500 hover:bg-[var(--ui-bg-hover)] hover:text-gray-700"
            aria-label="Keyboard shortcuts"
            aria-expanded={showShortcuts}
            aria-haspopup="true"
          >
            <kbd className="text-xs">⌘</kbd>
          </button>
          {showShortcuts && (
            <div
              className="absolute right-0 top-full z-50 mt-1 w-56 rounded-lg border border-[var(--ui-border)] bg-white p-3 shadow-lg"
              role="menu"
            >
              <div className="text-xs font-semibold text-gray-500 mb-2">
                키보드 단축키
              </div>
              <div className="space-y-1.5 text-sm">
                <ShortcutItem keys="⌘S" description="저장" />
                <ShortcutItem keys="⌘P" description="인쇄" />
                <ShortcutItem keys="⌘⇧S" description="스타일 패널" />
                <ShortcutItem keys="F11" description="전체화면" />
                <ShortcutItem keys="Esc" description="닫기" />
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onLoadClick}
          className="rounded px-2 py-1.5 text-xs hover:bg-[var(--ui-bg-hover)] sm:px-3 sm:text-sm"
          aria-label="Open markdown file"
          title="Open file"
        >
          <span className="hidden sm:inline">Open</span>
          <span className="sm:hidden">📂</span>
        </button>
        <button
          onClick={onSaveClick}
          className="rounded px-2 py-1.5 text-xs hover:bg-[var(--ui-bg-hover)] sm:px-3 sm:text-sm"
          aria-label="Save to browser (Ctrl+S)"
          title="Save to browser (⌘S)"
        >
          <span className="hidden sm:inline">Save</span>
          <span className="sm:hidden">💾</span>
        </button>

        {/* Download dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDownload(!showDownload)}
            onBlur={() => setTimeout(() => setShowDownload(false), 200)}
            className="rounded px-2 py-1.5 text-xs hover:bg-[var(--ui-bg-hover)] sm:px-3 sm:text-sm flex items-center gap-1"
            aria-label="Download options"
            aria-expanded={showDownload}
            aria-haspopup="true"
          >
            <span className="hidden sm:inline">Download</span>
            <span className="sm:hidden">⬇️</span>
            <svg className="h-3 w-3 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showDownload && (
            <div
              className="absolute right-0 top-full z-50 mt-1 w-44 rounded-lg border border-[var(--ui-border)] bg-white py-1 shadow-lg"
              role="menu"
            >
              <button
                onClick={() => {
                  onDownloadPdf();
                  setShowDownload(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-[var(--ui-bg-hover)] flex items-center gap-2"
                role="menuitem"
              >
                <svg className="h-4 w-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                PDF (.pdf)
              </button>
              <button
                onClick={() => {
                  onDownloadMd();
                  setShowDownload(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-[var(--ui-bg-hover)] flex items-center gap-2"
                role="menuitem"
              >
                <svg className="h-4 w-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Markdown (.md)
              </button>
            </div>
          )}
        </div>

        <div className="mx-0.5 h-5 w-px bg-[var(--ui-border)] sm:mx-1" aria-hidden="true" />
        <button
          onClick={onStylePanelToggle}
          className="rounded px-2 py-1.5 text-xs hover:bg-[var(--ui-bg-hover)] sm:px-3 sm:text-sm"
          aria-label="Open style settings (Ctrl+Shift+S)"
          title="Style settings (⌘⇧S)"
        >
          <span className="hidden sm:inline">Theme</span>
          <span className="sm:hidden">🎨</span>
        </button>
        <button
          onClick={onPrintClick}
          className="rounded bg-[var(--foreground)] px-2 py-1.5 text-xs text-[var(--background)] hover:opacity-90 sm:px-3 sm:text-sm"
          aria-label="Print or export to PDF (Ctrl+P)"
          title="Print / PDF (⌘P)"
        >
          Print
        </button>
      </div>
    </header>
  );
}

function ShortcutItem({ keys, description }: { keys: string; description: string }) {
  return (
    <div className="flex items-center justify-between text-gray-600">
      <span>{description}</span>
      <kbd className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-mono">
        {keys}
      </kbd>
    </div>
  );
}

export default Header;
