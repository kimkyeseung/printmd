/**
 * PDF header/footer text rendering utilities.
 *
 * jsPDF's built-in pdf.text() only supports Latin characters (Helvetica/Times/Courier).
 * CJK and other non-Latin scripts render as mojibake.
 *
 * Instead, we render header/footer text onto a canvas using the browser's 2D context
 * (which supports any loaded font) and embed the result as a PNG image in the PDF.
 */

/** Resolve template variables in a header/footer string. */
export function resolveTemplate(
  tpl: string,
  vars: { title: string; date: string; page: number; pages: number }
): string {
  return tpl
    .replace(/\{title\}/g, vars.title)
    .replace(/\{date\}/g, vars.date)
    .replace(/\{page\}/g, String(vars.page))
    .replace(/\{pages\}/g, String(vars.pages));
}

/** Extract the document title from the first H1 line in markdown content. */
export function extractTitle(markdown: string): string {
  return (
    markdown
      .split('\n')
      .find((l) => l.startsWith('# '))
      ?.replace(/^#\s+/, '') || 'Untitled'
  );
}

/** Format a Date as YYYY-MM-DD. */
export function formatDateYMD(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Build a safe PDF filename from a title and date.
 *
 * - Strips markdown formatting (**, __, *, _, `, etc.) from the title
 * - Removes / replaces characters that most filesystems reject
 *   (`/ \ : * ? " < > |` and control chars)
 * - Collapses whitespace, trims the result
 * - Preserves CJK and other Unicode characters
 * - Falls back to `document` if the cleaned title is empty
 * - Caps title length at 80 characters to keep the final name reasonable
 *
 * Format: `{title}-{date}.pdf`  (e.g. `My Document-2026-04-16.pdf`)
 */
export function buildPdfFilename(title: string, date: Date = new Date()): string {
  const cleanedTitle = sanitizeFilenameTitle(title);
  const datePart = formatDateYMD(date);
  const base = cleanedTitle || 'document';
  return `${base}-${datePart}.pdf`;
}

function sanitizeFilenameTitle(title: string): string {
  return title
    // Strip common markdown inline syntax
    .replace(/[*_`~]+/g, '')
    // Remove filesystem-forbidden chars and control chars
    // eslint-disable-next-line no-control-regex
    .replace(/[\\/:*?"<>|\x00-\x1f]/g, '')
    // Collapse runs of whitespace to a single space
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80)
    .trim();
}

export interface RenderedText {
  dataUrl: string;
  widthMm: number;
  heightMm: number;
}

/**
 * Render a single line of text to a canvas and return as a PNG data URL
 * with its dimensions in millimetres.
 *
 * We render at 300 DPI for crisp output.
 */
const RENDER_DPI = 300;

export function renderTextToImage(
  text: string,
  fontSizePt: number,
  color: string,
  fontFamily: string
): RenderedText | null {
  if (!text) return null;

  const fontSizePx = (fontSizePt * RENDER_DPI) / 72;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const fontSpec = `${fontSizePx}px ${fontFamily}, sans-serif`;

  // Measure first
  ctx.font = fontSpec;
  const metrics = ctx.measureText(text);

  canvas.width = Math.ceil(metrics.width) + 4;
  canvas.height = Math.ceil(fontSizePx * 1.4);

  // Re-set font after canvas resize (resets context)
  ctx.font = fontSpec;
  ctx.fillStyle = color;
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 0, canvas.height / 2);

  const pxToMm = 25.4 / RENDER_DPI;

  return {
    dataUrl: canvas.toDataURL('image/png'),
    widthMm: canvas.width * pxToMm,
    heightMm: canvas.height * pxToMm,
  };
}

export type Align = 'left' | 'center' | 'right';

/** Calculate the X position (in mm) for a rendered text image given alignment. */
export function calcAlignedX(
  align: Align,
  imgWidthMm: number,
  pageWidthMm: number,
  marginLeftMm: number,
  marginRightMm: number
): number {
  switch (align) {
    case 'left':
      return marginLeftMm;
    case 'center':
      return (pageWidthMm - imgWidthMm) / 2;
    case 'right':
      return pageWidthMm - marginRightMm - imgWidthMm;
  }
}
