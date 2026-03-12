import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import css from 'highlight.js/lib/languages/css';
import xml from 'highlight.js/lib/languages/xml';
import json from 'highlight.js/lib/languages/json';
import bash from 'highlight.js/lib/languages/bash';
import markdown from 'highlight.js/lib/languages/markdown';
import sql from 'highlight.js/lib/languages/sql';
import java from 'highlight.js/lib/languages/java';
import go from 'highlight.js/lib/languages/go';
import rust from 'highlight.js/lib/languages/rust';
import yaml from 'highlight.js/lib/languages/yaml';
import diff from 'highlight.js/lib/languages/diff';
import plaintext from 'highlight.js/lib/languages/plaintext';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('ts', typescript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('py', python);
hljs.registerLanguage('css', css);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('json', json);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('shell', bash);
hljs.registerLanguage('sh', bash);
hljs.registerLanguage('markdown', markdown);
hljs.registerLanguage('md', markdown);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('java', java);
hljs.registerLanguage('go', go);
hljs.registerLanguage('rust', rust);
hljs.registerLanguage('yaml', yaml);
hljs.registerLanguage('yml', yaml);
hljs.registerLanguage('diff', diff);
hljs.registerLanguage('plaintext', plaintext);
hljs.registerLanguage('text', plaintext);

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
  breaks: true,
  highlight: (str: string, lang: string): string => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code class="language-${lang}">${
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
        }</code></pre>`;
      } catch {
        // Fallback to plain code block
      }
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
  },
});

// CJK emphasis fix: markdown-it's CommonMark delimiter scanner treats CJK
// characters as "letters", so emphasis markers (**) adjacent to CJK text fail
// to open/close. We patch scanDelims to treat CJK chars as punctuation, which
// allows delimiters to work at CJK word boundaries.
const CJK_RE = /[\u3000-\u9fff\uac00-\ud7af\uf900-\ufaff]/;

function cjkEmphasisPlugin(mdi: MarkdownIt) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const StateInline = (mdi as any).inline.State;
  const origScanDelims = StateInline.prototype.scanDelims;

  StateInline.prototype.scanDelims = function (start: number, canSplitWord: boolean) {
    // Temporarily replace CJK chars adjacent to the delimiter run with a
    // punctuation character ('.') so the original scanner sees a word boundary.
    const origSrc = this.src;
    const max = this.posMax;

    // Find the delimiter run length
    const marker = origSrc.charCodeAt(start);
    let pos = start;
    while (pos < max && origSrc.charCodeAt(pos) === marker) pos++;

    // Check chars before start and after the run
    const charBefore = start > 0 ? origSrc.charAt(start - 1) : '';
    const charAfter = pos < max ? origSrc.charAt(pos) : '';

    let modified = false;
    let src = origSrc;
    if (charBefore && CJK_RE.test(charBefore)) {
      src = src.substring(0, start - 1) + '.' + src.substring(start);
      modified = true;
    }
    if (charAfter && CJK_RE.test(charAfter)) {
      src = src.substring(0, pos) + '.' + src.substring(pos + 1);
      modified = true;
    }

    if (modified) {
      this.src = src;
    }

    const result = origScanDelims.call(this, start, canSplitWord);

    if (modified) {
      this.src = origSrc;
    }

    return result;
  };
}

md.use(cjkEmphasisPlugin);

// Add target="_blank" to external links
const defaultRender =
  md.renderer.rules.link_open ||
  function (tokens, idx, options, _env, self) {
    return self.renderToken(tokens, idx, options);
  };

md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  const href = tokens[idx].attrGet('href');
  if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
    tokens[idx].attrSet('target', '_blank');
    tokens[idx].attrSet('rel', 'noopener noreferrer');
  }
  return defaultRender(tokens, idx, options, env, self);
};

export function parseMarkdown(content: string): string {
  return md.render(content);
}

export { md };
