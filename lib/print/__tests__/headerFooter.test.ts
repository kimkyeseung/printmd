import { describe, it, expect } from 'vitest';
import { resolveTemplate, extractTitle, cleanTitle } from '../headerFooter';

describe('resolveTemplate', () => {
  const vars = { title: 'My Document', date: '2026-04-15', page: 2, pages: 5 };

  it('replaces all template variables', () => {
    const result = resolveTemplate('{title} — {date} — {page}/{pages}', vars);
    expect(result).toBe('My Document — 2026-04-15 — 2/5');
  });

  it('replaces multiple occurrences of the same variable', () => {
    expect(resolveTemplate('{page} of {pages} | {page}', vars)).toBe('2 of 5 | 2');
  });

  it('preserves text without template variables', () => {
    expect(resolveTemplate('Static Header', vars)).toBe('Static Header');
  });

  it('handles a Korean title correctly', () => {
    const koreanVars = { ...vars, title: 'Sillok Roadmap — 2026년 실행 계획' };
    expect(resolveTemplate('{title}', koreanVars)).toBe('Sillok Roadmap — 2026년 실행 계획');
  });

  it('returns an empty string for an empty template', () => {
    expect(resolveTemplate('', vars)).toBe('');
  });
});

describe('extractTitle', () => {
  it('takes the first H1', () => {
    expect(extractTitle('# First\n\nbody\n\n# Second')).toBe('First');
  });

  it('ignores deeper headings', () => {
    expect(extractTitle('## Not this\n\n# This one')).toBe('This one');
  });

  it('falls back to Untitled when there is no H1', () => {
    expect(extractTitle('just some text')).toBe('Untitled');
    expect(extractTitle('')).toBe('Untitled');
  });

  it('handles a Korean heading', () => {
    expect(extractTitle('# 실행 계획\n\n본문')).toBe('실행 계획');
  });
});

describe('cleanTitle', () => {
  it('strips markdown inline syntax left in the heading', () => {
    expect(cleanTitle('**Bold** and `code`')).toBe('Bold and code');
  });

  it('removes characters filesystems reject', () => {
    expect(cleanTitle('a/b\\c:d*e?f"g<h>i|j')).toBe('abcdefghij');
  });

  it('preserves CJK', () => {
    expect(cleanTitle('2026년 실행 계획')).toBe('2026년 실행 계획');
  });

  it('collapses whitespace', () => {
    expect(cleanTitle('  too   many    spaces  ')).toBe('too many spaces');
  });

  it('caps the length', () => {
    expect(cleanTitle('x'.repeat(200))).toHaveLength(80);
  });

  it('falls back to Untitled when nothing survives', () => {
    expect(cleanTitle('***')).toBe('Untitled');
    expect(cleanTitle('   ')).toBe('Untitled');
  });
});
