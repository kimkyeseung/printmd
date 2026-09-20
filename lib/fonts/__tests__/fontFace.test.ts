import { describe, it, expect } from 'vitest';
import { buildFontFaceRule, buildFontFaceCss } from '../fontFace';

const validUrl = 'data:font/woff2;base64,d09GMgABAAAAAA==';

describe('buildFontFaceRule', () => {
  it('builds a rule for an uploaded data-URL font', () => {
    const rule = buildFontFaceRule({ name: 'MyBrand', url: validUrl });
    expect(rule).toContain("font-family: 'MyBrand'");
    expect(rule).toContain(`src: url('${validUrl}')`);
    expect(rule).toContain('font-display: swap');
  });

  it('accepts CJK font names', () => {
    const rule = buildFontFaceRule({ name: '나눔고딕', url: validUrl });
    expect(rule).toContain("font-family: '나눔고딕'");
  });

  it('rejects non-data URLs', () => {
    expect(buildFontFaceRule({ name: 'Remote', url: 'https://evil.test/f.woff2' })).toBe('');
    expect(buildFontFaceRule({ name: 'Relative', url: '/fonts/f.woff2' })).toBe('');
  });

  it('rejects a data URL carrying characters that could escape url()', () => {
    expect(
      buildFontFaceRule({ name: 'Broken', url: "data:font/woff2;base64,AAA'); } body { display: none" })
    ).toBe('');
  });

  it('rejects a non-base64 data URL', () => {
    expect(buildFontFaceRule({ name: 'Plain', url: 'data:font/woff2,AAAA' })).toBe('');
  });

  it('returns an empty string when the name sanitizes away', () => {
    expect(buildFontFaceRule({ name: '!!!', url: validUrl })).toBe('');
  });
});

describe('buildFontFaceCss', () => {
  it('joins every valid rule and drops the rest', () => {
    const css = buildFontFaceCss([
      { name: 'One', url: validUrl },
      { name: 'Remote', url: 'https://evil.test/f.woff2' },
      { name: 'Two', url: validUrl },
    ]);
    expect(css.match(/@font-face/g)).toHaveLength(2);
    expect(css).toContain("font-family: 'One'");
    expect(css).toContain("font-family: 'Two'");
    expect(css).not.toContain('evil.test');
  });

  it('returns an empty string for no fonts', () => {
    expect(buildFontFaceCss([])).toBe('');
  });
});
