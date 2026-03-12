import { describe, it, expect } from 'vitest';
import { parseMarkdown } from '../parser';

describe('parseMarkdown', () => {
  it('converts heading markdown to HTML', () => {
    const result = parseMarkdown('# Hello');
    expect(result).toContain('<h1>');
    expect(result).toContain('Hello');
    expect(result).toContain('</h1>');
  });

  it('converts bold and italic', () => {
    const result = parseMarkdown('**bold** and *italic*');
    expect(result).toContain('<strong>bold</strong>');
    expect(result).toContain('<em>italic</em>');
  });

  it('converts lists', () => {
    const result = parseMarkdown('- item1\n- item2');
    expect(result).toContain('<ul>');
    expect(result).toContain('<li>');
    expect(result).toContain('item1');
    expect(result).toContain('item2');
  });

  it('converts code blocks with language', () => {
    const result = parseMarkdown('```javascript\nconst x = 1;\n```');
    expect(result).toContain('<pre');
    expect(result).toContain('<code');
    expect(result).toContain('language-javascript');
  });

  it('converts inline code', () => {
    const result = parseMarkdown('use `npm install`');
    expect(result).toContain('<code>npm install</code>');
  });

  it('converts tables', () => {
    const result = parseMarkdown('| A | B |\n|---|---|\n| 1 | 2 |');
    expect(result).toContain('<table>');
    expect(result).toContain('<th>');
    expect(result).toContain('<td>');
  });

  it('adds target="_blank" to external links', () => {
    const result = parseMarkdown('[Google](https://google.com)');
    expect(result).toContain('target="_blank"');
    expect(result).toContain('rel="noopener noreferrer"');
    expect(result).toContain('href="https://google.com"');
  });

  it('does NOT add target="_blank" to relative links', () => {
    const result = parseMarkdown('[page](/about)');
    expect(result).not.toContain('target="_blank"');
    expect(result).toContain('href="/about"');
  });

  it('handles empty input', () => {
    const result = parseMarkdown('');
    expect(result).toBe('');
  });

  it('converts blockquotes', () => {
    const result = parseMarkdown('> quote text');
    expect(result).toContain('<blockquote>');
    expect(result).toContain('quote text');
  });
});
