/**
 * Shared print-document plumbing.
 *
 * The on-screen paged preview and the generated PDF render the *same* document
 * inside an isolated iframe, using the geometry and CSS built here. Anything
 * that diverges between the two paths shows up as a "preview doesn't match the
 * PDF" bug, so both callers must go through these helpers instead of deriving
 * page geometry or styles locally.
 */

import { getContentStyles } from '@/lib/markdown/contentStyles';
import { getPaperDimensions, mmToPx } from './paperSizes';
import { generateElementStylesCss } from '@/lib/themes';
import { buildFontFaceCss } from '@/lib/fonts/fontFace';
import type {
  CustomFont,
  GlobalStyles,
  ElementStyle,
  ElementStyles,
  EditableElement,
} from '@/types/style';
import type { PrintSettings } from '@/types/print';

/** Space (mm) reserved inside the top/bottom margin for header/footer text. */
export const HEADER_FOOTER_HEIGHT_MM = 5;

/** Header/footer text size, in points (matches jsPDF's text sizing). */
export const HEADER_FOOTER_FONT_SIZE_PT = 9;

/** Distance (mm) from the top margin to the header text's vertical centre. */
export const HEADER_BASELINE_OFFSET_MM = 3;

/** Distance (mm) above the bottom margin of the footer text's vertical centre. */
export const FOOTER_BASELINE_OFFSET_MM = 1;

/**
 * Line-box height (mm) of a rendered header/footer line.
 * Mirrors `renderTextToImage`, which sizes its canvas at 1.4x the font size.
 */
export const HEADER_FOOTER_LINE_HEIGHT_MM =
  (HEADER_FOOTER_FONT_SIZE_PT * 1.4 * 25.4) / 72;

/** The element both paths measure and render: a block child of `<body>`. */
export const PRINT_ROOT_CLASS = 'print-root';

export interface PrintColors {
  background: string;
  text: string;
  link: string;
  codeBackground: string;
  headerFooter: string;
}

/**
 * Resolve the palette for a print run.
 *
 * With `includeBackground` off the document falls back to plain black-on-white
 * so it stays readable on paper.
 */
export function resolvePrintColors(
  styles: GlobalStyles,
  includeBackground: boolean
): PrintColors {
  if (!includeBackground) {
    return {
      background: '#ffffff',
      text: '#1a1a1a',
      link: '#0366d6',
      codeBackground: '#f5f5f5',
      headerFooter: '#666666',
    };
  }

  return {
    background: styles.backgroundColor,
    text: styles.textColor,
    link: styles.linkColor,
    codeBackground: styles.codeBackground,
    headerFooter: styles.textColor,
  };
}

export interface PrintGeometry {
  paperWidthMm: number;
  paperHeightMm: number;
  paperWidthPx: number;
  paperHeightPx: number;
  marginTopMm: number;
  marginRightMm: number;
  marginBottomMm: number;
  marginLeftMm: number;
  headerHeightMm: number;
  footerHeightMm: number;
  /** Y offset (mm) where page content starts, below the margin and header. */
  contentTopMm: number;
  contentWidthMm: number;
  contentWidthPx: number;
  pageContentHeightMm: number;
  pageContentHeightPx: number;
}

/** Derive every page measurement from the print settings. */
export function getPrintGeometry(settings: PrintSettings): PrintGeometry {
  const { width, height } = getPaperDimensions(settings.paperSize, settings.orientation);
  const { top, right, bottom, left } = settings.margins;

  const headerHeightMm = settings.header.enabled ? HEADER_FOOTER_HEIGHT_MM : 0;
  const footerHeightMm = settings.footer.enabled ? HEADER_FOOTER_HEIGHT_MM : 0;

  const contentWidthMm = width - left - right;
  const pageContentHeightMm = height - top - bottom - headerHeightMm - footerHeightMm;

  return {
    paperWidthMm: width,
    paperHeightMm: height,
    paperWidthPx: mmToPx(width),
    paperHeightPx: mmToPx(height),
    marginTopMm: top,
    marginRightMm: right,
    marginBottomMm: bottom,
    marginLeftMm: left,
    headerHeightMm,
    footerHeightMm,
    contentTopMm: top + headerHeightMm,
    contentWidthMm,
    contentWidthPx: mmToPx(contentWidthMm),
    pageContentHeightMm,
    pageContentHeightPx: mmToPx(pageContentHeightMm),
  };
}

export interface PrintDocumentOptions {
  /** Sanitized markdown HTML. */
  html: string;
  geometry: PrintGeometry;
  colors: PrintColors;
  styles: GlobalStyles;
  elementStyles: ElementStyles;
  /**
   * Uploaded fonts. The iframe is a separate document, so the app's
   * `@font-face` rules don't reach it — they have to be re-declared here or
   * the selected font silently falls back.
   */
  customFonts: CustomFont[];
  /** When false the document is rendered monochrome, but keeps its layout. */
  includeBackground: boolean;
  /** Extra CSS appended after the shared rules (paged-preview chrome). */
  extraCss?: string;
}

/**
 * Build the complete document written into a print iframe.
 *
 * `<body>` holds a single `.print-root` block so content height and margin
 * collapsing behave identically in both paths.
 */
export function buildPrintDocument(options: PrintDocumentOptions): string {
  const {
    html,
    geometry,
    colors,
    styles,
    elementStyles,
    customFonts,
    includeBackground,
    extraCss,
  } = options;

  const baseCss = getContentStyles({
    linkColor: colors.link,
    codeBackground: colors.codeBackground,
    textColor: colors.text,
  });

  const elementCss = generateElementStylesCss(
    includeBackground ? elementStyles : toMonochrome(elementStyles)
  );

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
${buildFontFaceCss(customFonts)}
*, *::before, *::after { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body { background-color: ${colors.background}; }
.${PRINT_ROOT_CLASS} {
  width: ${geometry.contentWidthPx}px;
  background-color: ${colors.background};
  color: ${colors.text};
  font-family: ${styles.fontFamily};
  font-size: ${styles.fontSize}px;
  line-height: ${styles.lineHeight};
}
${baseCss}
${elementCss}
${extraCss ?? ''}
</style></head>
<body><div class="${PRINT_ROOT_CLASS}"><div class="preview-content">${html}</div></div></body></html>`;
}

/** Element-style properties that carry colour rather than layout. */
const COLOR_PROPERTIES: readonly (keyof ElementStyle)[] = [
  'color',
  'backgroundColor',
  'borderColor',
  'borderBottomColor',
];

/**
 * Drop colour from element styles while keeping layout intact.
 *
 * Printing without the background should make the document monochrome, not
 * discard the preset entirely: sizes, spacing and border widths still decide
 * where the page breaks fall, and a preset that turned a base border *off*
 * must keep doing so. Borders left without a colour fall back to
 * `currentColor`, so they stay visible in black.
 */
export function toMonochrome(styles: ElementStyles): ElementStyles {
  const result: ElementStyles = {};

  for (const [element, style] of Object.entries(styles) as [
    EditableElement,
    ElementStyle | undefined,
  ][]) {
    if (!style) continue;

    const stripped: ElementStyle = { ...style };
    for (const property of COLOR_PROPERTIES) delete stripped[property];
    result[element] = stripped;
  }

  return result;
}

/**
 * Wait until an iframe document is ready to measure: fonts settled and images
 * decoded. Falls back to `timeoutMs` so a slow remote image can't hang export.
 */
export async function waitForPrintDocument(doc: Document, timeoutMs = 3000): Promise<void> {
  const pending: Promise<unknown>[] = [];

  const fontSet = (doc as Document & { fonts?: FontFaceSet }).fonts;
  if (fontSet?.ready) pending.push(fontSet.ready);

  doc.querySelectorAll('img').forEach((img) => {
    if (img.complete) return;
    pending.push(
      new Promise<void>((resolve) => {
        img.addEventListener('load', () => resolve(), { once: true });
        img.addEventListener('error', () => resolve(), { once: true });
      })
    );
  });

  if (pending.length === 0) return;

  await Promise.race([
    Promise.all(pending),
    new Promise((resolve) => setTimeout(resolve, timeoutMs)),
  ]);
}
