import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  resolveTemplate,
  extractTitle,
  renderTextToImage,
  calcAlignedX,
} from '../pdfTextRenderer';

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

  it('handles Korean title correctly', () => {
    const koreanVars = { ...vars, title: 'Sillok Roadmap — 2026년 실행 계획' };
    const result = resolveTemplate('{title}', koreanVars);
    expect(result).toBe('Sillok Roadmap — 2026년 실행 계획');
  });

  it('handles empty template string', () => {
    expect(resolveTemplate('', vars)).toBe('');
  });
});

describe('extractTitle', () => {
  it('extracts title from first H1 line', () => {
    expect(extractTitle('# My Title\n\nSome content')).toBe('My Title');
  });

  it('extracts Korean title', () => {
    expect(extractTitle('# Sillok Roadmap — 2026년 실행 계획\n\n내용')).toBe(
      'Sillok Roadmap — 2026년 실행 계획'
    );
  });

  it('returns Untitled when no H1 found', () => {
    expect(extractTitle('## Only H2\n\nContent')).toBe('Untitled');
  });

  it('returns Untitled for empty string', () => {
    expect(extractTitle('')).toBe('Untitled');
  });

  it('ignores H2 and deeper headings', () => {
    expect(extractTitle('## H2\n### H3\n# H1 Title')).toBe('H1 Title');
  });
});

describe('renderTextToImage', () => {
  beforeEach(() => {
    // jsdom provides a minimal canvas, so we mock getContext
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      font: '',
      fillStyle: '',
      textBaseline: '',
      measureText: vi.fn(() => ({ width: 100 })),
      fillText: vi.fn(),
    } as unknown as CanvasRenderingContext2D);

    vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue(
      'data:image/png;base64,MOCK'
    );
  });

  it('returns null for empty text', () => {
    expect(renderTextToImage('', 9, '#000', 'sans-serif')).toBeNull();
  });

  it('returns dataUrl and dimensions for valid text', () => {
    const result = renderTextToImage('Hello', 9, '#000', 'sans-serif');
    expect(result).not.toBeNull();
    expect(result!.dataUrl).toContain('data:image/png');
    expect(result!.widthMm).toBeGreaterThan(0);
    expect(result!.heightMm).toBeGreaterThan(0);
  });

  it('renders Korean text without error', () => {
    const result = renderTextToImage('실행 계획', 9, '#666', 'sans-serif');
    expect(result).not.toBeNull();
    expect(result!.dataUrl).toContain('data:image/png');
  });

  it('uses provided font family', () => {
    const mockCtx = {
      font: '',
      fillStyle: '',
      textBaseline: '',
      measureText: vi.fn(() => ({ width: 80 })),
      fillText: vi.fn(),
    } as unknown as CanvasRenderingContext2D;

    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(mockCtx);

    renderTextToImage('Test', 9, '#000', 'Noto Sans KR');
    expect(mockCtx.font).toContain('Noto Sans KR');
  });
});

describe('calcAlignedX', () => {
  // A4: 210mm width, margins 20mm each side
  const pageWidth = 210;
  const mLeft = 20;
  const mRight = 20;

  it('left aligns at marginLeft', () => {
    expect(calcAlignedX('left', 50, pageWidth, mLeft, mRight)).toBe(20);
  });

  it('center aligns to center of page', () => {
    const x = calcAlignedX('center', 50, pageWidth, mLeft, mRight);
    expect(x).toBe((210 - 50) / 2); // 80
  });

  it('right aligns flush to right margin', () => {
    const x = calcAlignedX('right', 50, pageWidth, mLeft, mRight);
    expect(x).toBe(210 - 20 - 50); // 140
  });
});
