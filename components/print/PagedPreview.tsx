'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { parseMarkdown } from '@/lib/markdown/parser';
import { sanitizeHtml } from '@/lib/markdown/sanitizer';
import { generateElementStylesCss } from '@/lib/themes';
import { getPdfStyles } from '@/lib/print/pdfStyles';
import { useStyleStore } from '@/stores';
import type { GlobalStyles } from '@/types/style';
import type { PrintSettings } from '@/types/print';

interface PagedPreviewProps {
  markdown: string;
  styles: GlobalStyles;
  settings: PrintSettings;
  paperWidth: number;
  paperHeight: number;
}

export function PagedPreview({
  markdown,
  styles,
  settings,
  paperWidth,
  paperHeight,
}: PagedPreviewProps) {
  const measureRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<string[]>([]);
  const [isRendering, setIsRendering] = useState(true);
  const elementStyles = useStyleStore((state) => state.elementStyles);

  const elementStylesCss = useMemo(
    () => generateElementStylesCss(elementStyles),
    [elementStyles]
  );

  const baseStylesCss = useMemo(
    () => getPdfStyles({
      linkColor: styles.linkColor,
      codeBackground: styles.codeBackground,
      textColor: styles.textColor,
    }),
    [styles.linkColor, styles.codeBackground, styles.textColor]
  );

  const html = useMemo(() => {
    return sanitizeHtml(parseMarkdown(markdown));
  }, [markdown]);

  // Calculate content area dimensions (in pixels)
  const contentArea = useMemo(() => {
    const marginTopPx = settings.margins.top * (96 / 25.4);
    const marginBottomPx = settings.margins.bottom * (96 / 25.4);
    const marginLeftPx = settings.margins.left * (96 / 25.4);
    const marginRightPx = settings.margins.right * (96 / 25.4);
    return {
      width: paperWidth - marginLeftPx - marginRightPx,
      height: paperHeight - marginTopPx - marginBottomPx,
    };
  }, [paperWidth, paperHeight, settings.margins]);

  useEffect(() => {
    if (!measureRef.current) return;

    const paginateContent = () => {
      setIsRendering(true);

      // Measure total content height
      const totalHeight = measureRef.current!.scrollHeight;
      const pageHeight = contentArea.height;

      // Calculate number of pages needed
      const numPages = Math.max(1, Math.ceil(totalHeight / pageHeight));

      // For now, we'll show pages by clipping with CSS
      // Each page shows a different portion of the content
      const pageArray: string[] = [];
      for (let i = 0; i < numPages; i++) {
        pageArray.push(`page-${i}`);
      }

      setPages(pageArray);
      setIsRendering(false);
    };

    // Debounce
    const timer = setTimeout(paginateContent, 100);
    return () => clearTimeout(timer);
  }, [html, contentArea.height]);

  const contentStyles: React.CSSProperties = {
    fontFamily: styles.fontFamily,
    fontSize: styles.fontSize,
    lineHeight: styles.lineHeight,
    color: styles.textColor,
  };

  return (
    <div className="paged-preview flex flex-col items-center gap-5">
      {/* Hidden measure div */}
      <div
        ref={measureRef}
        className="absolute -left-[9999px] preview-content"
        style={{
          ...contentStyles,
          width: contentArea.width,
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {isRendering ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-3 text-sm text-gray-500">Rendering pages...</span>
        </div>
      ) : (
        <>
          {pages.map((pageId, index) => (
            <div
              key={pageId}
              className="shadow-lg relative"
              style={{
                width: paperWidth,
                height: paperHeight,
                overflow: 'hidden',
                backgroundColor: styles.backgroundColor,
              }}
            >
              {/* Page content with offset */}
              <div
                className="absolute preview-content"
                style={{
                  ...contentStyles,
                  top: settings.margins.top * (96 / 25.4),
                  left: settings.margins.left * (96 / 25.4),
                  right: settings.margins.right * (96 / 25.4),
                  bottom: settings.margins.bottom * (96 / 25.4),
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    transform: `translateY(-${index * contentArea.height}px)`,
                  }}
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              </div>

              {/* Page number */}
              <div
                className="absolute bottom-2 left-0 right-0 text-center text-xs text-gray-400"
              >
                {index + 1} / {pages.length}
              </div>
            </div>
          ))}

          <div className="text-sm text-[var(--ui-text-muted)]">
            {pages.length} page{pages.length > 1 ? 's' : ''}
          </div>
        </>
      )}

      {/* Base styles from theme, then element-level overrides */}
      <style dangerouslySetInnerHTML={{ __html: baseStylesCss }} />
      {elementStylesCss && (
        <style dangerouslySetInnerHTML={{ __html: elementStylesCss }} />
      )}
    </div>
  );
}
