'use client';

import { useMemo } from 'react';
import { usePrintStore, useStyleStore, useEditorStore } from '@/stores';
import { PrintSettings } from './PrintSettings';
import { HeaderFooter } from './HeaderFooter';
import { Preview } from '@/components/preview/Preview';
import { getPaperDimensions, mmToPx } from '@/lib/print/paperSizes';

interface PrintPreviewProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PrintPreview({ isOpen, onClose }: PrintPreviewProps) {
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

  if (!isOpen) return null;

  // Scale factor for preview (fit in viewport)
  const scale = Math.min(
    400 / paperDimensions.width,
    600 / paperDimensions.height,
    1
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-4 z-50 flex flex-col rounded-lg bg-[var(--background)] shadow-2xl md:inset-8 lg:inset-16">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--ui-border)] px-6 py-4">
          <h2 className="text-lg font-semibold">Print Preview</h2>
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
        <div className="flex flex-1 overflow-hidden">
          {/* Preview area */}
          <div className="flex-1 overflow-auto bg-[var(--ui-bg-secondary)] p-8">
            <div className="flex items-center justify-center min-h-full">
              {/* Paper */}
              <div
                className="bg-white shadow-lg relative"
                style={{
                  width: paperDimensions.width * scale,
                  height: paperDimensions.height * scale,
                  transform: `scale(${scale})`,
                  transformOrigin: 'top center',
                }}
              >
                {/* Header preview */}
                {settings.header.enabled && (
                  <div
                    className="absolute top-0 left-0 right-0 flex justify-between text-[8px] text-gray-500 px-4 py-2"
                    style={{ fontSize: 8 * scale }}
                  >
                    <span>{settings.header.left.replace(/{title}/g, 'Document').replace(/{date}/g, new Date().toLocaleDateString())}</span>
                    <span>{settings.header.center}</span>
                    <span>{settings.header.right.replace(/{title}/g, 'Document').replace(/{date}/g, new Date().toLocaleDateString())}</span>
                  </div>
                )}

                {/* Content area with margins */}
                <div
                  className="overflow-hidden"
                  style={{
                    position: 'absolute',
                    top: settings.margins.top * (96 / 25.4) * scale,
                    left: settings.margins.left * (96 / 25.4) * scale,
                    right: settings.margins.right * (96 / 25.4) * scale,
                    bottom: settings.margins.bottom * (96 / 25.4) * scale,
                  }}
                >
                  <div style={{ transform: `scale(${scale * 0.5})`, transformOrigin: 'top left' }}>
                    <Preview
                      markdown={content || '# Preview\n\nYour content will appear here.'}
                      styles={globalStyles}
                    />
                  </div>
                </div>

                {/* Footer preview */}
                {settings.footer.enabled && (
                  <div
                    className="absolute bottom-0 left-0 right-0 flex justify-between text-[8px] text-gray-500 px-4 py-2"
                    style={{ fontSize: 8 * scale }}
                  >
                    <span>{settings.footer.left}</span>
                    <span>{settings.footer.center.replace(/{page}/g, '1').replace(/{pages}/g, '1')}</span>
                    <span>{settings.footer.right}</span>
                  </div>
                )}

                {/* Margin guides (subtle) */}
                <div
                  className="absolute border border-dashed border-blue-200 pointer-events-none"
                  style={{
                    top: settings.margins.top * (96 / 25.4) * scale,
                    left: settings.margins.left * (96 / 25.4) * scale,
                    right: settings.margins.right * (96 / 25.4) * scale,
                    bottom: settings.margins.bottom * (96 / 25.4) * scale,
                  }}
                />
              </div>
            </div>

            {/* Paper info */}
            <div className="text-center mt-4 text-sm text-[var(--ui-text-muted)]">
              {settings.paperSize} • {settings.orientation} • {paperDimensions.widthMm} × {paperDimensions.heightMm} mm
            </div>
          </div>

          {/* Settings panel */}
          <div className="w-80 border-l border-[var(--ui-border)] overflow-y-auto">
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
        <div className="flex items-center justify-end gap-3 border-t border-[var(--ui-border)] px-6 py-4">
          <button
            onClick={onClose}
            className="rounded border border-[var(--ui-border)] px-4 py-2 text-sm hover:bg-[var(--ui-bg-hover)]"
          >
            Cancel
          </button>
          <button
            onClick={handlePrint}
            className="rounded bg-[var(--foreground)] px-4 py-2 text-sm text-[var(--background)] hover:opacity-90"
          >
            Print
          </button>
        </div>
      </div>
    </>
  );
}

export default PrintPreview;
