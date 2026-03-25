import { describe, it, expect } from 'vitest';
import { encodePresetToUrl, decodePresetFromUrl } from '../presetUrl';
import { defaultStyles } from '@/lib/themes/presets';
import type { GlobalStyles, ElementStyles } from '@/types/style';

describe('presetUrl', () => {
  describe('encodePresetToUrl / decodePresetFromUrl', () => {
    it('round-trips globalStyles correctly', () => {
      const styles: GlobalStyles = {
        ...defaultStyles,
        fontSize: 20,
        textColor: '#ff0000',
      };

      const encoded = encodePresetToUrl(styles, {});
      expect(encoded).toBeTruthy();
      expect(typeof encoded).toBe('string');

      const decoded = decodePresetFromUrl(encoded);
      expect(decoded).not.toBeNull();
      expect(decoded!.globalStyles?.fontSize).toBe(20);
      expect(decoded!.globalStyles?.textColor).toBe('#ff0000');
    });

    it('only includes non-default values', () => {
      const encoded = encodePresetToUrl(defaultStyles, {});
      const decoded = decodePresetFromUrl(encoded);
      // All values are default, so globalStyles diff should be empty/undefined
      expect(decoded).not.toBeNull();
      expect(decoded!.globalStyles).toBeUndefined();
    });

    it('includes elementStyles when provided', () => {
      const elementStyles: ElementStyles = {
        h1: { borderBottomStyle: 'dashed', borderBottomColor: '#333' },
        code: { borderRadius: 8 },
      };

      const encoded = encodePresetToUrl(defaultStyles, elementStyles);
      const decoded = decodePresetFromUrl(encoded);

      expect(decoded!.elementStyles?.h1?.borderBottomStyle).toBe('dashed');
      expect(decoded!.elementStyles?.h1?.borderBottomColor).toBe('#333');
      expect(decoded!.elementStyles?.code?.borderRadius).toBe(8);
    });

    it('includes listStyles and headingStyles', () => {
      const encoded = encodePresetToUrl(
        defaultStyles,
        {},
        { prefix: '>' },
        { h1: { fontSize: 48 } },
      );
      const decoded = decodePresetFromUrl(encoded);

      expect(decoded!.listStyles?.prefix).toBe('>');
      expect(decoded!.headingStyles?.h1?.fontSize).toBe(48);
    });

    it('returns null for invalid input', () => {
      expect(decodePresetFromUrl('not-valid-base64!!!')).toBeNull();
      expect(decodePresetFromUrl('')).toBeNull();
    });

    it('handles padding object diff', () => {
      const styles: GlobalStyles = {
        ...defaultStyles,
        padding: { top: 80, right: 40, bottom: 40, left: 40 },
      };

      const encoded = encodePresetToUrl(styles, {});
      const decoded = decodePresetFromUrl(encoded);
      expect(decoded!.globalStyles?.padding).toEqual({ top: 80, right: 40, bottom: 40, left: 40 });
    });
  });
});
