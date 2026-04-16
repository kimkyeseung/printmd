import MarkdownIt from 'markdown-it';
import { hljs } from './hljs';

const md = new MarkdownIt({
  html: true,
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

// Task list plugin: converts `- [ ]` / `- [x]` into checkboxes
function taskListPlugin(mdi: MarkdownIt) {
  mdi.core.ruler.after('inline', 'task-list', (state) => {
    const tokens = state.tokens;

    for (let i = 0; i < tokens.length; i++) {
      // Look for bullet_list_open
      if (tokens[i].type !== 'bullet_list_open') continue;

      let isTaskList = false;
      let j = i + 1;

      // Scan items inside this list to check if any are task items
      while (j < tokens.length && tokens[j].type !== 'bullet_list_close') {
        if (tokens[j].type === 'inline' && tokens[j].content) {
          const match = tokens[j].content.match(/^\[([ xX])\]\s/);
          if (match) {
            isTaskList = true;
            break;
          }
        }
        j++;
      }

      if (!isTaskList) continue;

      // Mark the list as a task list
      tokens[i].attrJoin('class', 'task-list');

      // Process each item
      j = i + 1;
      while (j < tokens.length && tokens[j].type !== 'bullet_list_close') {
        if (tokens[j].type === 'list_item_open') {
          const listItemOpen = tokens[j];
          // Find the inline content of this list item
          let k = j + 1;
          while (k < tokens.length && tokens[k].type !== 'list_item_close') {
            if (tokens[k].type === 'inline' && tokens[k].content) {
              const match = tokens[k].content.match(/^\[([ xX])\]\s/);
              if (match) {
                const checked = match[1] !== ' ';
                const tokenMap = tokens[k].map;
                const sourceLine = tokenMap ? tokenMap[0] : -1;

                listItemOpen.attrJoin('class', 'task-list-item');
                if (checked) {
                  listItemOpen.attrJoin('class', 'task-list-item-checked');
                }

                // Replace the inline content: strip `[ ] ` prefix and prepend checkbox html
                // (no `disabled` — the preview's click handler toggles the markdown source)
                const checkboxHtml =
                  `<input type="checkbox"${checked ? ' checked' : ''} data-line="${sourceLine}"> `;
                tokens[k].content = tokens[k].content.slice(match[0].length);
                tokens[k].children = tokens[k].children || [];

                // Prepend checkbox as html_inline token
                const checkboxToken = new state.Token('html_inline', '', 0);
                checkboxToken.content = checkboxHtml;

                // Remove the text token that contains `[ ] ` or `[x] `
                const children = tokens[k].children;
                if (children && children.length > 0 && children[0].type === 'text') {
                  children[0].content = children[0].content.slice(match[0].length);
                }
                if (children) {
                  children.unshift(checkboxToken);
                }
              }
            }
            k++;
          }
        }
        j++;
      }
    }
  });
}

md.use(taskListPlugin);

// Inline checkbox plugin: converts `[ ]` / `[x]` anywhere in inline content
// (paragraphs, list items after <br>, etc.) into checkbox elements.
// taskListPlugin only handles the "[ ] " at the very start of a list item,
// so this plugin covers all remaining cases — including `[ ]` on lines that
// were joined to a list item via soft breaks.
function inlineCheckboxPlugin(mdi: MarkdownIt) {
  mdi.core.ruler.after('task-list', 'inline-checkbox', (state) => {
    const tokens = state.tokens;

    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].type !== 'inline' || !tokens[i].children) continue;

      const children = tokens[i].children!;
      const newChildren: typeof children = [];
      let modified = false;

      // Track current line within the inline block for data-line on checkboxes.
      // softbreak/hardbreak increment the line counter so each `[ ]` maps to the
      // correct line in the original markdown source.
      const baseLine = tokens[i].map ? tokens[i].map![0] : 0;
      let currentLine = baseLine;

      for (const child of children) {
        // Preserve non-text children as-is (includes html_inline checkboxes
        // already inserted by taskListPlugin, softbreak, code_inline, etc.)
        if (child.type !== 'text') {
          if (child.type === 'softbreak' || child.type === 'hardbreak') {
            currentLine++;
          }
          newChildren.push(child);
          continue;
        }

        // Match [ ], [x], [X] followed by a space
        const regex = /\[([ xX])\] /g;
        let lastIndex = 0;
        let match;
        let hasMatch = false;

        while ((match = regex.exec(child.content)) !== null) {
          hasMatch = true;
          modified = true;

          if (match.index > lastIndex) {
            const textToken = new state.Token('text', '', 0);
            textToken.content = child.content.slice(lastIndex, match.index);
            newChildren.push(textToken);
          }

          const checked = match[1] !== ' ';
          const cbToken = new state.Token('html_inline', '', 0);
          cbToken.content =
            `<input type="checkbox"${checked ? ' checked' : ''} data-line="${currentLine}"> `;
          newChildren.push(cbToken);

          lastIndex = regex.lastIndex;
        }

        if (hasMatch) {
          if (lastIndex < child.content.length) {
            const textToken = new state.Token('text', '', 0);
            textToken.content = child.content.slice(lastIndex);
            newChildren.push(textToken);
          }
        } else {
          newChildren.push(child);
        }
      }

      if (modified) {
        tokens[i].children = newChildren;
      }
    }
  });
}

md.use(inlineCheckboxPlugin);

// Line annotation plugin: adds data-line / data-line-end to every block element
// so the preview can map rendered blocks back to source lines.
function lineAnnotationPlugin(mdi: MarkdownIt) {
  mdi.core.ruler.after('inline', 'line-annotation', (state) => {
    for (const token of state.tokens) {
      if (token.nesting >= 0 && token.map) {
        token.attrSet('data-line', String(token.map[0]));
        token.attrSet('data-line-end', String(token.map[1]));
      }
    }
  });

  // Fence blocks: the highlight function returns raw HTML so attrSet doesn't
  // reach the <pre> tag. Override the fence renderer to inject the attributes.
  const defaultFence =
    mdi.renderer.rules.fence ||
    function (tokens, idx, options, _env, self) {
      return self.renderToken(tokens, idx, options);
    };

  mdi.renderer.rules.fence = function (tokens, idx, options, env, self) {
    const token = tokens[idx];
    const result = defaultFence(tokens, idx, options, env, self);
    if (token.map) {
      return result.replace(
        '<pre',
        `<pre data-line="${token.map[0]}" data-line-end="${token.map[1]}"`,
      );
    }
    return result;
  };
}

md.use(lineAnnotationPlugin);

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
