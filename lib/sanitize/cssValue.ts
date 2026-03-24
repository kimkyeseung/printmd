/**
 * CSS value sanitization utilities to prevent CSS injection attacks.
 * Used when interpolating user-controlled values into CSS strings.
 */

/**
 * Sanitize a CSS property value by removing characters that could
 * break out of CSS declarations or inject new rules.
 */
export function sanitizeCssValue(value: string): string {
  return value.replace(/[<>/\\{};"'`]/g, '');
}

/**
 * Sanitize a CSS string value (used inside content: "...").
 * Escapes double quotes and backslashes.
 */
export function escapeCssString(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/</g, '\\3c ')
    .replace(/>/g, '\\3e ');
}

/**
 * Validate a CSS color value (hex, rgb, rgba, hsl, hsla, named colors).
 * Returns the value if valid, empty string otherwise.
 */
export function sanitizeCssColor(value: string): string {
  const trimmed = value.trim();
  // Hex colors
  if (/^#[0-9a-fA-F]{3,8}$/.test(trimmed)) return trimmed;
  // rgb/rgba/hsl/hsla
  if (/^(rgb|hsl)a?\(\s*[\d.,\s%/]+\)$/.test(trimmed)) return trimmed;
  // Named colors (subset of common ones + transparent/inherit/currentColor)
  if (/^[a-zA-Z]+$/.test(trimmed) && trimmed.length <= 20) return trimmed;
  return '';
}

/**
 * Sanitize a font-family value by removing potentially dangerous content.
 */
export function sanitizeFontFamily(value: string): string {
  return value.replace(/[<>/\\{};`]/g, '');
}

/**
 * Sanitize a font name (e.g., from uploaded file).
 * Only allows alphanumeric, spaces, hyphens, and underscores.
 */
export function sanitizeFontName(value: string): string {
  return value.replace(/[^a-zA-Z0-9\s\-_\u3131-\uD79D\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF]/g, '');
}
