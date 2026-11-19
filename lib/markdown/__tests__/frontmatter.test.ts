import { describe, it, expect } from 'vitest';
import { extractFrontmatter, stripFrontmatter } from '../frontmatter';
import { parseMarkdown } from '../parser';

const doc = [
  '---',
  'name: "state-ownership-pattern"',
  "title: 'Hello: world'",
  'tags: [react, zustand]',
  'authors:',
  '  - kim',
  '  - lee',
  'summary: >',
  '  folded',
  '  text',
  'notes: |',
  '  line one',
  '  line two',
  '# a comment',
  '---',
  '',
  'Body paragraph.',
].join('\n');

describe('extractFrontmatter', () => {
  it('reads common YAML shapes', () => {
    const fm = extractFrontmatter(doc);
    expect(fm?.lineCount).toBe(15);
    expect(fm?.entries).toEqual([
      { key: 'name', value: 'state-ownership-pattern' },
      { key: 'title', value: 'Hello: world' },
      { key: 'tags', value: 'react, zustand' },
      { key: 'authors', value: 'kim, lee' },
      { key: 'summary', value: 'folded text' },
      { key: 'notes', value: 'line one\nline two' },
    ]);
  });

  it('ignores a leading horizontal rule that is not YAML', () => {
    expect(extractFrontmatter('---\nJust text\n---\nmore')).toBeNull();
    expect(extractFrontmatter('Intro\n---\nkey: v\n---')).toBeNull();
  });

  it('needs a closing fence', () => {
    expect(extractFrontmatter('---\nkey: v\nbody')).toBeNull();
  });

  it('accepts CRLF line endings', () => {
    expect(extractFrontmatter('---\r\nkey: v\r\n---\r\nbody')?.entries).toEqual([{ key: 'key', value: 'v' }]);
  });
});

describe('parseMarkdown with frontmatter', () => {
  const html = parseMarkdown(doc);

  it('renders a frontmatter table instead of a giant heading', () => {
    expect(html).toContain('<table class="frontmatter" data-line="0" data-line-end="15">');
    expect(html).toContain('<th>name</th><td>state-ownership-pattern</td>');
    expect(html).not.toContain('<h2');
    expect(html).not.toContain('<hr');
  });

  it('keeps body line numbers pointing at the source', () => {
    expect(html).toContain('<p data-line="16" data-line-end="17">Body paragraph.</p>');
  });

  it('escapes values', () => {
    expect(parseMarkdown('---\nk: <b>x</b>\n---')).toContain('<td>&lt;b&gt;x&lt;/b&gt;</td>');
  });
});

describe('stripFrontmatter', () => {
  it('drops the block so slides do not split on its fences', () => {
    expect(stripFrontmatter('---\nk: v\n---\n# Slide 1\n---\n# Slide 2')).toBe('# Slide 1\n---\n# Slide 2');
  });
});
