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
