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

  const useBg = settings.includeBackground;

  const bgColor = useBg ? styles.backgroundColor : '#ffffff';
  const textColor = useBg ? styles.textColor : '#1a1a1a';

  const baseStylesCss = useMemo(
    () => getPdfStyles({
      linkColor: useBg ? styles.linkColor : '#0366d6',
      codeBackground: useBg ? styles.codeBackground : '#f5f5f5',
      textColor,
    }),
    [useBg, styles.linkColor, styles.codeBackground, textColor]
  );

  const html = useMemo(() => {
    return sanitizeHtml(parseMarkdown(markdown));
  }, [markdown]);

  // Calculate content area dimensions (in pixels)
  const marginTopPx = settings.margins.top * (96 / 25.4);
  const marginBottomPx = settings.margins.bottom * (96 / 25.4);
  const marginLeftPx = settings.margins.left * (96 / 25.4);
  const marginRightPx = settings.margins.right * (96 / 25.4);
  const hdrH = settings.header.enabled ? 20 : 0; // px
  const ftrH = settings.footer.enabled ? 20 : 0; // px

  const contentArea = useMemo(() => {
    return {
      width: paperWidth - marginLeftPx - marginRightPx,
      height: paperHeight - marginTopPx - marginBottomPx - hdrH - ftrH,
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paperWidth, paperHeight, marginTopPx, marginBottomPx, marginLeftPx, marginRightPx, hdrH, ftrH]);

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
    color: textColor,
  };

  // Resolve header/footer template variables
  const resolveTemplate = (tpl: string, pageNum: number, totalPages: number): string => {
    const title = markdown.split('\n').find(l => l.startsWith('# '))?.replace(/^#\s+/, '') || 'Untitled';
    return tpl
      .replace(/\{title\}/g, title)
      .replace(/\{date\}/g, new Date().toLocaleDateString())
      .replace(/\{page\}/g, String(pageNum))
      .replace(/\{pages\}/g, String(totalPages));
  };

  const headerHeight = hdrH;
  const footerHeight = ftrH;

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
          {pages.map((pageId, index) => {
            const pageNum = index + 1;
            return (
              <div
                key={pageId}
                className="shadow-lg relative"
                style={{
                  width: paperWidth,
                  height: paperHeight,
                  overflow: 'hidden',
                  backgroundColor: bgColor,
                }}
              >
                {/* Header */}
                {settings.header.enabled && (
                  <div
                    className="absolute flex items-end"
                    style={{
                      top: marginTopPx,
                      left: marginLeftPx,
                      right: marginRightPx,
                      height: headerHeight,
                      fontSize: 9,
                      color: useBg ? textColor : '#666666',
                      opacity: 0.8,
                    }}
                  >
                    <span className="flex-1 text-left truncate">{resolveTemplate(settings.header.left, pageNum, pages.length)}</span>
                    <span className="flex-1 text-center truncate">{resolveTemplate(settings.header.center, pageNum, pages.length)}</span>
                    <span className="flex-1 text-right truncate">{resolveTemplate(settings.header.right, pageNum, pages.length)}</span>
                  </div>
                )}

                {/* Page content with offset */}
                <div
                  className="absolute preview-content"
                  style={{
                    ...contentStyles,
                    top: marginTopPx + headerHeight,
                    left: marginLeftPx,
                    right: marginRightPx,
                    bottom: marginBottomPx + footerHeight,
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

                {/* Footer */}
                {settings.footer.enabled && (
                  <div
                    className="absolute flex items-start"
                    style={{
                      bottom: marginBottomPx,
                      left: marginLeftPx,
                      right: marginRightPx,
                      height: footerHeight,
                      fontSize: 9,
                      color: useBg ? textColor : '#666666',
                      opacity: 0.8,
                    }}
                  >
                    <span className="flex-1 text-left truncate">{resolveTemplate(settings.footer.left, pageNum, pages.length)}</span>
                    <span className="flex-1 text-center truncate">{resolveTemplate(settings.footer.center, pageNum, pages.length)}</span>
                    <span className="flex-1 text-right truncate">{resolveTemplate(settings.footer.right, pageNum, pages.length)}</span>
                  </div>
                )}
              </div>
            );
          })}

          <div className="text-sm text-[var(--ui-text-muted)]">
            {pages.length} page{pages.length > 1 ? 's' : ''}
          </div>
        </>
      )}

      {/* Base styles from theme, then element-level overrides */}
      <style dangerouslySetInnerHTML={{ __html: baseStylesCss }} />
      {useBg && elementStylesCss && (
        <style dangerouslySetInnerHTML={{ __html: elementStylesCss }} />
      )}
    </div>
  );
}
