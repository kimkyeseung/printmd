import { HighlightStyle } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';

/**
 * Markdown highlighting for the editor, in both app themes.
 *
 * CodeMirror's defaultHighlightStyle hardcodes colors picked for a light
 * background, so on the dark theme the code-fence info string (```js) came
 * out dark blue on near-black, and it underlines every heading. Colors here
 * are CSS variables from styles/editor.css, which flip with `.dark`.
 */
export const markdownHighlightStyle = HighlightStyle.define([
  { tag: t.heading, fontWeight: '700', color: 'var(--cm-heading)' },
  { tag: t.strong, fontWeight: '700' },
  { tag: t.emphasis, fontStyle: 'italic' },
  { tag: t.strikethrough, textDecoration: 'line-through' },
  { tag: t.link, color: 'var(--cm-link)' },
  { tag: t.url, color: 'var(--cm-muted)', textDecoration: 'underline' },
  { tag: t.monospace, color: 'var(--cm-code)' },
  { tag: t.quote, color: 'var(--cm-muted)', fontStyle: 'italic' },
  // Markup characters: #, **, _, ```, >, list bullets
  { tag: [t.processingInstruction, t.meta, t.contentSeparator], color: 'var(--cm-muted)' },
  // Code fence info string (```js) and link labels
  { tag: t.labelName, color: 'var(--cm-label)' },
]);
