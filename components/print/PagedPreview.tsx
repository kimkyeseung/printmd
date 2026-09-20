'use client';

import { useEffect, useImperativeHandle, useRef, useState, useMemo } from 'react';
import { parseMarkdown } from '@/lib/markdown/parser';
import { sanitizeHtml } from '@/lib/markdown/sanitizer';
import { useStyleStore } from '@/stores';
import { mmToPx } from '@/lib/print/paperSizes';
import { findKeepTogetherZones, computePageBreaks } from '@/lib/print/pageBreaks';
import { extractTitle, resolveTemplate } from '@/lib/print/headerFooter';
import {
  buildPrintDocument,
  getPrintGeometry,
  resolvePrintColors,
  waitForPrintDocument,
  HEADER_BASELINE_OFFSET_MM,
  FOOTER_BASELINE_OFFSET_MM,
  HEADER_FOOTER_FONT_SIZE_PT,
  HEADER_FOOTER_LINE_HEIGHT_MM,
  PRINT_ROOT_CLASS,
} from '@/lib/print/printDocument';
import type { GlobalStyles } from '@/types/style';
import type { PrintSettings, HeaderFooterConfig } from '@/types/print';

export interface PagedPreviewHandle {
  /**
   * Send the paged document to the browser's print pipeline. Returns false if
   * pagination hasn't finished yet, so the caller can decline rather than
   * printing a half-built document.
   */
  print: () => boolean;
}

interface PagedPreviewProps {
  markdown: string;
  styles: GlobalStyles;
  settings: PrintSettings;
  ref?: React.Ref<PagedPreviewHandle>;
}

/** Gap (px) between page sheets in the preview. */
const PAGE_GAP_PX = 20;

/**
 * Paged print preview — and the document that actually gets printed.
 *
 * The sheets rendered here are what the browser prints: `print()` hands this
 * iframe to the print pipeline, so the output is the preview, laid out by the
 * same `buildPrintDocument` + `computePageBreaks` the user is looking at.
 * Printing the live document (rather than rasterising it) keeps the text as
 * real text — selectable, searchable, and rendered with the fonts the iframe
 * already has, including uploaded ones.
 */
export function PagedPreview({ markdown, styles, settings, ref }: PagedPreviewProps) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const elementStyles = useStyleStore((state) => state.elementStyles);
  const customFonts = useStyleStore((state) => state.customFonts);

  const html = useMemo(() => sanitizeHtml(parseMarkdown(markdown)), [markdown]);
  const docTitle = useMemo(() => extractTitle(markdown), [markdown]);
  const geometry = useMemo(() => getPrintGeometry(settings), [settings]);
  const colors = useMemo(
    () => resolvePrintColors(styles, settings.includeBackground),
    [styles, settings.includeBackground]
  );

  const docHtml = useMemo(
    () =>
      buildPrintDocument({
        html,
        title: docTitle,
        geometry,
        colors,
        styles,
        elementStyles,
        customFonts,
        includeBackground: settings.includeBackground,
        extraCss: buildPagedCss(geometry, colors.background),
      }),
    [
      html,
      docTitle,
      geometry,
      colors,
      styles,
      elementStyles,
      customFonts,
      settings.includeBackground,
    ]
  );

  /**
   * Everything one pagination pass needs. Its identity doubles as the cache key
   * for the rendered result, so `isRendering` is derived during render instead
   * of being toggled from inside the effect.
   */
  const plan = useMemo(
    () => ({
      docHtml,
      geometry,
      settings,
      docTitle,
      headerFooterColor: colors.headerFooter,
    }),
    [docHtml, geometry, settings, docTitle, colors.headerFooter]
  );

  const [rendered, setRendered] = useState<{ plan: unknown; pageCount: number } | null>(null);
  const isRendering = rendered === null || rendered.plan !== plan;

  useImperativeHandle(
    ref,
    () => ({
      print: () => {
        const win = frameRef.current?.contentWindow;
        if (!win || isRendering) return false;
        // focus() first: Safari prints the top document otherwise.
        win.focus();
        win.print();
        return true;
      },
    }),
    [isRendering]
  );

  useEffect(() => {
    const frame = frameRef.current;
    const doc = frame?.contentDocument;
    if (!frame || !doc) return;

    let cancelled = false;

    doc.open();
    doc.write(plan.docHtml);
    doc.close();

    const paginate = async () => {
      await waitForPrintDocument(doc);
      if (cancelled) return;

      const root = doc.querySelector<HTMLElement>(`.${PRINT_ROOT_CLASS}`);
      if (!root) return;

      const { geometry: geo } = plan;

      // The same measurements the PDF exporter takes, on the same element.
      const contentHeightPx = root.scrollHeight;
      const zones = findKeepTogetherZones(root, geo.pageContentHeightPx * 0.4);
      const breaks = computePageBreaks(contentHeightPx, geo.pageContentHeightPx, zones);

      renderPages(doc, root, breaks, plan);
      if (cancelled) return;

      frame.style.height = `${
        breaks.length * geo.paperHeightPx + (breaks.length - 1) * PAGE_GAP_PX
      }px`;
      setRendered({ plan, pageCount: breaks.length });
    };

    void paginate();

    return () => {
      cancelled = true;
    };
  }, [plan]);

  return (
    <div className="paged-preview relative flex flex-col items-center gap-3">
      {/*
        The iframe must keep a layout box while measuring — `display: none`
        would leave its document without one and `scrollHeight` would read 0.
      */}
      <iframe
        ref={frameRef}
        title="Print preview"
        // allow-modals is what lets the print dialog open from inside the frame.
        sandbox="allow-same-origin allow-modals"
        style={{
          width: geometry.paperWidthPx,
          minHeight: geometry.paperHeightPx,
          border: 'none',
          colorScheme: 'light',
          opacity: isRendering ? 0 : 1,
        }}
      />

      {isRendering ? (
        <div className="absolute inset-x-0 top-16 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900" />
          <span className="ml-3 text-sm text-gray-500">Rendering pages...</span>
        </div>
      ) : (
        <div className="text-sm text-[var(--ui-text-muted)]">
          {rendered.pageCount} page{rendered.pageCount > 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}

/**
 * Chrome for the sheets themselves — only ever applied inside the preview
 * iframe, and the CSS the browser prints from.
 *
 * On screen the sheets are stacked with a gap and a drop shadow; in print each
 * one fills exactly one physical page. `@page { margin: 0 }` puts the sheet in
 * charge of its own margins, which are already baked into `.print-page-content`,
 * so the printed page lands on the same geometry as the preview.
 */
function buildPagedCss(geometry: ReturnType<typeof getPrintGeometry>, background: string): string {
  return `
@page {
  size: ${geometry.paperWidthMm}mm ${geometry.paperHeightMm}mm;
  margin: 0;
}
.print-page {
  position: relative;
  width: ${geometry.paperWidthPx}px;
  height: ${geometry.paperHeightPx}px;
  margin: 0 auto ${PAGE_GAP_PX}px;
  overflow: hidden;
  background-color: ${background};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.print-page:last-child { margin-bottom: 0; }
.print-page-content {
  position: absolute;
  top: ${mmToPx(geometry.contentTopMm)}px;
  left: ${mmToPx(geometry.marginLeftMm)}px;
  width: ${geometry.contentWidthPx}px;
  height: ${geometry.pageContentHeightPx}px;
  overflow: hidden;
}
.print-hf {
  position: absolute;
  height: ${mmToPx(HEADER_FOOTER_LINE_HEIGHT_MM)}px;
  line-height: ${mmToPx(HEADER_FOOTER_LINE_HEIGHT_MM)}px;
  font-size: ${(HEADER_FOOTER_FONT_SIZE_PT * 96) / 72}px;
  white-space: nowrap;
}
.print-hf-left { left: ${mmToPx(geometry.marginLeftMm)}px; }
.print-hf-right { right: ${mmToPx(geometry.marginRightMm)}px; }
.print-hf-center { left: 50%; transform: translateX(-50%); }

/* Last, so these win over the screen rules above at equal specificity. */
@media print {
  html, body { background: #fff; }
  .print-page {
    /* Sized in mm so a fractional pixel can't spill a blank page. */
    width: ${geometry.paperWidthMm}mm;
    height: ${geometry.paperHeightMm}mm;
    margin: 0;
    box-shadow: none;
    break-after: page;
    page-break-after: always;
    /* Without this the theme background is dropped unless the user ticks
       "Background graphics" in the print dialog. */
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .print-page:last-child {
    margin-bottom: 0;
    break-after: auto;
    page-break-after: auto;
  }
}
`;
}

interface RenderPagesContext {
  geometry: ReturnType<typeof getPrintGeometry>;
  settings: PrintSettings;
  docTitle: string;
  headerFooterColor: string;
}

/**
 * Turn the measured document into sheets.
 *
 * Each sheet holds a clone of the measured root shifted by its break offset, so
 * every page shows the exact slice the PDF exporter crops from the canvas.
 */
function renderPages(
  doc: Document,
  root: HTMLElement,
  breaks: number[],
  ctx: RenderPagesContext
): void {
  const { geometry, settings, docTitle, headerFooterColor } = ctx;
  const date = new Date().toLocaleDateString();

  const pages = doc.createElement('div');

  for (let page = 0; page < breaks.length; page++) {
    const sheet = doc.createElement('div');
    sheet.className = 'print-page';

    const vars = {
      title: docTitle,
      date,
      page: page + 1,
      pages: breaks.length,
    };

    if (settings.header.enabled) {
      appendHeaderFooter(doc, sheet, settings.header, vars, headerFooterColor, {
        top: mmToPx(geometry.marginTopMm + HEADER_BASELINE_OFFSET_MM - HEADER_FOOTER_LINE_HEIGHT_MM / 2),
      });
    }

    const viewport = doc.createElement('div');
    viewport.className = 'print-page-content';

    const slice = root.cloneNode(true) as HTMLElement;
    slice.style.transform = `translateY(-${breaks[page]}px)`;
    viewport.appendChild(slice);
    sheet.appendChild(viewport);

    if (settings.footer.enabled) {
      appendHeaderFooter(doc, sheet, settings.footer, vars, headerFooterColor, {
        top: mmToPx(
          geometry.paperHeightMm -
            geometry.marginBottomMm -
            FOOTER_BASELINE_OFFSET_MM -
            HEADER_FOOTER_LINE_HEIGHT_MM / 2
        ),
      });
    }

    pages.appendChild(sheet);
  }

  // Hide the measured root rather than removing it — the clones were taken
  // from it, and keeping it makes the measurement re-runnable.
  root.style.display = 'none';
  doc.body.appendChild(pages);
}

function appendHeaderFooter(
  doc: Document,
  sheet: HTMLElement,
  config: HeaderFooterConfig,
  vars: { title: string; date: string; page: number; pages: number },
  color: string,
  position: { top: number }
): void {
  (['left', 'center', 'right'] as const).forEach((align) => {
    const template = config[align];
    if (!template) return;

    const text = resolveTemplate(template, vars);
    if (!text) return;

    const el = doc.createElement('div');
    el.className = `print-hf print-hf-${align}`;
    el.style.cssText = `top: ${position.top}px; color: ${color};`;
    el.textContent = text;
    sheet.appendChild(el);
  });
}
