import { describe, it, expect } from 'vitest';
import { parseMarkdown } from '../parser';

describe('parseMarkdown', () => {
  it('converts heading markdown to HTML', () => {
    const result = parseMarkdown('# Hello');
    expect(result).toContain('<h1');
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
    expect(result).toContain('<ul');
    expect(result).toContain('<li');
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
    expect(result).toContain('<table');
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
    expect(result).toContain('<blockquote');
    expect(result).toContain('quote text');
  });

  it('renders bold when ** is adjacent to CJK characters', () => {
    const result = parseMarkdown("분야에서 **'원전+수소 융합'**이 중요하다");
    expect(result).toContain('<strong>');
    expect(result).toContain('원전+수소 융합');
  });

  it('renders bold when CJK text wraps ** on both sides', () => {
    const result = parseMarkdown('한국어**굵게**처리');
    expect(result).toContain('<strong>굵게</strong>');
  });

  it('renders italic when _ is adjacent to CJK characters', () => {
    const result = parseMarkdown('한국의_이탤릭_처리');
    expect(result).toContain('<em>이탤릭</em>');
  });
});

describe('lineAnnotationPlugin', () => {
  it('adds data-line and data-line-end to heading', () => {
    const result = parseMarkdown('# Hello');
    expect(result).toContain('data-line="0"');
    expect(result).toContain('data-line-end="1"');
  });

  it('adds data-line and data-line-end to paragraph', () => {
    const result = parseMarkdown('Some paragraph text');
    expect(result).toContain('data-line="0"');
    expect(result).toContain('data-line-end="1"');
  });

  it('adds correct line numbers for multi-block content', () => {
    const result = parseMarkdown('# Heading\n\nParagraph');
    // heading: lines 0-1
    expect(result).toMatch(/<h1[^>]*data-line="0"[^>]*data-line-end="1"/);
    // paragraph: lines 2-3
    expect(result).toMatch(/<p[^>]*data-line="2"[^>]*data-line-end="3"/);
  });

  it('adds data-line and data-line-end to blockquote', () => {
    const result = parseMarkdown('> quote text');
    expect(result).toMatch(/<blockquote[^>]*data-line="0"/);
    expect(result).toMatch(/<blockquote[^>]*data-line-end="1"/);
  });

  it('adds data-line and data-line-end to ul', () => {
    const result = parseMarkdown('- item1\n- item2');
    expect(result).toMatch(/<ul[^>]*data-line="0"/);
    expect(result).toMatch(/<ul[^>]*data-line-end="2"/);
  });

  it('adds data-line and data-line-end to fence (code block) via <pre>', () => {
    const result = parseMarkdown('```javascript\nconst x = 1;\n```');
    expect(result).toMatch(/<pre[^>]*data-line="0"/);
    expect(result).toMatch(/<pre[^>]*data-line-end="3"/);
  });

  it('adds data-line to fence without language', () => {
    const result = parseMarkdown('```\nplain code\n```');
    expect(result).toMatch(/<pre[^>]*data-line="0"/);
    expect(result).toMatch(/<pre[^>]*data-line-end="3"/);
  });

  it('does not break task list checkbox data-line', () => {
    const result = parseMarkdown('- [ ] task item');
    expect(result).toContain('type="checkbox"');
    expect(result).toMatch(/data-line="0"/);
  });
});
