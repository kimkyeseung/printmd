'use client';

import { memo } from 'react';
import type { ToolbarProps, ToolbarAction } from '@/types/editor';
import { useAppStrings } from '@/lib/i18n/appStrings';

interface ToolbarButton {
  action: ToolbarAction;
  icon: string;
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
  { action: 'link', icon: '🔗' },
  { action: 'image', icon: '🖼' },
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
    <div className="flex items-center gap-0.5 px-2 overflow-x-auto">
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
