/**
 * Turn rich text pasted from a web page — typically an answer copied out of
 * ChatGPT, Claude or Gemini — into Markdown.
 *
 * Browsers put both text/plain and text/html on the clipboard. The plain text
 * of a rendered answer has lost its headings, lists, tables and code fences,
 * so when the HTML carries that structure we convert it instead.
 */

import TurndownService from 'turndown';
import { tables, strikethrough, taskListItems } from 'turndown-plugin-gfm';

/** Elements whose presence means the HTML has structure worth keeping. */
const STRUCTURAL_TAG_RE = /<(h[1-6]|ul|ol|li|table|pre|blockquote|strong|b|em|code|a|hr)[\s>]/i;

/**
 * Plain text that is unmistakably Markdown source: ATX headings, code fences
 * or a table separator row. (List markers and "1." also occur in ordinary
 * prose, so they don't count.)
 */
const MARKDOWN_TEXT_RE = /(^|\n)(#{1,6} \S|```|\|?\s*:?-{3,}:?\s*\|)/;

/**
 * Whether a paste should be converted from HTML. Pastes without HTML, HTML
 * that is only styled text (code editors wrap every token in a span), and
 * plain text that is already Markdown all go in as plain text.
 */
export function shouldConvertHtml(html: string, plain: string): boolean {
  if (!html || !STRUCTURAL_TAG_RE.test(html)) return false;
  return !MARKDOWN_TEXT_RE.test(plain);
}

let service: TurndownService | null = null;

function getService(): TurndownService {
  if (service) return service;
  service = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-',
    emDelimiter: '*',
    hr: '---',
  });
  service.use([tables, strikethrough, taskListItems]);

  // Chat UIs put buttons, icons and screen-reader labels inside answers.
  service.remove(['button', 'script', 'style', 'noscript', 'title', 'meta', 'link']);
  service.remove((node) => node.nodeName.toLowerCase() === 'svg');

  // One space after the marker ("- item", "1. item") instead of turndown's
  // column-aligned "-   item"; nested content is indented to match.
  service.addRule('listItem', {
    filter: 'li',
    replacement: (content, node, options) => {
      const parent = node.parentNode as HTMLElement | null;
      let prefix = `${options.bulletListMarker} `;
      if (parent?.nodeName === 'OL') {
        const start = Number(parent.getAttribute('start') ?? 1);
        prefix = `${start + Array.prototype.indexOf.call(parent.children, node)}. `;
      }
      const body = content
        .replace(/^\n+/, '')
        .replace(/\n+$/, '\n')
        .replace(/\n(?=.)/g, `\n${' '.repeat(prefix.length)}`);
      return prefix + body + (node.nextSibling && !body.endsWith('\n') ? '\n' : '');
    },
  });

  // KaTeX keeps the LaTeX source in an annotation; restore it rather than
  // flattening the rendered glyphs.
  service.addRule('katex', {
    filter: (node) => node.nodeName === 'SPAN' && node.classList.contains('katex'),
    replacement: (_content, node) => {
      const tex = (node as HTMLElement)
        .querySelector('annotation[encoding="application/x-tex"]')
        ?.textContent?.trim();
      if (!tex) return (node as HTMLElement).textContent ?? '';
      const display = (node as HTMLElement).parentElement?.classList.contains('katex-display');
      return display ? `\n\n$$\n${tex}\n$$\n\n` : `$${tex}$`;
    },
  });

  // Chat UIs wrap the <code> of a code block in headers and toolbars, so the
  // stock rule (which wants <pre><code> exactly) misses it.
  service.addRule('fencedCode', {
    filter: (node) => node.nodeName === 'PRE',
    replacement: (_content, node) => {
      const pre = node as HTMLElement;
      const code = pre.querySelector('code');
      const text = (code ?? pre).textContent?.replace(/\n$/, '') ?? '';
      const language = code?.className.match(/language-([\w+#-]+)/)?.[1] ?? '';
      const longestFence = Math.max(2, ...(text.match(/`+/g) ?? []).map((run) => run.length));
      const fence = '`'.repeat(longestFence + 1);
      return `\n\n${fence}${language}\n${text}\n${fence}\n\n`;
    },
  });

  return service;
}

export function htmlToMarkdown(html: string): string {
  return getService()
    .turndown(html)
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
