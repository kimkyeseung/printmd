'use client';

import { Preview } from './Preview';
import type { GlobalStyles } from '@/types/style';

interface PreviewPanelProps {
  markdown: string;
  styles: GlobalStyles;
  sourceUrl?: string | null;
}

export function PreviewPanel({ markdown, styles, sourceUrl }: PreviewPanelProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-10 items-center justify-between border-b border-[var(--ui-border)] px-3">
        <span className="text-sm text-[var(--ui-text-muted)]">Preview</span>
        {sourceUrl && (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[var(--printmd-link-color)] hover:underline"
          >
            Source
          </a>
        )}
      </div>
      <div className="min-h-0 flex-1 overflow-hidden">
        <Preview markdown={markdown} styles={styles} />
      </div>
    </div>
  );
}

export default PreviewPanel;
