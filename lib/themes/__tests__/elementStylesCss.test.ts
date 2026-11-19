import { describe, it, expect } from 'vitest';
import { generateElementStylesCss } from '../cssVariables';
import { migrateLegacyCodeStyles } from '../migrateElementStyles';
import { encodePresetToUrl, decodePresetFromUrl } from '@/lib/share/presetUrl';
import { defaultStyles } from '../presets';

describe('generateElementStylesCss — code block', () => {
  const css = generateElementStylesCss({
    code: {
      marginTop: 24,
      paddingLeft: 20,
      borderStyle: 'solid',
      borderRadius: 8,
      lineHeight: 1.8,
    },
  });

  it('puts margin and padding on the <pre> block only', () => {
    expect(css).toContain('.preview-content pre { margin-top: 24px; padding-left: 20px }');
    expect(css).not.toMatch(/code[^{]*\{[^}]*margin-top/);
  });

  it('puts borders on the block only, never on inline code', () => {
    expect(css).toContain('.preview-content pre { border-style: solid; border-radius: 8px }');
    expect(css).not.toContain(':not(pre) > code');
  });

  it('keeps text properties on the block and its inner <code>', () => {
    expect(css).toContain('.preview-content pre, .preview-content pre code { line-height: 1.8 }');
  });
});

describe('generateElementStylesCss — inline code', () => {
  it('targets only code outside <pre>', () => {
    const css = generateElementStylesCss({ inlineCode: { color: '#c7254e', borderRadius: 2 } });
    expect(css).toBe('.preview-content :not(pre) > code { color: #c7254e; border-radius: 2px }');
  });

  it('leaves other elements in a single rule', () => {
    const p = generateElementStylesCss({ paragraph: { marginTop: 4, color: '#111111' } });
    expect(p).toBe('.preview-content p { color: #111111; margin-top: 4px }');
  });
});

describe('migrateLegacyCodeStyles', () => {
  it('copies the look the old shared code element gave inline code', () => {
    const out = migrateLegacyCodeStyles({
      code: { borderRadius: 4, borderStyle: 'solid', borderColor: '#e0e0e0', marginTop: 10, lineHeight: 2 },
    });
    expect(out?.inlineCode).toEqual({ borderRadius: 4, borderStyle: 'solid', borderColor: '#e0e0e0' });
    expect(out?.code?.marginTop).toBe(10);
  });

  it('leaves styles that already have inlineCode alone', () => {
    const styles = { code: { borderRadius: 4 }, inlineCode: { color: '#000000' } };
    expect(migrateLegacyCodeStyles(styles)).toBe(styles);
  });

  it('does nothing when there is no code style', () => {
    const styles = { h1: { color: '#000000' } };
    expect(migrateLegacyCodeStyles(styles)).toBe(styles);
  });
});

describe('shared preset links', () => {
  it('upgrades links made before the split', () => {
    const legacy = btoa(JSON.stringify({ e: { code: { borderRadius: 8 } } }));
    expect(decodePresetFromUrl(legacy)?.elementStyles?.inlineCode).toEqual({ borderRadius: 8 });
  });

  it('does not add inlineCode to current links', () => {
    const encoded = encodePresetToUrl(defaultStyles, { code: { borderRadius: 8 } });
    expect(decodePresetFromUrl(encoded)?.elementStyles?.inlineCode).toBeUndefined();
  });
});
