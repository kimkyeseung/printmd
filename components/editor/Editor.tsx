'use client';

import { memo, useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from 'react';
import { EditorState, type Transaction } from '@codemirror/state';
import { indentUnit } from '@codemirror/language';
import { EditorView, keymap, lineNumbers, highlightActiveLineGutter, highlightSpecialChars, drawSelection, highlightActiveLine } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { markdown } from '@codemirror/lang-markdown';
import { syntaxHighlighting, defaultHighlightStyle, indentOnInput, bracketMatching } from '@codemirror/language';
import type { EditorProps } from '@/types/editor';

export interface EditorRef {
  insertText: (before: string, after?: string) => void;
}

export const Editor = memo(forwardRef<EditorRef, EditorProps>(function Editor({ value, onChange }, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  const lastExternalValueRef = useRef(value);

  // Keep onChange ref updated
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        const newValue = update.state.doc.toString();
        lastExternalValueRef.current = newValue;
        onChangeRef.current(newValue);
      }
    });

    // Auto-convert `[ ] ` or `[x] ` at line start to `- [ ] ` or `- [x] `
    const checkboxTransactionFilter = EditorState.transactionFilter.of((tr: Transaction) => {
      if (!tr.docChanged) return tr;
      const changes: { from: number; to: number; insert: string }[] = [];
      tr.changes.iterChanges((fromA, toA, _fromB, _toB, inserted) => {
        const insertedText = inserted.toString();
        // Only trigger on single-char inserts (typing space after `[ ]` or `[x]`)
        if (insertedText !== ' ') return;
        const doc = tr.newDoc;
        const pos = fromA + 1; // position after inserted space
        const lineObj = doc.lineAt(pos);
        const lineText = lineObj.text;
        // Check if line now starts with `[ ] ` or `[x] ` (without `- ` prefix)
        const match = lineText.match(/^(\s*)\[( |x|X)\] $/);
        if (match && !lineText.match(/^(\s*)- \[/)) {
          const indent = match[1];
          const check = match[2];
          changes.push({
            from: lineObj.from,
            to: lineObj.from + lineText.length,
            insert: `${indent}- [${check}] `,
          });
        }
      });
      if (changes.length > 0) {
        return [tr, { changes, sequential: true }];
      }
      return tr;
    });

    const state = EditorState.create({
      doc: value,
      extensions: [
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightSpecialChars(),
        history(),
        drawSelection(),
        indentUnit.of('    '),
        indentOnInput(),
        bracketMatching(),
        highlightActiveLine(),
        syntaxHighlighting(defaultHighlightStyle),
        markdown(),
        keymap.of([
          ...defaultKeymap,
          ...historyKeymap,
          indentWithTab,
        ]),
        updateListener,
        checkboxTransactionFilter,
        EditorView.lineWrapping,
        EditorView.theme({
          '&': {
            height: '100%',
            fontSize: '14px',
          },
          '.cm-scroller': {
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
            overflow: 'auto',
          },
          '.cm-content': {
            padding: '16px 0',
          },
          '.cm-line': {
            padding: '0 16px',
          },
          '.cm-gutters': {
            backgroundColor: 'transparent',
            border: 'none',
            color: 'var(--ui-text-muted)',
          },
          '.cm-activeLineGutter': {
            backgroundColor: 'transparent',
          },
          '.cm-activeLine': {
            backgroundColor: 'var(--ui-bg-hover)',
          },
          '&.cm-focused .cm-cursor': {
            borderLeftColor: 'var(--foreground)',
          },
          '&.cm-focused .cm-selectionBackground, ::selection': {
            backgroundColor: 'rgba(0, 102, 204, 0.2)',
          },
        }),
      ],
    });

    const view = new EditorView({
      state,
      parent: containerRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, []);

  // Update editor content when value changes externally
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    // Skip if value came from user typing (avoids O(n) doc.toString())
    if (lastExternalValueRef.current === value) return;
    lastExternalValueRef.current = value;

    const currentValue = view.state.doc.toString();
    if (currentValue !== value) {
      view.dispatch({
        changes: {
          from: 0,
          to: currentValue.length,
          insert: value,
        },
      });
    }
  }, [value]);

  const insertText = useCallback((before: string, after: string = '') => {
    const view = viewRef.current;
    if (!view) return;

    const { from, to } = view.state.selection.main;
    const selectedText = view.state.sliceDoc(from, to);
    const newText = `${before}${selectedText}${after}`;

    view.dispatch({
      changes: { from, to, insert: newText },
      selection: {
        anchor: from + before.length,
        head: from + before.length + selectedText.length,
      },
    });
    view.focus();
  }, []);

  useImperativeHandle(ref, () => ({
    insertText,
  }), [insertText]);

  return (
    <div
      ref={containerRef}
      className="h-full w-full overflow-hidden"
    />
  );
}));

export default Editor;
