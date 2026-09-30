import { describe, it, expect } from 'vitest';
import { tabDisplayTitle, DEFAULT_TAB_TITLE } from '../tabTitle';

const draft = (content: string) => ({ title: DEFAULT_TAB_TITLE, content, documentId: null });

describe('tabDisplayTitle', () => {
  it('names a new draft after its first H1', () => {
    expect(tabDisplayTitle(draft('intro\n\n# 회의록\n\n## 안건'))).toBe('회의록');
  });

  it('strips inline markdown from the heading', () => {
    expect(tabDisplayTitle(draft('# **Q3** `plan`'))).toBe('Q3 plan');
  });

  it('returns null for a draft without an H1', () => {
    expect(tabDisplayTitle(draft('## only a subheading'))).toBeNull();
    expect(tabDisplayTitle(draft(''))).toBeNull();
  });

  it('keeps the name of a tab opened from a file', () => {
    expect(tabDisplayTitle({ title: 'notes', content: '# Other', documentId: null })).toBe('notes');
  });

  it('keeps the name of a saved document', () => {
    expect(tabDisplayTitle({ title: DEFAULT_TAB_TITLE, content: '# Heading', documentId: 'doc-1' })).toBe(
      DEFAULT_TAB_TITLE,
    );
  });
});
