import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('preview.css', () => {
  const css = readFileSync(resolve(__dirname, '../preview.css'), 'utf-8');

  it('does NOT contain color-mix() (html2canvas cannot parse it)', () => {
    expect(css).not.toContain('color-mix(');
  });

  it('uses rgba() for opacity values', () => {
    expect(css).toContain('rgba(0, 0, 0, 0.25)');
    expect(css).toContain('rgba(0, 0, 0, 0.04)');
    expect(css).toContain('rgba(0, 0, 0, 0.20)');
    expect(css).toContain('rgba(0, 0, 0, 0.06)');
    expect(css).toContain('rgba(0, 0, 0, 0.03)');
  });

  it('includes .preview-content selectors', () => {
    expect(css).toContain('.preview-content');
  });
});
