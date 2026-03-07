'use client';

import type { ToolbarProps, ToolbarAction } from '@/types/editor';

interface ToolbarButton {
  action: ToolbarAction;
  label: string;
  icon: string;
  shortcut?: string;
}

const toolbarButtons: (ToolbarButton | 'separator')[] = [
  { action: 'bold', label: 'Bold', icon: 'B', shortcut: 'Ctrl+B' },
  { action: 'italic', label: 'Italic', icon: 'I', shortcut: 'Ctrl+I' },
  'separator',
  { action: 'h1', label: 'Heading 1', icon: 'H1' },
  { action: 'h2', label: 'Heading 2', icon: 'H2' },
  { action: 'h3', label: 'Heading 3', icon: 'H3' },
  'separator',
  { action: 'link', label: 'Link', icon: '🔗' },
  { action: 'image', label: 'Image', icon: '🖼' },
  'separator',
  { action: 'code', label: 'Inline Code', icon: '</>' },
  { action: 'codeblock', label: 'Code Block', icon: '{ }' },
  'separator',
  { action: 'ul', label: 'Bullet List', icon: '•' },
  { action: 'ol', label: 'Numbered List', icon: '1.' },
  { action: 'quote', label: 'Quote', icon: '"' },
  { action: 'hr', label: 'Horizontal Rule', icon: '—' },
];

export function Toolbar({ onAction }: ToolbarProps) {
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

        return (
          <button
            key={item.action}
            onClick={() => onAction(item.action)}
            className="flex h-7 min-w-7 flex-shrink-0 items-center justify-center rounded px-1.5 text-sm font-medium hover:bg-[var(--ui-bg-hover)] active:bg-[var(--ui-border)]"
            title={item.shortcut ? `${item.label} (${item.shortcut})` : item.label}
            type="button"
          >
            {item.icon}
          </button>
        );
      })}
    </div>
  );
}

export default Toolbar;
