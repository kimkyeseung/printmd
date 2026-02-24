'use client';

import { useEffect, useRef, useCallback } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, lineNumbers, highlightActiveLineGutter, highlightSpecialChars, drawSelection, highlightActiveLine } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { markdown } from '@codemirror/lang-markdown';
import { syntaxHighlighting, defaultHighlightStyle, indentOnInput, bracketMatching } from '@codemirror/language';
import type { EditorProps } from '@/types/editor';

export function Editor({ value, onChange }: EditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);

  // Keep onChange ref updated
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        const newValue = update.state.doc.toString();
        onChangeRef.current(newValue);
      }
    });

    const state = EditorState.create({
      doc: value,
      extensions: [
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightSpecialChars(),
        history(),
        drawSelection(),
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

  return (
    <div
      ref={containerRef}
      className="h-full w-full overflow-hidden"
      data-insert-text={insertText}
    />
  );
}

export default Editor;
