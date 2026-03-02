'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import { parseMarkdown } from '@/lib/markdown/parser';
import { sanitizeHtml } from '@/lib/markdown/sanitizer';
import type { GlobalStyles } from '@/types/style';

interface PreviewProps {
  markdown: string;
  styles: GlobalStyles;
}

export function Preview({ markdown, styles }: PreviewProps) {
  const [debouncedMarkdown, setDebouncedMarkdown] = useState(markdown);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setDebouncedMarkdown(markdown);
    }, 150);
    return () => clearTimeout(timerRef.current);
  }, [markdown]);

  const html = useMemo(() => {
    const parsed = parseMarkdown(debouncedMarkdown);
    return sanitizeHtml(parsed);
  }, [debouncedMarkdown]);

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
}

export default Preview;
