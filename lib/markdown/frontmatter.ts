/**
 * YAML frontmatter: a `---` … `---` block at the very top of a file.
 *
 * Without this, markdown reads the opening `---` as a horizontal rule and the
 * closing `---` as a setext underline, turning every metadata line into one
 * giant H2. We lift the block out and show it as a key/value table instead.
 *
 * This is a deliberately small reader for the shapes frontmatter actually
 * takes (scalars, quoted strings, lists, block scalars), not a YAML parser:
 * anything it can't place is kept as text on the previous key.
 */

export interface Frontmatter {
  /** Number of source lines the block spans, fences included. */
  lineCount: number;
  entries: { key: string; value: string }[];
}

const OPEN_RE = /^---[ \t]*$/;
const CLOSE_RE = /^(---|\.\.\.)[ \t]*$/;
const KEY_RE = /^([A-Za-z_$][\w$.\-]*)[ \t]*:(?:[ \t]+(.*)|[ \t]*)$/;

function unquote(value: string): string {
  const v = value.trim();
  if (v.length >= 2 && ((v[0] === '"' && v.endsWith('"')) || (v[0] === "'" && v.endsWith("'")))) {
    return v.slice(1, -1);
  }
  return v;
}

function finishValue(head: string, rest: string[]): string {
  const h = head.trim();
  // Block scalars: `|` keeps line breaks, `>` folds them into spaces.
  if (/^[|>][+-]?$/.test(h)) {
    return rest.map((l) => l.trim()).join(h[0] === '|' ? '\n' : ' ').trim();
  }
  // Inline list: [a, b, c]
  if (h.startsWith('[') && h.endsWith(']')) {
    return h.slice(1, -1).split(',').map(unquote).filter(Boolean).join(', ');
  }
  const items = rest.map((l) => l.trim()).filter(Boolean);
  // Block list:
  //   tags:
  //     - a
  if (!h && items.length > 0 && items.every((l) => l.startsWith('- '))) {
    return items.map((l) => unquote(l.slice(2))).join(', ');
  }
  // Plain scalar, possibly continued on indented lines.
  return unquote([h, ...items].filter(Boolean).join(' '));
}

export function extractFrontmatter(content: string): Frontmatter | null {
  const lines = content.split('\n').map((l) => l.replace(/\r$/, ''));
  if (lines.length < 3 || !OPEN_RE.test(lines[0])) return null;

  let close = -1;
  for (let i = 1; i < lines.length; i++) {
    if (CLOSE_RE.test(lines[i])) {
      close = i;
      break;
    }
  }
  if (close < 2) return null;

  const body = lines.slice(1, close);
  // Must look like YAML, so a plain `---` rule followed by text isn't eaten.
  const firstReal = body.find((l) => l.trim() && !l.trim().startsWith('#'));
  if (!firstReal || !KEY_RE.test(firstReal)) return null;

  const entries: Frontmatter['entries'] = [];
  let current: { key: string; head: string; rest: string[] } | null = null;
  const flush = () => {
    if (current) entries.push({ key: current.key, value: finishValue(current.head, current.rest) });
  };

  for (const line of body) {
    if (line.trim().startsWith('#') && !/^\s/.test(line)) continue; // comment
    const m = /^\S/.test(line) ? line.match(KEY_RE) : null;
    if (m) {
      flush();
      current = { key: m[1], head: m[2] ?? '', rest: [] };
    } else if (current && line.trim()) {
      current.rest.push(line);
    }
  }
  flush();

  if (entries.length === 0) return null;
  return { lineCount: close + 1, entries };
}

/**
 * Blank out the frontmatter lines so markdown skips them while every later
 * block keeps its source line number (the preview maps rendered blocks back
 * to lines for inline editing).
 */
export function blankFrontmatter(content: string, fm: Frontmatter): string {
  const lines = content.split('\n');
  for (let i = 0; i < fm.lineCount; i++) lines[i] = '';
  return lines.join('\n');
}

/** Content with the frontmatter block removed (for slides). */
export function stripFrontmatter(content: string): string {
  const fm = extractFrontmatter(content);
  return fm ? content.split('\n').slice(fm.lineCount).join('\n') : content;
}

export function renderFrontmatterTable(fm: Frontmatter, escapeHtml: (s: string) => string): string {
  const rows = fm.entries
    .map(({ key, value }) => {
      const cell = escapeHtml(value).replace(/\n/g, '<br>');
      return `<tr><th>${escapeHtml(key)}</th><td>${cell}</td></tr>`;
    })
    .join('');
  return `<table class="frontmatter" data-line="0" data-line-end="${fm.lineCount}"><tbody>${rows}</tbody></table>\n`;
}
