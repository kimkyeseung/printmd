import { describe, it, expect } from 'vitest';
import { getPdfStyles } from '../pdfStyles';

describe('getPdfStyles', () => {
  const css = getPdfStyles();

  it('returns a non-empty CSS string', () => {
    expect(css.trim().length).toBeGreaterThan(0);
  });

  it('does NOT contain color-mix() (html2canvas cannot parse it)', () => {
    expect(css).not.toContain('color-mix(');
  });

  it('uses rgba() values instead of color-mix()', () => {
    // These are the critical rgba values that replaced color-mix()
    expect(css).toContain('rgba(0, 0, 0, 0.15)'); // h1/h2 border
    expect(css).toContain('rgba(0, 0, 0, 0.25)'); // blockquote border
    expect(css).toContain('rgba(0, 0, 0, 0.04)'); // blockquote bg
    expect(css).toContain('rgba(0, 0, 0, 0.20)'); // hr bg, table border
    expect(css).toContain('rgba(0, 0, 0, 0.06)'); // th bg
    expect(css).toContain('rgba(0, 0, 0, 0.03)'); // even row bg
  });

  it('includes .preview-content selector', () => {
    expect(css).toContain('.preview-content');
  });

  it('includes heading styles', () => {
    expect(css).toContain('.preview-content h1');
    expect(css).toContain('.preview-content h2');
    expect(css).toContain('.preview-content h3');
  });

  it('includes table styles', () => {
    expect(css).toContain('.preview-content table');
    expect(css).toContain('.preview-content table th');
    expect(css).toContain('.preview-content table td');
  });

  it('includes code and pre styles', () => {
    expect(css).toContain('.preview-content code');
    expect(css).toContain('.preview-content pre');
  });
});
