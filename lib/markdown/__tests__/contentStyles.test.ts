import { describe, it, expect } from 'vitest';
import { getContentStyles } from '../contentStyles';

describe('getContentStyles', () => {
  const css = getContentStyles();

  it('returns a non-empty CSS string', () => {
    expect(css.trim().length).toBeGreaterThan(0);
  });

  it('does NOT contain color-mix() (kept for older-browser support)', () => {
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

  it('includes task-list styles without flex (nested lists must wrap)', () => {
    expect(css).toContain('.preview-content .task-list');
    expect(css).toContain('.preview-content .task-list-item');
    const taskItemBlock = css.match(
      /\.preview-content \.task-list-item\s*\{[^}]*\}/
    )?.[0];
    expect(taskItemBlock).toBeDefined();
    expect(taskItemBlock).not.toMatch(/display:\s*flex/);
  });

  it('styles all preview checkboxes (list and paragraph)', () => {
    expect(css).toMatch(/\.preview-content input\[type="checkbox"\]\s*\{/);
  });

  // --- Rules absorbed from preview.css so the PDF renders them too ---

  it('lays consecutive badge paragraphs out inline', () => {
    expect(css).toContain('img[src*="shields.io"]');
    expect(css).toContain('p:has(> a:only-child > img) + p:has(> a:only-child > img)');
  });

  it('rounds image corners', () => {
    const imgBlock = css.match(/\.preview-content img\s*\{[^}]*\}/)?.[0];
    expect(imgBlock).toContain('border-radius: 4px');
  });

  it('gives task lists the same bottom margin as other lists', () => {
    const taskListBlock = css.match(/\.preview-content \.task-list\s*\{[^}]*\}/)?.[0];
    expect(taskListBlock).toContain('margin-bottom: 1em');
  });

  // --- Theme-derived colors ---

  it('derives overlays from light text on a dark theme', () => {
    // The old preview.css hardcoded rgba(0,0,0,...), which rendered invisible
    // borders on dark backgrounds while the PDF drew them correctly.
    const darkCss = getContentStyles({ textColor: '#e0e0e0' });
    expect(darkCss).toContain('rgba(255, 255, 255, 0.20)');
    expect(darkCss).not.toContain('rgba(0, 0, 0');
  });

  it('uses the theme link color for links and checked checkboxes', () => {
    const themed = getContentStyles({ linkColor: '#ff0088' });
    expect(themed).toContain('color: #ff0088');
    expect(themed).toContain('background-color: #ff0088');
  });
});
