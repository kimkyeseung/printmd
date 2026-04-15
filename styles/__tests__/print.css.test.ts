import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('print.css', () => {
  const css = readFileSync(resolve(__dirname, '../print.css'), 'utf-8');

  it('hides the print preview modal and backdrop', () => {
    expect(css).toContain('.print-preview-modal');
    expect(css).toContain('.print-preview-backdrop');
  });

  it('hides UI elements but not checkboxes', () => {
    // Checkboxes should NOT be hidden — they are used for task lists
    expect(css).toContain('input:not([type="checkbox"])');
    // Should NOT have a bare "input" in the hide list
    expect(css).not.toMatch(/^\s*input,$/m);
  });

  it('does not hardcode color values that override theme styles', () => {
    // These hardcoded colors were previously overriding preset theme styles
    expect(css).not.toContain('background: #f5f5f5');
    expect(css).not.toContain('border: 1px solid #ddd');
    expect(css).not.toContain('border-left: 4px solid #ccc');
    expect(css).not.toContain('color: #555');
    expect(css).not.toContain('color: #666');
  });

  it('does not force link color to inherit (respects theme)', () => {
    expect(css).not.toContain('color: inherit');
  });

  it('includes page-break controls for headings', () => {
    expect(css).toContain('page-break-after: avoid');
    expect(css).toContain('break-after: avoid');
  });

  it('includes orphan/widow controls', () => {
    expect(css).toContain('orphans: 3');
    expect(css).toContain('widows: 3');
  });

  it('includes break-inside avoid for tables and code blocks', () => {
    expect(css).toContain('break-inside: avoid');
  });

  it('includes pre wrap for print overflow', () => {
    expect(css).toContain('white-space: pre-wrap');
    expect(css).toContain('word-wrap: break-word');
  });
});
