'use client';

import { useMemo, useRef, useState } from 'react';
import { usePrintStore, useStyleStore, useEditorStore } from '@/stores';
import { PrintSettings } from './PrintSettings';
import { HeaderFooter } from './HeaderFooter';
import { PagedPreview } from './PagedPreview';
import { Preview } from '@/components/preview/Preview';
import { getPaperDimensions, mmToPx } from '@/lib/print/paperSizes';

interface PrintPreviewProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PrintPreview({ isOpen, onClose }: PrintPreviewProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const settings = usePrintStore((state) => state.settings);
  const updateSettings = usePrintStore((state) => state.updateSettings);
  const updateHeader = usePrintStore((state) => state.updateHeader);
  const updateFooter = usePrintStore((state) => state.updateFooter);

  const globalStyles = useStyleStore((state) => state.globalStyles);
  const content = useEditorStore((state) => state.content);

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
    if (!contentRef.current || isGeneratingPdf) return;

    setIsGeneratingPdf(true);

    try {
      const html2pdf = (await import('html2pdf.js')).default;

      const { width, height } = getPaperDimensions(settings.paperSize, settings.orientation);

      const opt = {
        margin: [
          settings.margins.top,
          settings.margins.right,
          settings.margins.bottom,
          settings.margins.left,
        ] as [number, number, number, number],
        filename: 'document.pdf',
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: {
          unit: 'mm' as const,
          format: [width, height] as [number, number],
          orientation: settings.orientation,
        },
      };

      await html2pdf().set(opt).from(contentRef.current).save();
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
                markdown={content || '# Preview\n\nYour content will appear here.'}
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

      {/* Hidden container for PDF generation */}
      <div
        ref={contentRef}
        className="fixed -left-[9999px] top-0 bg-white"
        style={{
          width: paperDimensions.width,
          padding: `${settings.margins.top}mm ${settings.margins.right}mm ${settings.margins.bottom}mm ${settings.margins.left}mm`,
        }}
      >
        <Preview
          markdown={content || '# Preview\n\nYour content will appear here.'}
          styles={globalStyles}
        />
      </div>
    </>
  );
}

export default PrintPreview;
