'use client';

import { useCallback, useRef } from 'react';
import { Editor } from './Editor';
import { Toolbar } from './Toolbar';
import type { ToolbarAction } from '@/types/editor';

interface EditorPanelProps {
  value: string;
  onChange: (value: string) => void;
}

const toolbarActions: Record<ToolbarAction, { before: string; after: string }> = {
  bold: { before: '**', after: '**' },
  italic: { before: '_', after: '_' },
  h1: { before: '# ', after: '' },
  h2: { before: '## ', after: '' },
  h3: { before: '### ', after: '' },
  link: { before: '[', after: '](url)' },
  image: { before: '![alt](', after: ')' },
  code: { before: '`', after: '`' },
  codeblock: { before: '```\n', after: '\n```' },
  hr: { before: '\n---\n', after: '' },
  quote: { before: '> ', after: '' },
  ul: { before: '- ', after: '' },
  ol: { before: '1. ', after: '' },
};

export function EditorPanel({ value, onChange }: EditorPanelProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  const handleToolbarAction = useCallback((action: ToolbarAction) => {
    const { before, after } = toolbarActions[action];

    // Find the editor container and get the insertText function
    const editorContainer = editorRef.current?.querySelector('[data-insert-text]');
    if (editorContainer) {
      const insertText = (editorContainer as HTMLElement).dataset.insertText;
      // For now, we'll use a different approach - modify the value directly
      // This is a simplified version; the full implementation would use CodeMirror's API
    }

    // Fallback: append to the end (will be improved in production)
    const { before: b, after: a } = toolbarActions[action];
    if (action === 'hr') {
      onChange(value + b);
    } else {
      // For inline actions, we'd ideally use the selection
      // For now, just append a template
      onChange(value + '\n' + b + (a ? 'text' + a : ''));
    }
  }, [value, onChange]);

  return (
    <div ref={editorRef} className="flex h-full flex-col">
      <div className="flex h-10 items-center border-b border-[var(--ui-border)]">
        <Toolbar onAction={handleToolbarAction} />
      </div>
      <div className="flex-1 overflow-hidden">
        <Editor value={value} onChange={onChange} />
      </div>
    </div>
  );
}

export default EditorPanel;
