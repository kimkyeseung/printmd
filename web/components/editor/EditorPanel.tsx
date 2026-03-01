'use client';

import { useCallback, useRef } from 'react';
import { Editor, type EditorRef } from './Editor';
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
  const editorRef = useRef<EditorRef>(null);

  const handleToolbarAction = useCallback((action: ToolbarAction) => {
    const { before, after } = toolbarActions[action];

    if (editorRef.current) {
      editorRef.current.insertText(before, after);
    }
  }, []);

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-10 items-center border-b border-[var(--ui-border)]">
        <Toolbar onAction={handleToolbarAction} />
      </div>
      <div className="flex-1 overflow-hidden">
        <Editor ref={editorRef} value={value} onChange={onChange} />
      </div>
    </div>
  );
}

export default EditorPanel;
