import { sanitizeFontName } from '@/lib/sanitize/cssValue';
import type { CustomFont } from '@/types/style';

/**
 * Uploaded fonts are stored as base64 data URLs by FontManager. Anything else
 * is untrusted input — and a remote URL would not survive PDF export anyway,
 * since the print iframe has to be self-contained.
 */
const DATA_URL_PATTERN = /^data:[\w.+-]+\/[\w.+-]+(?:;charset=[\w-]+)?;base64,[A-Za-z0-9+/]+={0,2}$/;

/**
 * Build the `@font-face` rule for one uploaded font, or an empty string if the
 * font can't be embedded safely.
 */
export function buildFontFaceRule(font: CustomFont): string {
  if (!DATA_URL_PATTERN.test(font.url)) return '';

  const name = sanitizeFontName(font.name);
  if (!name) return '';

  return `@font-face {
  font-family: '${name}';
  src: url('${font.url}');
  font-display: swap;
}`;
}

/**
 * Build the `@font-face` rules for every uploaded font.
 *
 * Shared by the app document (CustomFontLoader) and the print iframe, so a
 * font the user picked renders the same on screen and in the exported PDF.
 */
export function buildFontFaceCss(fonts: CustomFont[]): string {
  // Guarded: a missing font list must not take down PDF export, which is what
  // an unguarded `.map` here would do.
  if (!fonts?.length) return '';
  return fonts.map(buildFontFaceRule).filter(Boolean).join('\n');
}
