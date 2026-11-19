import { describe, it, expect } from 'vitest';
import { normalizeCodeLanguage, readFenceLanguage, setFenceLanguage, CODE_LANGUAGES } from '../codeLanguages';
import { hljs } from '../hljs';

describe('fence language helpers', () => {
  it('reads the language from backtick and tilde fences', () => {
    expect(readFenceLanguage('```ts')).toBe('ts');
    expect(readFenceLanguage('~~~python')).toBe('python');
    expect(readFenceLanguage('```')).toBe('');
    expect(readFenceLanguage('const x = 1;')).toBeNull();
  });

  it('rewrites only the language, keeping indent, fence length and extras', () => {
    expect(setFenceLanguage('```ts', 'python')).toBe('```python');
    expect(setFenceLanguage('  ````js title="a.js"', 'tsx')).toBe('  ````tsx title="a.js"');
    expect(setFenceLanguage('```', 'go')).toBe('```go');
    expect(setFenceLanguage('```rust', '')).toBe('```');
  });

  it('maps aliases to list values', () => {
    expect(normalizeCodeLanguage('ts')).toBe('typescript');
    expect(normalizeCodeLanguage('Py')).toBe('python');
    expect(normalizeCodeLanguage('text')).toBe('');
    expect(normalizeCodeLanguage('elixir')).toBe('elixir');
  });

  it('only offers languages highlight.js can colour', () => {
    for (const { value } of CODE_LANGUAGES) {
      expect(hljs.getLanguage(value), value).toBeTruthy();
    }
  });
});
