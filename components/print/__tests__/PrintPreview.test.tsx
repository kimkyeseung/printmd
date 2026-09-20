import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PrintPreview } from '../PrintPreview';

// The paged preview owns the printable iframe; here we only care that
// PrintPreview hands printing off to it.
const mockPrint = vi.fn<() => boolean>(() => true);

vi.mock('../PagedPreview', () => ({
  PagedPreview: (props: {
    markdown: string;
    ref?: { current: { print: () => boolean } | null };
  }) => {
    if (props.ref) props.ref.current = { print: mockPrint };
    return (
      <div data-testid="paged-preview" data-markdown={props.markdown}>
        Paged Preview
      </div>
    );
  },
}));

const mockShowToast = vi.fn();
vi.mock('@/components/ui/Toast', () => ({
  showToast: (...args: unknown[]) => mockShowToast(...args),
}));

vi.mock('@/stores', () => ({
  usePrintStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({
      settings: {
        paperSize: 'A4',
        orientation: 'portrait',
        margins: { top: 20, right: 20, bottom: 20, left: 20 },
        includeBackground: false,
        header: { enabled: false, left: '', center: '', right: '' },
        footer: { enabled: false, left: '', center: '', right: '' },
      },
      updateSettings: vi.fn(),
      updateHeader: vi.fn(),
      updateFooter: vi.fn(),
    }),
  useStyleStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({
      globalStyles: {
        fontSize: 16,
        fontFamily: 'sans-serif',
        lineHeight: 1.6,
        textColor: '#1a1a1a',
        backgroundColor: '#ffffff',
        linkColor: '#0366d6',
        codeBackground: '#f5f5f5',
        maxWidth: 800,
        padding: { top: 40, right: 40, bottom: 40, left: 40 },
      },
      elementStyles: {},
      customFonts: [],
    }),
}));

vi.mock('../PrintSettings', () => ({
  PrintSettings: () => <div data-testid="print-settings">Settings</div>,
}));

vi.mock('../HeaderFooter', () => ({
  HeaderFooter: () => <div data-testid="header-footer">Header Footer</div>,
}));

vi.mock('@/lib/print/paperSizes', () => ({
  getPaperDimensions: () => ({ width: 210, height: 297 }),
  mmToPx: (mm: number) => mm * 3.78,
}));

describe('PrintPreview', () => {
  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockPrint.mockReturnValue(true);
  });

  // --- Rendering ---

  it('does not render when isOpen is false', () => {
    const { container } = render(
      <PrintPreview isOpen={false} onClose={onClose} content="# Test" />
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders the modal when isOpen is true', () => {
    render(<PrintPreview isOpen={true} onClose={onClose} content="# Test" />);
    expect(screen.getByText('Print Preview')).toBeInTheDocument();
  });

  it('passes content to PagedPreview rather than reading it from the store', () => {
    const testContent = '# My Test Content';
    render(<PrintPreview isOpen={true} onClose={onClose} content={testContent} />);
    expect(screen.getByTestId('paged-preview')).toHaveAttribute(
      'data-markdown',
      testContent
    );
  });

  it('has the classes print.css uses to hide the modal from native print', () => {
    const { container } = render(
      <PrintPreview isOpen={true} onClose={onClose} content="# Test" />
    );
    expect(container.querySelector('.print-preview-modal')).toBeInTheDocument();
    expect(container.querySelector('.print-preview-backdrop')).toBeInTheDocument();
  });

  // --- Printing ---

  it('offers a single action for printing and saving a PDF', () => {
    render(<PrintPreview isOpen={true} onClose={onClose} content="# Test" />);
    expect(screen.getByRole('button', { name: 'Print / Save PDF' })).toBeInTheDocument();
    // The browser's own dialog covers both, so there is no separate export button.
    expect(screen.queryByRole('button', { name: 'Save PDF' })).not.toBeInTheDocument();
  });

  it('tells the user where the PDF comes from', () => {
    render(<PrintPreview isOpen={true} onClose={onClose} content="# Test" />);
    expect(screen.getByText(/Save as PDF/i)).toBeInTheDocument();
  });

  it('prints through the paged preview', () => {
    render(<PrintPreview isOpen={true} onClose={onClose} content="# Test" />);
    fireEvent.click(screen.getByRole('button', { name: 'Print / Save PDF' }));
    expect(mockPrint).toHaveBeenCalledTimes(1);
    expect(mockShowToast).not.toHaveBeenCalled();
  });

  it('warns instead of printing while pagination is still running', () => {
    mockPrint.mockReturnValue(false);
    render(<PrintPreview isOpen={true} onClose={onClose} content="# Test" />);
    fireEvent.click(screen.getByRole('button', { name: 'Print / Save PDF' }));
    expect(mockShowToast).toHaveBeenCalledWith(
      expect.stringContaining('laying out'),
      'info'
    );
  });

  it('does not call window.print() on the app document', () => {
    const windowPrint = vi.spyOn(window, 'print').mockImplementation(() => {});
    render(<PrintPreview isOpen={true} onClose={onClose} content="# Test" />);
    fireEvent.click(screen.getByRole('button', { name: 'Print / Save PDF' }));
    expect(windowPrint).not.toHaveBeenCalled();
    windowPrint.mockRestore();
  });

  it('closes on Cancel', () => {
    render(<PrintPreview isOpen={true} onClose={onClose} content="# Test" />);
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onClose).toHaveBeenCalled();
  });
});
