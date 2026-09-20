'use client';

import { useMemo, useRef } from 'react';
import { usePrintStore, useStyleStore } from '@/stores';
import { PrintSettings } from './PrintSettings';
import { HeaderFooter } from './HeaderFooter';
import { PagedPreview, type PagedPreviewHandle } from './PagedPreview';
import { getPrintGeometry } from '@/lib/print/printDocument';
import { showToast } from '@/components/ui/Toast';

interface PrintPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
}

export function PrintPreview({ isOpen, onClose, content }: PrintPreviewProps) {
  const settings = usePrintStore((state) => state.settings);
  const updateSettings = usePrintStore((state) => state.updateSettings);
  const updateHeader = usePrintStore((state) => state.updateHeader);
  const updateFooter = usePrintStore((state) => state.updateFooter);

  const globalStyles = useStyleStore((state) => state.globalStyles);

  const geometry = useMemo(() => getPrintGeometry(settings), [settings]);

  const previewRef = useRef<PagedPreviewHandle>(null);

  /**
   * Hand the paged preview to the browser's print pipeline.
   *
   * Printing and exporting a PDF are one action here, because the browser's
   * dialog offers a physical printer and "Save as PDF" as destinations of the
   * same operation. Printing the live document keeps the text as real text,
   * which rasterising it to an image could not.
   */
  const handlePrint = () => {
    if (!previewRef.current?.print()) {
      showToast('Still laying out pages — try again in a moment.', 'info');
    }
  };

  if (!isOpen) return null;

  // Scale factor for preview (fit in viewport)
  // Use a larger base size for better readability
  const scale = Math.min(
    600 / geometry.paperWidthPx,
    800 / geometry.paperHeightPx,
    0.8
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className="print-preview-backdrop fixed inset-0 z-40 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="print-preview-modal fixed inset-0 z-50 flex flex-col bg-[var(--background)] shadow-2xl md:inset-4 md:rounded-lg lg:inset-8 xl:inset-16">
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
                ref={previewRef}
                markdown={content}
                styles={globalStyles}
                settings={settings}
              />
            </div>

            {/* Paper info */}
            <div className="text-center mt-4 text-sm text-[var(--ui-text-muted)]">
              {settings.paperSize} • {settings.orientation} • {geometry.paperWidthMm} × {geometry.paperHeightMm} mm
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
        <div className="flex items-center justify-between gap-3 border-t border-[var(--ui-border)] px-4 py-3 md:px-6 md:py-4">
          <p className="hidden text-xs text-[var(--ui-text-muted)] sm:block">
            To export a file, pick “Save as PDF” as the destination.
          </p>
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={onClose}
              className="rounded border border-[var(--ui-border)] px-3 py-2 text-sm hover:bg-[var(--ui-bg-hover)] md:px-4"
            >
              Cancel
            </button>
            <button
              onClick={handlePrint}
              className="rounded border border-blue-600 bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700 md:px-4"
            >
              Print / Save PDF
            </button>
          </div>
        </div>
      </div>

    </>
  );
}

export default PrintPreview;
