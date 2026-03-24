import { describe, it, expect } from 'vitest';
import { sanitizeHtml, createSafeHtml } from '../sanitizer';

describe('sanitizeHtml', () => {
  it('removes <script> tags', () => {
    const result = sanitizeHtml('<p>hello</p><script>alert("xss")</script>');
    expect(result).not.toContain('<script');
    expect(result).not.toContain('alert');
    expect(result).toContain('<p>hello</p>');
  });

  it('removes <iframe> tags', () => {
    const result = sanitizeHtml('<iframe src="evil.com"></iframe><p>ok</p>');
    expect(result).not.toContain('<iframe');
    expect(result).toContain('<p>ok</p>');
  });

  it('removes event handler attributes', () => {
    const result = sanitizeHtml('<img src="x" onerror="alert(1)">');
    expect(result).not.toContain('onerror');
  });

  it('removes onclick attributes', () => {
    const result = sanitizeHtml('<div onclick="alert(1)">text</div>');
    expect(result).not.toContain('onclick');
  });

  it('preserves allowed tags', () => {
    const html = '<h1>Title</h1><p>text</p><ul><li>item</li></ul>';
    const result = sanitizeHtml(html);
    expect(result).toContain('<h1>');
    expect(result).toContain('<p>');
    expect(result).toContain('<ul>');
    expect(result).toContain('<li>');
  });

  it('preserves allowed attributes', () => {
    const html = '<a href="https://example.com" target="_blank" rel="noopener">link</a>';
    const result = sanitizeHtml(html);
    expect(result).toContain('href="https://example.com"');
    expect(result).toContain('target="_blank"');
  });

  it('preserves images with allowed attributes', () => {
    const html = '<img src="photo.jpg" alt="Photo" width="200">';
    const result = sanitizeHtml(html);
    expect(result).toContain('src="photo.jpg"');
    expect(result).toContain('alt="Photo"');
  });

  it('removes <form> tags', () => {
    const result = sanitizeHtml('<form action="/"><input type="text"></form>');
    expect(result).not.toContain('<form');
  });

  it('preserves table tags', () => {
    const html = '<table><thead><tr><th>H</th></tr></thead><tbody><tr><td>D</td></tr></tbody></table>';
    const result = sanitizeHtml(html);
    expect(result).toContain('<table>');
    expect(result).toContain('<th>');
    expect(result).toContain('<td>');
  });

  it('preserves data-line attribute', () => {
    const html = '<p data-line="0">text</p>';
    const result = sanitizeHtml(html);
    expect(result).toContain('data-line="0"');
  });

  it('preserves data-line-end attribute', () => {
    const html = '<h1 data-line="0" data-line-end="1">Title</h1>';
    const result = sanitizeHtml(html);
    expect(result).toContain('data-line-end="1"');
  });

  it('preserves both data-line and data-line-end together', () => {
    const html = '<pre data-line="5" data-line-end="10"><code>code</code></pre>';
    const result = sanitizeHtml(html);
    expect(result).toContain('data-line="5"');
    expect(result).toContain('data-line-end="10"');
  });

  it('strips other data-* attributes', () => {
    const html = '<p data-custom="bad" data-line="0">text</p>';
    const result = sanitizeHtml(html);
    expect(result).not.toContain('data-custom');
    expect(result).toContain('data-line="0"');
  });
});

describe('createSafeHtml', () => {
  it('parses markdown and sanitizes the result', () => {
    const parser = (md: string) => `<p>${md}</p><script>bad</script>`;
    const result = createSafeHtml('hello', parser);
    expect(result).toContain('<p>hello</p>');
    expect(result).not.toContain('<script');
  });
});
