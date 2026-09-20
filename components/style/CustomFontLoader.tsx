'use client';

import { useEffect } from 'react';
import { useStyleStore } from '@/stores';
import { buildFontFaceRule } from '@/lib/fonts/fontFace';

/**
 * Registers @font-face rules for custom fonts.
 * Must be mounted at the app level so fonts are available even when StylePanel is closed.
 *
 * The print iframe is a separate document and does not inherit these rules —
 * it builds its own from the same `buildFontFaceRule`.
 */
export function CustomFontLoader() {
  const customFonts = useStyleStore((state) => state.customFonts);

  useEffect(() => {
    customFonts.forEach((font) => {
      const existing = document.getElementById(`custom-font-${font.name}`);
      if (existing) return;

      const rule = buildFontFaceRule(font);
      if (!rule) return;

      const style = document.createElement('style');
      style.id = `custom-font-${font.name}`;
      style.textContent = rule;
      document.head.appendChild(style);
    });
  }, [customFonts]);

  return null;
}
