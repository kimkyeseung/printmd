'use client';

import { memo } from 'react';
import { Preview } from './Preview';
import type { GlobalStyles } from '@/types/style';
import { useAppStrings } from '@/lib/i18n/appStrings';
import { usePrintStore, useStyleStore } from '@/stores';
import { getPrintGeometry } from '@/lib/print/printDocument';
import { printMatchedWidth } from '@/lib/styles/previewWidth';

interface PreviewPanelProps {
  markdown: string;
  styles: GlobalStyles;
  sourceUrl?: string | null;
}

export const PreviewPanel = memo(function PreviewPanel({ markdown, styles, sourceUrl }: PreviewPanelProps) {
  const t = useAppStrings().previewPanel;
  const printSettings = usePrintStore((state) => state.settings);
  const updateGlobalStyles = useStyleStore((state) => state.updateGlobalStyles);

  const printWidth = printMatchedWidth(getPrintGeometry(printSettings).contentWidthPx, styles.padding);
  const isPrintWidth = styles.maxWidth === printWidth;

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex h-10 items-center justify-between border-b border-[var(--ui-border)] px-3">
        <span className="text-sm text-[var(--ui-text-muted)]">{t.title}</span>
        <div className="flex items-center gap-3">
          {sourceUrl && (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[var(--printmd-link-color)] hover:underline"
            >
              {t.source}
            </a>
          )}
          <button
            type="button"
            aria-pressed={isPrintWidth}
            title={t.printWidthHint}
            onClick={() => updateGlobalStyles({ maxWidth: printWidth })}
            className={`hidden rounded border px-2 py-0.5 text-xs md:block ${
              isPrintWidth
                ? 'border-[var(--printmd-link-color)] text-[var(--printmd-link-color)]'
                : 'border-[var(--ui-border)] text-[var(--ui-text-muted)] hover:bg-[var(--ui-bg-hover)]'
            }`}
          >
            {t.printWidth}
          </button>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden">
        <Preview markdown={markdown} styles={styles} />
      </div>
    </div>
  );
});

export default PreviewPanel;
