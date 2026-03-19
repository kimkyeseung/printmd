'use client';

import { memo, useMemo, useDeferredValue, useRef, useEffect, useCallback, useState } from 'react';
import { parseMarkdown } from '@/lib/markdown/parser';
import { sanitizeHtml } from '@/lib/markdown/sanitizer';
import { generateElementStylesCss, ELEMENT_SELECTORS } from '@/lib/themes';
import { useStyleStore, useUIStore, useTabsStore } from '@/stores';
import type { GlobalStyles, EditableElement } from '@/types/style';

/** Default spacing values (px) matching preview.css at 16px base */
const HIGHLIGHT_DEFAULTS: Record<EditableElement, Record<string, number>> = {
  page: { paddingTop: 40, paddingBottom: 40, paddingLeft: 40, paddingRight: 40, marginTop: 0, marginBottom: 0 },
  h1: { marginTop: 24, marginBottom: 8, paddingTop: 0, paddingBottom: 5, paddingLeft: 0, paddingRight: 0 },
  h2: { marginTop: 24, marginBottom: 8, paddingTop: 0, paddingBottom: 5, paddingLeft: 0, paddingRight: 0 },
  h3: { marginTop: 24, marginBottom: 8, paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0 },
  h4: { marginTop: 24, marginBottom: 8, paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0 },
  h5: { marginTop: 24, marginBottom: 8, paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0 },
  h6: { marginTop: 24, marginBottom: 8, paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0 },
  paragraph: { marginTop: 0, marginBottom: 16, paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0 },
  bulletList: { marginTop: 0, marginBottom: 16, paddingTop: 0, paddingBottom: 0, paddingLeft: 32, paddingRight: 0 },
  orderedList: { marginTop: 0, marginBottom: 16, paddingTop: 0, paddingBottom: 0, paddingLeft: 32, paddingRight: 0 },
  todoList: { marginTop: 0, marginBottom: 16, paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0 },
  todoChecked: { marginTop: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0 },
  blockquote: { marginTop: 0, marginBottom: 16, paddingTop: 8, paddingBottom: 8, paddingLeft: 16, paddingRight: 16 },
  hr: { marginTop: 24, marginBottom: 24, paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0 },
  image: { marginTop: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0 },
  code: { marginTop: 0, marginBottom: 16, paddingTop: 16, paddingBottom: 16, paddingLeft: 16, paddingRight: 16 },
  table: { marginTop: 0, marginBottom: 16, paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0 },
};

interface PreviewProps {
  markdown: string;
  styles: GlobalStyles;
}

interface EditingState {
  startLine: number;
  endLine: number;
  originalMarkdown: string;
  isSingleLine: boolean;
  position: { top: number; left: number; width: number; minHeight: number };
}

const INLINE_EDITOR_STYLE: React.CSSProperties = {
  position: 'absolute',
  zIndex: 50,
  fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
  fontSize: '14px',
  lineHeight: '1.5',
  padding: '4px 8px',
  border: '2px solid #3b82f6',
  borderRadius: '4px',
  backgroundColor: '#fff',
  color: '#1e293b',
  outline: 'none',
  resize: 'vertical',
  boxSizing: 'border-box',
};

function generateSpacingHighlightCss(
  highlight: { element: string; type: 'margin' | 'padding'; side: 'top' | 'bottom' | 'left' | 'right' },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  elementStyles: Record<string, any>,
  globalPadding: { top: number; right: number; bottom: number; left: number },
): string {
  const selector = ELEMENT_SELECTORS[highlight.element as keyof typeof ELEMENT_SELECTORS];
  if (!selector) return '';

  const isMargin = highlight.type === 'margin';
  const { side } = highlight;
  const propKey = `${highlight.type}${side.charAt(0).toUpperCase() + side.slice(1)}`;
  const defaults = HIGHLIGHT_DEFAULTS[highlight.element as EditableElement] || {};

  // Get the value (explicit -> default)
  let value = 0;
  if (highlight.element === 'page') {
    value = globalPadding[side] || 0;
  } else {
    const style = elementStyles[highlight.element] || {};
    value = style[propKey] ?? defaults[propKey] ?? 0;
  }

  const color = isMargin ? 'rgba(255, 152, 0, 0.3)' : 'rgba(76, 175, 80, 0.3)';
  const outlineColor = isMargin ? 'rgba(255, 152, 0, 0.6)' : 'rgba(76, 175, 80, 0.6)';

  let boxShadow = '';
  if (value > 0) {
    if (!isMargin) {
      // Padding: inset box-shadow
      switch (side) {
        case 'top': boxShadow = `inset 0 ${value}px 0 0 ${color}`; break;
        case 'bottom': boxShadow = `inset 0 -${value}px 0 0 ${color}`; break;
        case 'left': boxShadow = `inset ${value}px 0 0 0 ${color}`; break;
        case 'right': boxShadow = `inset -${value}px 0 0 0 ${color}`; break;
      }
    } else {
      // Margin: outer box-shadow
      switch (side) {
        case 'top': boxShadow = `0 -${value}px 0 0 ${color}`; break;
        case 'bottom': boxShadow = `0 ${value}px 0 0 ${color}`; break;
        case 'left': boxShadow = `-${value}px 0 0 0 ${color}`; break;
        case 'right': boxShadow = `${value}px 0 0 0 ${color}`; break;
      }
    }
  }

  return `${selector} {
    outline: 1px dashed ${outlineColor} !important;
    outline-offset: -1px !important;
    ${boxShadow ? `box-shadow: ${boxShadow} !important;` : ''}
  }`;
}

function InlineEditor({
  editing,
  onConfirm,
  onCancel,
}: {
  editing: EditingState;
  onConfirm: (newText: string) => void;
  onCancel: () => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const cancelledRef = useRef(false);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.focus();
    ta.select();
  }, []);

  const style: React.CSSProperties = {
    ...INLINE_EDITOR_STYLE,
    top: editing.position.top,
    left: editing.position.left,
    width: editing.position.width,
    minHeight: editing.position.minHeight,
  };

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        cancelledRef.current = true;
        onCancel();
      } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey || (editing.isSingleLine && !e.shiftKey))) {
        e.preventDefault();
        onConfirm(e.currentTarget.value);
      }
    },
    [onCancel, onConfirm, editing.isSingleLine],
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLTextAreaElement>) => {
      if (cancelledRef.current) return;
      onConfirm(e.currentTarget.value);
    },
    [onConfirm],
  );

  return (
    <textarea
      ref={textareaRef}
      defaultValue={editing.originalMarkdown}
      style={style}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      rows={editing.originalMarkdown.split('\n').length}
    />
  );
}

/** Single-line block tags where Enter confirms the edit */
const SINGLE_LINE_TAGS = new Set(['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'HR']);

export const Preview = memo(function Preview({ markdown, styles }: PreviewProps) {
  const deferredMarkdown = useDeferredValue(markdown);
  const elementStyles = useStyleStore((state) => state.elementStyles);
  const spacingHighlight = useUIStore((state) => state.spacingHighlight);
  const updateTabContent = useTabsStore((state) => state.updateTabContent);
  const getActiveTab = useTabsStore((state) => state.getActiveTab);
  const articleRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [editing, setEditing] = useState<EditingState | null>(null);

  const elementStylesCss = useMemo(
    () => generateElementStylesCss(elementStyles),
    [elementStyles]
  );

  const highlightCss = useMemo(() => {
    if (!spacingHighlight) return '';
    return generateSpacingHighlightCss(spacingHighlight, elementStyles, styles.padding);
  }, [spacingHighlight, elementStyles, styles.padding]);

  const html = useMemo(() => {
    const parsed = parseMarkdown(deferredMarkdown);
    return sanitizeHtml(parsed);
  }, [deferredMarkdown]);

  // Reset editing state when html changes (React 19 pattern: reset during render)
  const [prevHtml, setPrevHtml] = useState(html);
  if (html !== prevHtml) {
    setPrevHtml(html);
    setEditing(null);
  }

  // Update article innerHTML when html changes
  useEffect(() => {
    if (articleRef.current) {
      articleRef.current.innerHTML = html;
    }
  }, [html]);

  // Handle checkbox click toggle
  const handleCheckboxClick = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName !== 'INPUT' || target.getAttribute('type') !== 'checkbox') return;

    e.preventDefault();
    const lineStr = target.getAttribute('data-line');
    if (lineStr === null) return;
    const lineNum = parseInt(lineStr, 10);
    if (isNaN(lineNum)) return;

    const activeTab = getActiveTab();
    if (!activeTab) return;
    const lines = activeTab.content.split('\n');
    if (lineNum < 0 || lineNum >= lines.length) return;

    const line = lines[lineNum];
    if (/- \[ \]/.test(line)) {
      lines[lineNum] = line.replace('- [ ]', '- [x]');
    } else if (/- \[x\]/i.test(line)) {
      lines[lineNum] = line.replace(/- \[x\]/i, '- [ ]');
    } else {
      return;
    }

    updateTabContent(activeTab.id, lines.join('\n'));
  }, [getActiveTab, updateTabContent]);

  // Handle double-click to start inline editing
  const handleDblClick = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT') return;

    const block = (target.closest('[data-line]') as HTMLElement) || null;
    if (!block) return;

    const startStr = block.getAttribute('data-line');
    const endStr = block.getAttribute('data-line-end');
    if (startStr === null || endStr === null) return;

    const startLine = parseInt(startStr, 10);
    const endLine = parseInt(endStr, 10);
    if (isNaN(startLine) || isNaN(endLine)) return;

    // Compute position relative to container (ref access in event handler is safe)
    const container = containerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    const elRect = block.getBoundingClientRect();

    const activeTab = getActiveTab();
    if (!activeTab) return;
    const lines = activeTab.content.split('\n');
    const sliced = lines.slice(startLine, endLine);
    const originalMarkdown = sliced.join('\n');

    setEditing({
      startLine,
      endLine,
      originalMarkdown,
      isSingleLine: SINGLE_LINE_TAGS.has(block.tagName),
      position: {
        top: elRect.top - containerRect.top + container.scrollTop,
        left: elRect.left - containerRect.left + container.scrollLeft,
        width: elRect.width,
        minHeight: elRect.height,
      },
    });
  }, []);

  // Confirm edit: splice new lines into source
  const handleConfirm = useCallback(
    (newText: string) => {
      if (!editing) return;
      const trimmed = newText.replace(/\n$/, '');
      if (trimmed !== editing.originalMarkdown) {
        const activeTab = getActiveTab();
        if (!activeTab) return;
        const lines = activeTab.content.split('\n');
        const newLines = trimmed.split('\n');
        lines.splice(editing.startLine, editing.endLine - editing.startLine, ...newLines);
        updateTabContent(activeTab.id, lines.join('\n'));
      }
      setEditing(null);
    },
    [editing, getActiveTab, updateTabContent],
  );

  const handleCancel = useCallback(() => {
    setEditing(null);
  }, []);

  useEffect(() => {
    const article = articleRef.current;
    if (!article) return;
    article.addEventListener('click', handleCheckboxClick);
    article.addEventListener('dblclick', handleDblClick);
    return () => {
      article.removeEventListener('click', handleCheckboxClick);
      article.removeEventListener('dblclick', handleDblClick);
    };
  }, [handleCheckboxClick, handleDblClick]);

  const cssVariables = useMemo(() => ({
    '--preview-font-size': `${styles.fontSize}px`,
    '--preview-font-family': styles.fontFamily,
    '--preview-text-color': styles.textColor,
    '--preview-bg-color': styles.backgroundColor,
    '--preview-line-height': styles.lineHeight,
    '--preview-link-color': styles.linkColor,
    '--preview-code-bg': styles.codeBackground,
    '--preview-max-width': `${styles.maxWidth}px`,
    '--preview-padding-top': `${styles.padding.top}px`,
    '--preview-padding-right': `${styles.padding.right}px`,
    '--preview-padding-bottom': `${styles.padding.bottom}px`,
    '--preview-padding-left': `${styles.padding.left}px`,
  } as React.CSSProperties), [styles.fontSize, styles.fontFamily, styles.textColor, styles.backgroundColor, styles.lineHeight, styles.linkColor, styles.codeBackground, styles.maxWidth, styles.padding.top, styles.padding.right, styles.padding.bottom, styles.padding.left]);

  return (
    <div
      ref={containerRef}
      className="preview-container h-full overflow-auto"
      style={{
        position: 'relative',
        backgroundColor: styles.backgroundColor,
        ...cssVariables,
      }}
    >
      {elementStylesCss && (
        <style dangerouslySetInnerHTML={{ __html: elementStylesCss }} />
      )}
      {highlightCss && (
        <style dangerouslySetInnerHTML={{ __html: highlightCss }} />
      )}
      <article
        ref={articleRef}
        className="preview-content"
        style={{
          maxWidth: styles.maxWidth,
          margin: '0 auto',
          padding: `${styles.padding.top}px ${styles.padding.right}px ${styles.padding.bottom}px ${styles.padding.left}px`,
          fontFamily: styles.fontFamily,
          fontSize: styles.fontSize,
          lineHeight: styles.lineHeight,
          color: styles.textColor,
        }}
      />
      {editing && (
        <InlineEditor
          editing={editing}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
});

export default Preview;
