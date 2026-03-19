'use client';

import { memo, useMemo, useDeferredValue } from 'react';
import { parseMarkdown } from '@/lib/markdown/parser';
import { sanitizeHtml } from '@/lib/markdown/sanitizer';
import { generateElementStylesCss, ELEMENT_SELECTORS } from '@/lib/themes';
import { useStyleStore, useUIStore } from '@/stores';
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

function generateSpacingHighlightCss(
  highlight: { element: string; type: 'margin' | 'padding'; side: 'top' | 'bottom' | 'left' | 'right' },
  elementStyles: Record<string, any>,
  globalPadding: { top: number; right: number; bottom: number; left: number },
): string {
  const selector = ELEMENT_SELECTORS[highlight.element as keyof typeof ELEMENT_SELECTORS];
  if (!selector) return '';

  const isMargin = highlight.type === 'margin';
  const { side } = highlight;
  const propKey = `${highlight.type}${side.charAt(0).toUpperCase() + side.slice(1)}`;
  const defaults = HIGHLIGHT_DEFAULTS[highlight.element as EditableElement] || {};

  // Get the value (explicit → default)
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

export const Preview = memo(function Preview({ markdown, styles }: PreviewProps) {
  const deferredMarkdown = useDeferredValue(markdown);
  const elementStyles = useStyleStore((state) => state.elementStyles);
  const spacingHighlight = useUIStore((state) => state.spacingHighlight);

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
      className="preview-container h-full overflow-auto"
      style={{
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
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
});

export default Preview;
