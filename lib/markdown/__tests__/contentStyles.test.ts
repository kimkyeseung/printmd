import { describe, it, expect } from 'vitest';
import { getContentStyles, getFrontmatterDefaultBackground, getFrontmatterDefaultKeyColor } from '../contentStyles';

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

describe('syntax highlight styles', () => {
  it('colours hljs tokens with a light palette on light code backgrounds', () => {
    const css = getContentStyles({ codeBackground: '#f5f5f5' });
    expect(css).toMatch(/pre\.hljs \.hljs-keyword[^{]*\{ color: #d73a49; \}/);
  });

  it('switches to a dark palette on dark code backgrounds', () => {
    const css = getContentStyles({ codeBackground: '#1a1a1a' });
    expect(css).toMatch(/pre\.hljs \.hljs-keyword[^{]*\{ color: #ff7b72; \}/);
    expect(css).not.toContain('#d73a49');
  });
});

describe('code theme option', () => {
  it('paints the block with a named theme background and text colour', () => {
    const css = getContentStyles({ codeBackground: '#f5f5f5', codeTheme: 'one-dark' });
    expect(css).toContain('pre.hljs { background-color: #282c34; color: #abb2bf; }');
    expect(css).toMatch(/\.hljs-keyword[^{]*\{ color: #c678dd; \}/);
  });

  it('leaves the block background alone in auto mode', () => {
    const css = getContentStyles({ codeBackground: '#f5f5f5', codeTheme: 'auto' });
    expect(css).not.toMatch(/pre\.hljs \{ background-color/);
  });

  it('adds no token colours for none', () => {
    const css = getContentStyles({ codeTheme: 'none' });
    expect(css).not.toContain('.hljs-keyword');
  });
});

describe('getFrontmatterDefaultBackground', () => {
  it('blends the dark text tint over a light page', () => {
    expect(getFrontmatterDefaultBackground('#1a1a1a', '#ffffff')).toBe('#f9f9f9');
  });

  it('blends a light tint over a dark page', () => {
    expect(getFrontmatterDefaultBackground('#e0e0e0', '#1a1a1a')).toBe('#202020');
  });

  it('falls back to the translucent tint for non-hex backgrounds', () => {
    expect(getFrontmatterDefaultBackground('#1a1a1a', 'white')).toBe('rgba(0, 0, 0, 0.025)');
  });
});

describe('getFrontmatterDefaultKeyColor', () => {
  it('matches the 55% text tint over the page', () => {
    expect(getFrontmatterDefaultKeyColor('#1a1a1a', '#ffffff')).toBe('#818181');
  });

  it('follows a coloured text colour', () => {
    expect(getFrontmatterDefaultKeyColor('#cc0000', '#ffffff')).toBe('#e37373');
  });
});

describe('frontmatter cells', () => {
  it('give values their own colour so table cell styles cannot leak in', () => {
    const css = getContentStyles({ textColor: '#333333' });
    expect(css).toMatch(/table\.frontmatter td \{[^}]*color: #333333;/);
  });
});
