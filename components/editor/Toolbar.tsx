'use client';

import { memo, type ReactNode } from 'react';
import type { ToolbarProps, ToolbarAction } from '@/types/editor';
import { useAppStrings } from '@/lib/i18n/appStrings';

interface ToolbarButton {
  action: ToolbarAction;
  icon: ReactNode;
  shortcut?: string;
}

const toolbarButtons: (ToolbarButton | 'separator')[] = [
  { action: 'bold', icon: 'B', shortcut: 'Ctrl+B' },
  { action: 'italic', icon: 'I', shortcut: 'Ctrl+I' },
  'separator',
  { action: 'h1', icon: 'H1' },
  { action: 'h2', icon: 'H2' },
  { action: 'h3', icon: 'H3' },
  'separator',
  {
    action: 'link',
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
  },
  {
    action: 'image',
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  'separator',
  { action: 'code', icon: '</>' },
  { action: 'codeblock', icon: '{ }' },
  'separator',
  { action: 'ul', icon: '•' },
  { action: 'ol', icon: '1.' },
  { action: 'quote', icon: '"' },
  { action: 'hr', icon: '—' },
];

export const Toolbar = memo(function Toolbar({ onAction }: ToolbarProps) {
  const labels = useAppStrings().editor.toolbar;
  return (
    <div className="flex items-center gap-0.5 px-2 overflow-x-auto scrollbar-none">
      {toolbarButtons.map((item, index) => {
        if (item === 'separator') {
          return (
            <div
              key={`sep-${index}`}
              className="mx-1 h-5 w-px flex-shrink-0 bg-[var(--ui-border)]"
            />
          );
        }

        const label = labels[item.action];
        return (
          <button
            key={item.action}
            onClick={() => onAction(item.action)}
            className="flex h-7 min-w-7 flex-shrink-0 items-center justify-center rounded px-1.5 text-sm font-medium hover:bg-[var(--ui-bg-hover)] active:bg-[var(--ui-border)]"
            title={item.shortcut ? `${label} (${item.shortcut})` : label}
            aria-label={label}
            type="button"
          >
            {item.icon}
          </button>
        );
      })}
    </div>
  );
});

export default Toolbar;
