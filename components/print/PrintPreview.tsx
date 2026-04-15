'use client';

import { useMemo, useState } from 'react';
import { usePrintStore, useStyleStore } from '@/stores';
import { PrintSettings } from './PrintSettings';
import { HeaderFooter } from './HeaderFooter';
import { PagedPreview } from './PagedPreview';
import { getPaperDimensions, mmToPx } from '@/lib/print/paperSizes';
import { parseMarkdown } from '@/lib/markdown/parser';
import { sanitizeHtml } from '@/lib/markdown/sanitizer';
import { getPdfStyles } from '@/lib/print/pdfStyles';
import { generateElementStylesCss } from '@/lib/themes';
import {
  resolveTemplate,
  extractTitle,
  renderTextToImage,
  calcAlignedX,
} from '@/lib/print/pdfTextRenderer';
import { findKeepTogetherZones, computePageBreaks } from '@/lib/print/pageBreaks';

interface PrintPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
}

export function PrintPreview({ isOpen, onClose, content }: PrintPreviewProps) {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const settings = usePrintStore((state) => state.settings);
  const updateSettings = usePrintStore((state) => state.updateSettings);
  const updateHeader = usePrintStore((state) => state.updateHeader);
  const updateFooter = usePrintStore((state) => state.updateFooter);

  const globalStyles = useStyleStore((state) => state.globalStyles);
  const elementStyles = useStyleStore((state) => state.elementStyles);

  const paperDimensions = useMemo(() => {
    const { width, height } = getPaperDimensions(settings.paperSize, settings.orientation);
    return {
      width: mmToPx(width),
      height: mmToPx(height),
      widthMm: width,
      heightMm: height,
    };
  }, [settings.paperSize, settings.orientation]);

  const handlePrint = () => {
    window.print();
    onClose();
  };

  const handleSavePdf = async () => {
    if (isGeneratingPdf) return;

    setIsGeneratingPdf(true);

    try {
      const html2canvasModule = await import('html2canvas');
      const html2canvas = html2canvasModule.default;
      const { jsPDF } = await import('jspdf');

      const { width, height } = getPaperDimensions(settings.paperSize, settings.orientation);
      const marginTop = settings.margins.top;
      const marginRight = settings.margins.right;
      const marginBottom = settings.margins.bottom;
      const marginLeft = settings.margins.left;
      const contentWidthMm = width - marginLeft - marginRight;

      // Resolve colours based on includeBackground setting
      const bgColor = settings.includeBackground ? globalStyles.backgroundColor : '#ffffff';
      const textColor = settings.includeBackground ? globalStyles.textColor : '#1a1a1a';
      const linkColor = settings.includeBackground ? globalStyles.linkColor : '#0366d6';
      const codeBg = settings.includeBackground ? globalStyles.codeBackground : '#f5f5f5';

      const htmlContent = sanitizeHtml(parseMarkdown(content));

      // Generate theme-aware styles
      const pdfBaseStyles = getPdfStyles({
        linkColor,
        codeBackground: codeBg,
        textColor,
      });
      const elementCss = settings.includeBackground
        ? generateElementStylesCss(elementStyles)
        : '';

      // Build a self-contained HTML container with inline <style>
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '0px';
      container.style.top = '0px';
      container.style.zIndex = '-1';
      container.style.pointerEvents = 'none';
      container.style.width = `${mmToPx(contentWidthMm)}px`;
      container.style.backgroundColor = bgColor;
      container.style.color = textColor;
      container.style.fontFamily = globalStyles.fontFamily;
      container.style.fontSize = `${globalStyles.fontSize}px`;
      container.style.lineHeight = String(globalStyles.lineHeight);
      container.style.padding = '0';

      // Embed base + element styles so html2canvas can apply them
      // Element styles come after base so preset overrides take priority
      container.innerHTML = `<style>${pdfBaseStyles}\n${elementCss}</style><div class="preview-content">${htmlContent}</div>`;

      document.body.appendChild(container);

      // Wait for fonts/images to load
      await new Promise((r) => setTimeout(r, 300));

      // Scan DOM for keep-together zones before rendering to canvas
      const pageContentHeightPx = mmToPx(
        height - marginTop - marginBottom - (settings.header.enabled ? 5 : 0) - (settings.footer.enabled ? 5 : 0)
      );
      const maxZoneHeight = pageContentHeightPx * 0.4;
      const keepZones = findKeepTogetherZones(container, maxZoneHeight);
      const containerHeightPx = container.scrollHeight;

      // Render to canvas
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        backgroundColor: bgColor,
        width: container.scrollWidth,
        height: container.scrollHeight,
      });

      document.body.removeChild(container);

      // Create PDF
      const pdf = new jsPDF({
        orientation: settings.orientation,
        unit: 'mm',
        format: [width, height],
      });

      const docTitle = extractTitle(content);
      const docDate = new Date().toLocaleDateString();
      const headerFooterFontSize = 9;
      const hfColor = settings.includeBackground ? textColor : '#666666';
      const hfFontFamily = globalStyles.fontFamily;
      // Reserve space for header/footer text within margins
      const headerHeight = settings.header.enabled ? 5 : 0;
      const footerHeight = settings.footer.enabled ? 5 : 0;

      const pageContentHeight = height - marginTop - marginBottom - headerHeight - footerHeight;
      const contentTopMm = marginTop + headerHeight;
      const imgWidthMm = contentWidthMm;
      const imgHeightMm = (canvas.height / canvas.width) * imgWidthMm;

      // Compute smart page breaks that avoid splitting tables / headings
      const pageBreaksPx = computePageBreaks(containerHeightPx, pageContentHeightPx, keepZones);
      const pxToMm = imgHeightMm / (canvas.height / 2); // canvas scale = 2
      const totalPages = pageBreaksPx.length;

      // Add image, handling multiple pages
      for (let page = 0; page < totalPages; page++) {
        if (page > 0) {
          pdf.addPage();
        }

        const pageNum = page + 1;

        // Fill page background
        if (settings.includeBackground && bgColor !== '#ffffff') {
          pdf.setFillColor(bgColor);
          pdf.rect(0, 0, width, height, 'F');
        }

        // Calculate source crop for this page using smart break points
        const breakStartPx = pageBreaksPx[page];
        const breakEndPx = page + 1 < totalPages ? pageBreaksPx[page + 1] : containerHeightPx;
        const segmentPx = breakEndPx - breakStartPx;

        const canvasScale = 2;
        const sourceY = breakStartPx * canvasScale;
        const sourceH = Math.min(segmentPx * canvasScale, canvas.height - sourceY);
        const drawHeight = segmentPx * pxToMm;

        // Create a cropped canvas for this page
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = sourceH;
        const ctx = pageCanvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
          ctx.drawImage(
            canvas,
            0, sourceY, canvas.width, sourceH,
            0, 0, pageCanvas.width, sourceH
          );
        }

        // Use JPEG (quality 0.92) instead of PNG to reduce file size drastically
        // (e.g. 54 MB → ~3 MB for an 8-page text document)
        const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.92);
        pdf.addImage(pageImgData, 'JPEG', marginLeft, contentTopMm, imgWidthMm, drawHeight);

        // Render header / footer as canvas images (supports CJK characters)
        const templateVars = { title: docTitle, date: docDate, page: pageNum, pages: totalPages };

        const addHFText = (
          tpl: string,
          align: 'left' | 'center' | 'right',
          yMm: number
        ) => {
          const resolved = resolveTemplate(tpl, templateVars);
          const img = renderTextToImage(resolved, headerFooterFontSize, hfColor, hfFontFamily);
          if (!img) return;
          const x = calcAlignedX(align, img.widthMm, width, marginLeft, marginRight);
          const y = yMm - img.heightMm / 2;
          pdf.addImage(img.dataUrl, 'PNG', x, y, img.widthMm, img.heightMm);
        };

        if (settings.header.enabled) {
          const headerY = marginTop + 3;
          if (settings.header.left) addHFText(settings.header.left, 'left', headerY);
          if (settings.header.center) addHFText(settings.header.center, 'center', headerY);
          if (settings.header.right) addHFText(settings.header.right, 'right', headerY);
        }

        if (settings.footer.enabled) {
          const footerY = height - marginBottom - 1;
          if (settings.footer.left) addHFText(settings.footer.left, 'left', footerY);
          if (settings.footer.center) addHFText(settings.footer.center, 'center', footerY);
          if (settings.footer.right) addHFText(settings.footer.right, 'right', footerY);
        }

      }

      pdf.save('document.pdf');
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (!isOpen) return null;

  // Scale factor for preview (fit in viewport)
  // Use a larger base size for better readability
  const scale = Math.min(
    600 / paperDimensions.width,
    800 / paperDimensions.height,
    0.8
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex flex-col bg-[var(--background)] shadow-2xl md:inset-4 md:rounded-lg lg:inset-8 xl:inset-16">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--ui-border)] px-4 py-3 md:px-6 md:py-4">
          <h2 className="text-base font-semibold md:text-lg">Print Preview</h2>
          <button
            onClick={onClose}
            className="rounded p-1 hover:bg-[var(--ui-bg-hover)]"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
          {/* Preview area */}
          <div className="flex-1 overflow-auto bg-[var(--ui-bg-secondary)] p-4 md:p-8">
            <div
              style={{
                transform: `scale(${scale})`,
                transformOrigin: 'top center',
              }}
            >
              <PagedPreview
                markdown={content}
                styles={globalStyles}
                settings={settings}
                paperWidth={paperDimensions.width}
                paperHeight={paperDimensions.height}
              />
            </div>

            {/* Paper info */}
            <div className="text-center mt-4 text-sm text-[var(--ui-text-muted)]">
              {settings.paperSize} • {settings.orientation} • {paperDimensions.widthMm} × {paperDimensions.heightMm} mm
            </div>
          </div>

          {/* Settings panel - horizontal on mobile, sidebar on desktop */}
          <div className="border-t border-[var(--ui-border)] overflow-y-auto md:w-80 md:border-l md:border-t-0">
            <div className="p-4 space-y-6">
              <PrintSettings
                settings={settings}
                onChange={updateSettings}
              />

              <div className="border-t border-[var(--ui-border)] pt-4">
                <HeaderFooter
                  header={settings.header}
                  footer={settings.footer}
                  onHeaderChange={updateHeader}
                  onFooterChange={updateFooter}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-[var(--ui-border)] px-4 py-3 md:gap-3 md:px-6 md:py-4">
          <button
            onClick={onClose}
            className="rounded border border-[var(--ui-border)] px-3 py-2 text-sm hover:bg-[var(--ui-bg-hover)] md:px-4"
          >
            Cancel
          </button>
          <button
            onClick={handleSavePdf}
            disabled={isGeneratingPdf}
            className="rounded border border-blue-600 bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50 md:px-4"
          >
            {isGeneratingPdf ? 'Generating...' : 'Save PDF'}
          </button>
          <button
            onClick={handlePrint}
            className="rounded bg-[var(--foreground)] px-3 py-2 text-sm text-[var(--background)] hover:opacity-90 md:px-4"
          >
            Print
          </button>
        </div>
      </div>

    </>
  );
}

export default PrintPreview;
