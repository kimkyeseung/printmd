import { describe, it, expect } from 'vitest';
import { switchLocalePath } from '../LanguageSwitcher';

describe('switchLocalePath', () => {
  it('swaps the locale prefix and keeps the rest of the path', () => {
    expect(switchLocalePath('/ko/guide', 'ja')).toBe('/ja/guide');
    expect(switchLocalePath('/en/presets/dark', 'zh')).toBe('/zh/presets/dark');
    expect(switchLocalePath('/zh', 'en')).toBe('/en');
  });

  it('only treats a whole first segment as a locale', () => {
    expect(switchLocalePath('/english-page', 'ko')).toBe('/ko/english-page');
    expect(switchLocalePath('/', 'ja')).toBe('/ja');
  });
});
