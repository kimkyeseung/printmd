'use client';

import { memo } from 'react';
import { Preview } from './Preview';
import type { GlobalStyles } from '@/types/style';
import { useAppStrings } from '@/lib/i18n/appStrings';

interface PreviewPanelProps {
  markdown: string;
  styles: GlobalStyles;
  sourceUrl?: string | null;
}

export const PreviewPanel = memo(function PreviewPanel({ markdown, styles, sourceUrl }: PreviewPanelProps) {
  const t = useAppStrings().previewPanel;
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex h-10 items-center justify-between border-b border-[var(--ui-border)] px-3">
        <span className="text-sm text-[var(--ui-text-muted)]">{t.title}</span>
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
      </div>
      <div className="min-h-0 flex-1 overflow-hidden">
        <Preview markdown={markdown} styles={styles} />
      </div>
    </div>
  );
});

export default PreviewPanel;
