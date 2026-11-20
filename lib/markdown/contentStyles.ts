import { resolveCodePalette, type CodeThemeId } from './codeThemes';
import { sanitizeCssColor } from '@/lib/sanitize/cssValue';

interface ContentStyleOptions {
  linkColor?: string;
  codeBackground?: string;
  textColor?: string;
  codeTheme?: CodeThemeId;
}

/**
 * The stylesheet for rendered markdown, shared by every surface that displays
 * it: the editor preview, the slide view, the paged print preview and the
 * exported PDF.
 *
 * This is deliberately a generated string rather than a .css file: the print
 * pipeline renders into an isolated iframe that inherits no external
 * stylesheets, so the rules have to travel with the document. Keeping the
 * on-screen surfaces on the same function is what stops the preview and the
 * printed output drifting apart; styles/preview.css holds only screen-only
 * affordances (hover, cursor).
 *
 * Colours are derived from the active theme so borders and overlays stay
 * visible on dark backgrounds instead of being hardcoded against white.
 */
export function getContentStyles(options?: ContentStyleOptions): string {
  const linkColor = options?.linkColor || '#0366d6';
  const codeBg = options?.codeBackground || '#f5f5f5';
  const textColor = options?.textColor || '#1a1a1a';

  // Derive semi-transparent overlays from text color for borders/backgrounds
  const isLightText = isLight(textColor);
  const overlayBase = isLightText ? '255, 255, 255' : '0, 0, 0';

  return `
    /* Mirror the two Tailwind preflight rules that reach rendered markdown.
       The app document gets these from preflight; the print iframe inherits no
       stylesheets, so without them form controls fall back to the UA's 13.33px
       control font (shrinking em-sized checkboxes) and element styles that set
       a border width with no style render solid on screen but nothing in the
       PDF. Scoped to .preview-content so the app's own UI is untouched. */
    .preview-content *,
    .preview-content *::before,
    .preview-content *::after {
      border-width: 0;
      border-style: solid;
      border-color: currentColor;
    }
    .preview-content input,
    .preview-content button,
    .preview-content select,
    .preview-content textarea {
      font: inherit;
      color: inherit;
    }

    .preview-content {
      word-wrap: break-word;
      overflow-wrap: break-word;
    }
    .preview-content > :first-child {
      margin-top: 0;
    }
    .preview-content h1,
    .preview-content h2,
    .preview-content h3,
    .preview-content h4,
    .preview-content h5,
    .preview-content h6 {
      margin-top: 1.5em;
      margin-bottom: 0.5em;
      font-weight: 600;
      line-height: 1.3;
    }
    .preview-content h1 {
      font-size: 2em;
      padding-bottom: 0.3em;
      border-bottom: 1px solid rgba(${overlayBase}, 0.15);
    }
    .preview-content h2 {
      font-size: 1.5em;
      padding-bottom: 0.3em;
      border-bottom: 1px solid rgba(${overlayBase}, 0.15);
    }
    .preview-content h3 { font-size: 1.25em; }
    .preview-content h4 { font-size: 1em; }
    .preview-content h5 { font-size: 0.875em; }
    .preview-content h6 { font-size: 0.85em; opacity: 0.7; }
    .preview-content p {
      margin-top: 0;
      margin-bottom: 1em;
    }
    .preview-content a {
      color: ${linkColor};
      text-decoration: none;
    }
    .preview-content ul {
      margin-top: 0;
      margin-bottom: 1em;
      padding-left: 2em;
      list-style-type: disc;
    }
    .preview-content ol {
      margin-top: 0;
      margin-bottom: 1em;
      padding-left: 2em;
      list-style-type: decimal;
    }
    .preview-content li {
      margin-bottom: 0.25em;
    }
    .preview-content li > ul,
    .preview-content li > ol {
      margin-top: 0.25em;
      margin-bottom: 0;
    }
    .preview-content blockquote {
      margin: 0 0 1em;
      padding: 0.5em 1em;
      border-left: 4px solid rgba(${overlayBase}, 0.25);
      opacity: 0.85;
      background-color: rgba(${overlayBase}, 0.04);
    }
    .preview-content blockquote p:last-child {
      margin-bottom: 0;
    }
    .preview-content code {
      font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
      font-size: 0.875em;
      padding: 0.2em 0.4em;
      background-color: ${codeBg};
      border-radius: 3px;
    }
    .preview-content pre {
      margin: 0 0 1em;
      padding: 1em;
      overflow-x: auto;
      background-color: ${codeBg};
      border-radius: 6px;
    }
    .preview-content pre code {
      padding: 0;
      background-color: transparent;
      font-size: 0.85em;
      line-height: 1.5;
    }
${getSyntaxHighlightStyles(codeBg, options?.codeTheme ?? 'auto')}
    .preview-content hr {
      /* The UA gives hr its own grey; inherit so currentColor matches on both
         surfaces if an element style ever gives it a border. */
      color: inherit;
      height: 0.25em;
      margin: 1.5em 0;
      padding: 0;
      background-color: rgba(${overlayBase}, 0.20);
      border: 0;
    }
    .preview-content table {
      width: 100%;
      margin-bottom: 1em;
      border-collapse: collapse;
      border-spacing: 0;
    }
    .preview-content table th,
    .preview-content table td {
      padding: 0.5em 1em;
      border: 1px solid rgba(${overlayBase}, 0.20);
    }
    .preview-content table th {
      font-weight: 600;
      background-color: rgba(${overlayBase}, 0.06);
    }
    .preview-content table tr:nth-child(even) {
      background-color: rgba(${overlayBase}, 0.03);
    }
    /* Frontmatter: a quiet "document info" card rather than a data table.
       Selectors are one class more specific than the generic table rules so
       they win over both those and the table element styles; the frontmatter
       element styles (card, keys = th, values = td) use these same selectors
       and come later, so they win. */
    .preview-content table.frontmatter {
      width: 100%;
      margin: 0 0 2em;
      border-collapse: separate;
      border-spacing: 0;
      border: 1px solid rgba(${overlayBase}, 0.12);
      border-radius: 8px;
      background-color: rgba(${overlayBase}, ${FRONTMATTER_BG_ALPHA});
      font-size: 0.85em;
      line-height: 1.6;
    }
    .preview-content table.frontmatter tr,
    .preview-content table.frontmatter tr:nth-child(even) {
      background-color: transparent;
    }
    .preview-content table.frontmatter th,
    .preview-content table.frontmatter td {
      padding: 0.55em 1.1em;
      border: 0;
      border-bottom: 1px dashed rgba(${overlayBase}, 0.10);
      background-color: transparent;
      text-align: left;
      vertical-align: top;
    }
    .preview-content table.frontmatter tr:last-child th,
    .preview-content table.frontmatter tr:last-child td {
      border-bottom: 0;
    }
    .preview-content table.frontmatter th {
      width: 1%;
      white-space: nowrap;
      font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
      font-size: 0.95em;
      font-weight: 600;
      color: ${frontmatterKeyColor(textColor)};
    }
    /* Values set their own text properties so table cell styles (some
       presets colour every td) never leak into the card. */
    .preview-content table.frontmatter td {
      overflow-wrap: anywhere;
      color: ${sanitizeCssColor(textColor) || 'inherit'};
      font-weight: 400;
    }
    .preview-content img {
      max-width: 100%;
      height: auto;
      border-radius: 4px;
    }

    /* Badges (shields.io and friends) read as a row, not one per line.
       Markdown puts each on its own paragraph, so the paragraphs collapse to
       inline when they contain nothing but a badge image. */
    .preview-content p > a > img[src*="shields.io"],
    .preview-content p > a > img[src*="badge"],
    .preview-content p > a > img[src*="github.com"][src*="workflows"],
    .preview-content p > a > img[src*="img.shields"],
    .preview-content p > img[src*="shields.io"],
    .preview-content p > img[src*="badge"] {
      display: inline-block;
      vertical-align: middle;
      margin-right: 4px;
    }
    .preview-content p > a:only-child > img,
    .preview-content p > img:only-child {
      display: inline-block;
      vertical-align: middle;
    }
    .preview-content p:has(> a:only-child > img):has(+ p > a:only-child > img),
    .preview-content p:has(> a:only-child > img) + p:has(> a:only-child > img) {
      display: inline;
      margin-right: 4px;
    }

    .preview-content strong { font-weight: 600; }
    .preview-content em { font-style: italic; }
    /* markdown-it emits <s> for ~~strikethrough~~; <del> covers raw HTML. */
    .preview-content s,
    .preview-content del { text-decoration: line-through; }

    /* Task list layout: no flex, so nested <ul>/<ol> wrap onto their own lines */
    .preview-content .task-list {
      list-style: none;
      padding-left: 0;
      margin-top: 0;
      margin-bottom: 1em;
    }
    .preview-content .task-list-item { margin-bottom: 0.25em; }
    .preview-content .task-list-item-checked { opacity: 0.6; text-decoration: line-through; }

    /* Custom checkbox (inline) — works for both list items and standalone [ ] */
    .preview-content input[type="checkbox"] {
      appearance: none;
      -webkit-appearance: none;
      width: 1.15em;
      height: 1.15em;
      min-width: 1.15em;
      border: 2px solid rgba(${overlayBase}, 0.35);
      border-radius: 3px;
      margin: 0 0.4em 0 0;
      vertical-align: -0.2em;
      position: relative;
      background-color: transparent;
    }
    .preview-content input[type="checkbox"]:checked {
      background-color: ${linkColor};
      border-color: ${linkColor};
    }
    .preview-content input[type="checkbox"]:checked::after {
      content: '';
      position: absolute;
      left: 3px;
      top: 0;
      width: 5px;
      height: 9px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
  `;
}

/**
 * Token colours for fenced code blocks with a language (```ts, ```py, ...).
 * The parser runs highlight.js and emits `hljs-*` spans; these rules colour
 * them.
 *
 * `auto` (the default) follows the theme's code background: GitHub light on
 * light backgrounds, GitHub dark on dark ones, keeping the theme's own block
 * colours. A named theme also paints the block background and text so its
 * tokens sit on the surface they were designed for. `none` adds no colours.
 */
function getSyntaxHighlightStyles(codeBg: string, codeTheme: CodeThemeId): string {
  const resolved = resolveCodePalette(codeTheme, codeBg);
  if (!resolved) return '';
  const c = resolved.palette;
  const s = '.preview-content pre.hljs';
  const blockCss = resolved.named
    ? `
    ${s} { background-color: ${c.background}; color: ${c.foreground}; }
    ${s} code { color: inherit; }`
    : '';
  return `${blockCss}
    ${s} .hljs-comment,
    ${s} .hljs-quote { color: ${c.comment}; font-style: italic; }
    ${s} .hljs-keyword,
    ${s} .hljs-selector-tag,
    ${s} .hljs-doctag,
    ${s} .hljs-template-tag,
    ${s} .hljs-template-variable,
    ${s} .hljs-variable.language_,
    ${s} .hljs-type { color: ${c.keyword}; }
    ${s} .hljs-string,
    ${s} .hljs-regexp,
    ${s} .hljs-meta .hljs-string { color: ${c.string}; }
    ${s} .hljs-number,
    ${s} .hljs-literal,
    ${s} .hljs-attr,
    ${s} .hljs-attribute,
    ${s} .hljs-variable,
    ${s} .hljs-operator,
    ${s} .hljs-selector-attr,
    ${s} .hljs-selector-class,
    ${s} .hljs-selector-id { color: ${c.number}; }
    ${s} .hljs-title,
    ${s} .hljs-title.class_,
    ${s} .hljs-title.function_,
    ${s} .hljs-section { color: ${c.title}; }
    ${s} .hljs-built_in,
    ${s} .hljs-symbol,
    ${s} .hljs-params,
    ${s} .hljs-property { color: ${c.type}; }
    ${s} .hljs-name,
    ${s} .hljs-tag,
    ${s} .hljs-selector-pseudo { color: ${c.tag}; }
    ${s} .hljs-meta,
    ${s} .hljs-bullet { color: ${c.meta}; }
    ${s} .hljs-emphasis { font-style: italic; }
    ${s} .hljs-strong { font-weight: bold; }
    ${s} .hljs-addition { color: ${c.addition}; background-color: ${c.additionBg}; }
    ${s} .hljs-deletion { color: ${c.deletion}; background-color: ${c.deletionBg}; }
  `;
}

/** Strength of the text-colour tint behind the frontmatter card. */
const FRONTMATTER_BG_ALPHA = 0.025;
/** Strength of the text-colour tint used for frontmatter keys. */
const FRONTMATTER_KEY_ALPHA = 0.55;

function parseHex(color: string): [number, number, number] | null {
  const hex = color.trim().replace('#', '');
  if (!/^([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(hex)) return null;
  const full = hex.length === 3 ? hex.replace(/./g, '$&$&') : hex.slice(0, 6);
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16)) as [number, number, number];
}

/**
 * The colour the frontmatter card's default background actually shows: the
 * translucent tint from getContentStyles laid over the page background. The
 * style panel shows this as the picker's value, so it matches what's on screen
 * and choosing it explicitly changes nothing.
 */
export function getFrontmatterDefaultBackground(textColor: string, pageBackground: string): string {
  return blendOverlay(textColor, pageBackground, FRONTMATTER_BG_ALPHA);
}

/**
 * Frontmatter keys are the card's text colour, dimmed, so they follow the page
 * text colour and the 문서 정보 colour instead of staying a fixed grey.
 * Non-hex colours fall back to inheriting at full strength.
 */
export function frontmatterKeyColor(textColor: string): string {
  const rgb = parseHex(textColor);
  return rgb ? `rgba(${rgb.join(', ')}, ${FRONTMATTER_KEY_ALPHA})` : 'inherit';
}

/** The frontmatter keys' colour as it renders: `textColor` dimmed over the page, as hex. */
export function getFrontmatterDefaultKeyColor(textColor: string, pageBackground: string): string {
  const fg = parseHex(textColor);
  return fg ? blend(fg, pageBackground, FRONTMATTER_KEY_ALPHA) : textColor;
}

/** `rgba(overlay, alpha)` (overlay = white or black, picked from the text colour) over the page, as hex. */
function blendOverlay(textColor: string, pageBackground: string, alpha: number): string {
  const v = isLight(textColor) ? 255 : 0;
  return blend([v, v, v], pageBackground, alpha);
}

function blend(fg: [number, number, number], pageBackground: string, alpha: number): string {
  const bg = parseHex(pageBackground);
  if (!bg) return `rgba(${fg.join(', ')}, ${alpha})`;
  return '#' + bg
    .map((c, i) => Math.round(c * (1 - alpha) + fg[i] * alpha))
    .map((c) => c.toString(16).padStart(2, '0'))
    .join('');
}

/** Simple check: is the color perceived as "light"? */
function isLight(color: string): boolean {
  // Handle hex colors
  const hex = color.replace('#', '');
  if (/^[0-9a-f]{3,8}$/i.test(hex)) {
    const full = hex.length === 3
      ? hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
      : hex.slice(0, 6);
    const r = parseInt(full.slice(0, 2), 16);
    const g = parseInt(full.slice(2, 4), 16);
    const b = parseInt(full.slice(4, 6), 16);
    // Perceived brightness
    return (r * 299 + g * 587 + b * 114) / 1000 > 128;
  }
  return false;
}
