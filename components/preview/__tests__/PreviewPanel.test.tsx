import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PreviewPanel } from '../PreviewPanel';

const mockUpdateGlobalStyles = vi.fn();

vi.mock('@/stores', () => ({
  usePrintStore: (selector: (s: Record<string, unknown>) => unknown) => selector({ settings: {} }),
  useStyleStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({ updateGlobalStyles: mockUpdateGlobalStyles }),
}));

vi.mock('@/lib/print/printDocument', () => ({
  getPrintGeometry: () => ({ contentWidthPx: 640 }),
}));

vi.mock('../Preview', () => ({ Preview: () => null }));

const styles = {
  fontSize: 16,
  fontFamily: 'sans-serif',
  lineHeight: 1.6,
  textColor: '#1a1a1a',
  backgroundColor: '#ffffff',
  linkColor: '#0366d6',
  codeBackground: '#f5f5f5',
  maxWidth: 800,
  padding: { top: 40, right: 40, bottom: 40, left: 40 },
};

describe('PreviewPanel - print width button', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sets the width to the printed column plus the preview padding', () => {
    render(<PreviewPanel markdown="" styles={styles} />);
    const button = screen.getByRole('button', { name: 'Print width' });
    expect(button.getAttribute('aria-pressed')).toBe('false');

    fireEvent.click(button);
    expect(mockUpdateGlobalStyles).toHaveBeenCalledWith({ maxWidth: 720 });
  });

  it('shows as pressed once the width matches', () => {
    render(<PreviewPanel markdown="" styles={{ ...styles, maxWidth: 720 }} />);
    expect(screen.getByRole('button', { name: 'Print width' }).getAttribute('aria-pressed')).toBe('true');
  });
});
