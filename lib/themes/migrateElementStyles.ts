import type { ElementStyle, ElementStyles } from '@/types/style';

/**
 * Version of the element-styles shape. v2 split the single `code` element
 * into `code` (fenced blocks) and `inlineCode`.
 */
export const ELEMENT_STYLES_VERSION = 2;

/**
 * Properties the old `code` element applied to inline code as well as blocks.
 * Margin, padding and line-height are left out: on inline code they either did
 * nothing or drew once per wrapped line.
 */
const LEGACY_SHARED_KEYS: (keyof ElementStyle)[] = [
  'color', 'fontFamily', 'fontSize', 'fontWeight', 'backgroundColor',
  'borderWidth', 'borderColor', 'borderStyle', 'borderRadius',
];

/**
 * Upgrade element styles saved before v2 so inline code keeps the look it had
 * when it shared the `code` element with blocks. Call only on data known to be
 * older than v2: on current data a missing `inlineCode` is deliberate.
 */
export function migrateLegacyCodeStyles(styles: ElementStyles | undefined): ElementStyles | undefined {
  if (!styles?.code || styles.inlineCode) return styles;
  const inline: ElementStyle = {};
  for (const key of LEGACY_SHARED_KEYS) {
    const value = styles.code[key];
    if (value !== undefined) (inline as Record<string, unknown>)[key] = value;
  }
  if (Object.keys(inline).length === 0) return styles;
  return { ...styles, inlineCode: inline };
}
