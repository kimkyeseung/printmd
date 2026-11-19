'use client';

import { useEffect, useRef, useState } from 'react';
import { CODE_LANGUAGES, normalizeCodeLanguage } from '@/lib/markdown/codeLanguages';
import { CODE_THEMES, type CodeThemeId } from '@/lib/markdown/codeThemes';
import { useClientDictionary } from '@/hooks/useClientLocale';

interface CodeBlockToolbarProps {
  /** Top-right corner of the code block, in the preview container's coordinates. */
  top: number;
  right: number;
  /** Language on the fence line, or null for a block without a fence (indented code). */
  language: string | null;
  codeTheme: CodeThemeId;
  onLanguageChange: (lang: string) => void;
  onThemeChange: (theme: CodeThemeId) => void;
  onCopy: () => Promise<void>;
  /** Keeps the toolbar up while one of its dropdowns is open. */
  onFocusChange: (focused: boolean) => void;
}

const selectClass =
  'h-7 max-w-[9rem] cursor-pointer rounded bg-transparent pl-1.5 pr-1 text-xs text-[var(--ui-text-muted)] hover:bg-[var(--ui-bg-hover)] hover:text-[var(--foreground)] focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--printmd-link-color)]';

/**
 * Notion-style controls that float over a hovered code block in the preview:
 * language, code theme and copy. It lives outside the rendered article, so it
 * never reaches print or PDF output.
 */
export function CodeBlockToolbar({
  top,
  right,
  language,
  codeTheme,
  onLanguageChange,
  onThemeChange,
  onCopy,
  onFocusChange,
}: CodeBlockToolbarProps) {
  const t = useClientDictionary();
  const text = t.editor.codeBlock;
  const themes = t.stylePanel.codeThemes;
  const [copied, setCopied] = useState(false);
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (copiedTimer.current) clearTimeout(copiedTimer.current);
  }, []);

  const current = language === null ? null : normalizeCodeLanguage(language);
  const isKnown = current === null || current === '' || CODE_LANGUAGES.some((l) => l.value === current);

  const handleCopy = async () => {
    try {
      await onCopy();
      setCopied(true);
      if (copiedTimer.current) clearTimeout(copiedTimer.current);
      copiedTimer.current = setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard can be blocked (permissions, insecure context); nothing to show.
    }
  };

  return (
    <div
      className="code-block-toolbar absolute z-10 flex items-center gap-0.5 rounded-md border border-[var(--ui-border)] bg-[var(--background)] p-0.5 shadow-sm"
      style={{ top, left: right, transform: 'translateX(-100%)' }}
      // Only an open dropdown should pin the toolbar; its popup sits outside
      // the toolbar, so the pointer "leaves" while choosing.
      onFocus={(e) => onFocusChange(e.target.tagName === 'SELECT')}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) onFocusChange(false);
      }}
      // Keep the preview's double-click-to-edit from firing through the toolbar.
      onDoubleClick={(e) => e.stopPropagation()}
    >
      {current !== null && (
        <select
          value={current}
          onChange={(e) => {
            onLanguageChange(e.target.value);
            e.target.blur();
          }}
          className={selectClass}
          aria-label={text.language}
          title={text.language}
        >
          <option value="">{text.plainText}</option>
          {!isKnown && <option value={current}>{language}</option>}
          {CODE_LANGUAGES.map((l) => (
            <option key={l.value} value={l.value}>{l.label}</option>
          ))}
        </select>
      )}

      <select
        value={codeTheme}
        onChange={(e) => {
          onThemeChange(e.target.value as CodeThemeId);
          e.target.blur();
        }}
        className={selectClass}
        aria-label={text.theme}
        title={text.theme}
      >
        <option value="auto">{themes.auto}</option>
        <option value="none">{themes.none}</option>
        <optgroup label={themes.light}>
          {CODE_THEMES.filter((ct) => !ct.dark).map((ct) => (
            <option key={ct.id} value={ct.id}>{ct.label}</option>
          ))}
        </optgroup>
        <optgroup label={themes.dark}>
          {CODE_THEMES.filter((ct) => ct.dark).map((ct) => (
            <option key={ct.id} value={ct.id}>{ct.label}</option>
          ))}
        </optgroup>
      </select>

      <span className="mx-0.5 h-4 w-px bg-[var(--ui-border)]" aria-hidden="true" />

      <button
        type="button"
        onClick={handleCopy}
        className="flex h-7 w-7 items-center justify-center rounded text-[var(--ui-text-muted)] hover:bg-[var(--ui-bg-hover)] hover:text-[var(--foreground)]"
        aria-label={copied ? text.copied : text.copy}
        title={copied ? text.copied : text.copy}
      >
        {copied ? (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <rect x="9" y="9" width="11" height="11" rx="2" strokeWidth={2} />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15V6a2 2 0 012-2h9" />
          </svg>
        )}
      </button>
    </div>
  );
}

export default CodeBlockToolbar;
