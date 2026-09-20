import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('preview.css', () => {
  const css = readFileSync(resolve(__dirname, '../preview.css'), 'utf-8');

  it('scopes every rule to .preview-content', () => {
    const selectors = css.match(/^[^@\s/][^{]*\{/gm) ?? [];
    expect(selectors.length).toBeGreaterThan(0);
    for (const selector of selectors) {
      expect(selector).toContain('.preview-content');
    }
  });

  it('holds only screen-only affordances', () => {
    // Anything that changes how content *looks* belongs in
    // lib/markdown/contentStyles.ts so the PDF renders it too. Keeping this
    // file free of visual rules is what stops preview/PDF drift.
    expect(css).toMatch(/:hover|cursor:/);

    const visualProperties = [
      'font-size',
      'font-weight',
      'margin',
      'padding',
      'border-radius',
      'background-color',
      'line-height',
      'display',
    ];
    for (const property of visualProperties) {
      expect(css).not.toContain(`${property}:`);
    }
  });

  it('does not hardcode colors against a white background', () => {
    // These were the source of inverted borders on dark themes; contentStyles
    // derives them from the active text color instead.
    expect(css).not.toContain('rgba(0, 0, 0');
    expect(css).not.toContain('color-mix(');
  });
});
