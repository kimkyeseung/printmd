'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import type { ViewMode } from '@/stores/uiStore';

interface HeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onStylePanelToggle: () => void;
  onPrintClick: () => void;
  onSaveClick: () => void;
  onSaveAsClick: () => void;
  onLoadClick: () => void;
  onOpenFileClick: () => void;
  onDownloadMd: () => void;
  onDownloadPdf: () => void;
  hasCurrentDocument?: boolean;
}

function ThemeIcon({ theme }: { theme: string | undefined }) {
  if (theme === 'light') {
    return (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    );
  }
  if (theme === 'dark') {
    return (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    );
  }
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

export function Header({
  viewMode,
  onViewModeChange,
  onStylePanelToggle,
  onPrintClick,
  onSaveClick,
  onSaveAsClick,
  onLoadClick,
  onOpenFileClick,
  onDownloadMd,
  onDownloadPdf,
  hasCurrentDocument = false,
}: HeaderProps) {
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const [showOpen, setShowOpen] = useState(false);
  const [showSave, setShowSave] = useState(false);
  const [showTheme, setShowTheme] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header
      className="flex h-11 items-center justify-between border-b border-[var(--ui-border)] px-2 sm:px-4"
      role="banner"
    >
      {/* Logo */}
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-1.5">
          <Image src="/icon.svg" alt="printmd logo" width={24} height={24} className="rounded" />
          <span className="text-base font-semibold sm:text-lg">printmd</span>
        </div>

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
            className={`hidden md:block rounded px-1.5 py-1 text-xs sm:px-2 ${
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
              className="dropdown-menu absolute right-0 top-full z-50 mt-1 w-56 rounded-lg border border-[var(--ui-border)] p-3 shadow-lg"
              role="menu"
            >
              <div className="text-xs font-semibold text-[var(--ui-text-muted)] mb-2">
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

        {/* Open dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowOpen(!showOpen)}
            onBlur={() => setTimeout(() => setShowOpen(false), 200)}
            className="rounded px-2 py-1.5 text-xs hover:bg-[var(--ui-bg-hover)] sm:px-3 sm:text-sm flex items-center gap-1"
            aria-label="Open options"
            aria-expanded={showOpen}
            aria-haspopup="true"
          >
            <span className="hidden sm:inline">Open</span>
            <span className="sm:hidden">📂</span>
            <svg className="h-3 w-3 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showOpen && (
            <div
              className="dropdown-menu absolute left-0 top-full z-50 mt-1 w-48 rounded-lg border border-[var(--ui-border)] py-1 shadow-lg"
              role="menu"
            >
              <button
                onClick={() => {
                  onOpenFileClick();
                  setShowOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-[var(--ui-bg-hover)] flex items-center gap-2"
                role="menuitem"
              >
                <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                </svg>
                From File...
              </button>
              <button
                onClick={() => {
                  onLoadClick();
                  setShowOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-[var(--ui-bg-hover)] flex items-center gap-2"
                role="menuitem"
              >
                <svg className="h-4 w-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                From Saved...
              </button>
            </div>
          )}
        </div>
        {/* Save dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSave(!showSave)}
            onBlur={() => setTimeout(() => setShowSave(false), 200)}
            className="rounded px-2 py-1.5 text-xs hover:bg-[var(--ui-bg-hover)] sm:px-3 sm:text-sm flex items-center gap-1"
            aria-label="Save options"
            aria-expanded={showSave}
            aria-haspopup="true"
          >
            <span className="hidden sm:inline">Save</span>
            <span className="sm:hidden">💾</span>
            <svg className="h-3 w-3 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showSave && (
            <div
              className="dropdown-menu absolute left-0 top-full z-50 mt-1 w-44 rounded-lg border border-[var(--ui-border)] py-1 shadow-lg"
              role="menu"
            >
              <button
                onClick={() => {
                  onSaveClick();
                  setShowSave(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-[var(--ui-bg-hover)] flex items-center gap-2"
                role="menuitem"
              >
                <svg className="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Save
                {hasCurrentDocument && (
                  <span className="ml-auto text-xs text-[var(--ui-text-muted)]">⌘S</span>
                )}
              </button>
              <button
                onClick={() => {
                  onSaveAsClick();
                  setShowSave(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-[var(--ui-bg-hover)] flex items-center gap-2"
                role="menuitem"
              >
                <svg className="h-4 w-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Save As...
                {!hasCurrentDocument && (
                  <span className="ml-auto text-xs text-[var(--ui-text-muted)]">⌘S</span>
                )}
              </button>
            </div>
          )}
        </div>

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
              className="dropdown-menu absolute right-0 top-full z-50 mt-1 w-44 rounded-lg border border-[var(--ui-border)] py-1 shadow-lg"
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

        {/* Theme dropdown (app UI theme) */}
        <div className="relative">
          <button
            onClick={() => setShowTheme(!showTheme)}
            onBlur={() => setTimeout(() => setShowTheme(false), 200)}
            className="rounded px-2 py-1.5 text-xs hover:bg-[var(--ui-bg-hover)] sm:px-3 sm:text-sm flex items-center gap-1"
            aria-label="Theme"
            aria-expanded={showTheme}
            aria-haspopup="true"
          >
            {mounted && <ThemeIcon theme={resolvedTheme} />}
            <svg className="h-3 w-3 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showTheme && (
            <div
              className="dropdown-menu absolute right-0 top-full z-50 mt-1 w-36 rounded-lg border border-[var(--ui-border)] py-1 shadow-lg"
              role="menu"
            >
              <button
                onClick={() => {
                  setTheme('light');
                  setShowTheme(false);
                }}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-[var(--ui-bg-hover)] flex items-center gap-2 ${
                  theme === 'light' ? 'font-semibold' : ''
                }`}
                role="menuitem"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Light
              </button>
              <button
                onClick={() => {
                  setTheme('dark');
                  setShowTheme(false);
                }}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-[var(--ui-bg-hover)] flex items-center gap-2 ${
                  theme === 'dark' ? 'font-semibold' : ''
                }`}
                role="menuitem"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                Dark
              </button>
              <button
                onClick={() => {
                  setTheme('system');
                  setShowTheme(false);
                }}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-[var(--ui-bg-hover)] flex items-center gap-2 ${
                  theme === 'system' ? 'font-semibold' : ''
                }`}
                role="menuitem"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                System
              </button>
            </div>
          )}
        </div>

        {/* Style button (preview document styling) */}
        <button
          onClick={onStylePanelToggle}
          className="rounded px-2 py-1.5 text-xs hover:bg-[var(--ui-bg-hover)] sm:px-3 sm:text-sm"
          aria-label="Open style settings (Ctrl+Shift+S)"
          title="Style settings (⌘⇧S)"
        >
          <span className="hidden sm:inline">Style</span>
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
    <div className="flex items-center justify-between">
      <span>{description}</span>
      <kbd className="rounded bg-[var(--ui-bg-hover)] px-1.5 py-0.5 text-xs font-mono">
        {keys}
      </kbd>
    </div>
  );
}

export default Header;
