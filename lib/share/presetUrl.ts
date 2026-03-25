import type { GlobalStyles, ElementStyles, ListStyles, HeadingStyles } from '@/types/style';
import { defaultStyles } from '@/lib/themes/presets';

interface SharedPreset {
  g?: Partial<GlobalStyles>;
  e?: ElementStyles;
  l?: ListStyles;
  h?: HeadingStyles;
}

/**
 * Strip keys from an object whose values match the defaults.
 * Returns undefined if nothing differs.
 */
function diffFromDefaults(
  current: GlobalStyles,
  defaults: GlobalStyles,
): Partial<GlobalStyles> | undefined {
  const diff: Record<string, unknown> = {};
  let hasDiff = false;

  for (const key of Object.keys(defaults) as (keyof GlobalStyles)[]) {
    const cur = current[key];
    const def = defaults[key];

    if (typeof cur === 'object' && typeof def === 'object') {
      // Handle Padding object
      if (JSON.stringify(cur) !== JSON.stringify(def)) {
        diff[key] = cur;
        hasDiff = true;
      }
    } else if (cur !== def) {
      diff[key] = cur;
      hasDiff = true;
    }
  }

  return hasDiff ? (diff as Partial<GlobalStyles>) : undefined;
}

function isEmptyObject(obj: unknown): boolean {
  return obj == null || (typeof obj === 'object' && Object.keys(obj!).length === 0);
}

/**
 * Encode the current styles into a URL-safe base64 string.
 * Only non-default values are included to keep it short.
 */
export function encodePresetToUrl(
  globalStyles: GlobalStyles,
  elementStyles: ElementStyles,
  listStyles?: ListStyles,
  headingStyles?: HeadingStyles,
): string {
  const preset: SharedPreset = {};

  const gDiff = diffFromDefaults(globalStyles, defaultStyles);
  if (gDiff) preset.g = gDiff;
  if (!isEmptyObject(elementStyles)) preset.e = elementStyles;
  if (!isEmptyObject(listStyles)) preset.l = listStyles;
  if (!isEmptyObject(headingStyles)) preset.h = headingStyles;

  const json = JSON.stringify(preset);
  // Use encodeURIComponent to handle unicode safely before btoa
  const encoded = btoa(unescape(encodeURIComponent(json)));
  return encoded;
}

/**
 * Decode a base64 preset string back into style objects.
 */
export function decodePresetFromUrl(encoded: string): {
  globalStyles?: Partial<GlobalStyles>;
  elementStyles?: ElementStyles;
  listStyles?: ListStyles;
  headingStyles?: HeadingStyles;
} | null {
  try {
    const json = decodeURIComponent(escape(atob(encoded)));
    const preset: SharedPreset = JSON.parse(json);

    return {
      globalStyles: preset.g,
      elementStyles: preset.e,
      listStyles: preset.l,
      headingStyles: preset.h,
    };
  } catch (e) {
    console.error('Failed to decode shared preset:', e);
    return null;
  }
}

/**
 * Build a full shareable URL with the style parameter.
 */
export function buildShareUrl(
  globalStyles: GlobalStyles,
  elementStyles: ElementStyles,
  listStyles?: ListStyles,
  headingStyles?: HeadingStyles,
): string {
  const encoded = encodePresetToUrl(globalStyles, elementStyles, listStyles, headingStyles);
  const base = `${window.location.origin}${window.location.pathname}`;
  return `${base}?style=${encoded}`;
}
