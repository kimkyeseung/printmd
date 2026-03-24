'use client';

import { useEffect } from 'react';
import { useStyleStore } from '@/stores';
import { sanitizeFontName } from '@/lib/sanitize/cssValue';

/**
 * Registers @font-face rules for custom fonts.
 * Must be mounted at the app level so fonts are available even when StylePanel is closed.
 */
export function CustomFontLoader() {
  const customFonts = useStyleStore((state) => state.customFonts);

  useEffect(() => {
    customFonts.forEach((font) => {
      const existing = document.getElementById(`custom-font-${font.name}`);
      if (existing) return;

      const style = document.createElement('style');
      style.id = `custom-font-${font.name}`;
      const safeName = sanitizeFontName(font.name);
      const safeUrl = font.url.startsWith('data:') ? font.url : '';
      style.textContent = `
        @font-face {
          font-family: '${safeName}';
          src: url('${safeUrl}');
          font-display: swap;
        }
      `;
      document.head.appendChild(style);
    });
  }, [customFonts]);

  return null;
}
