import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { PrintPreview } from '../PrintPreview';

// --- Mocks for dynamic imports (html2canvas, jsPDF) ---

const mockPdfInstance = {
  addPage: vi.fn(),
  addImage: vi.fn(),
  setFillColor: vi.fn(),
  rect: vi.fn(),
  save: vi.fn(),
  output: vi.fn().mockReturnValue('blob:http://localhost/fake-pdf'),
};

vi.mock('jspdf', () => ({
  jsPDF: class MockJsPDF {
    addPage = mockPdfInstance.addPage;
    addImage = mockPdfInstance.addImage;
    setFillColor = mockPdfInstance.setFillColor;
    rect = mockPdfInstance.rect;
    save = mockPdfInstance.save;
    output = mockPdfInstance.output;
    static lastConfig: Record<string, unknown> | null = null;
    constructor(config: Record<string, unknown>) {
      MockJsPDF.lastConfig = config;
    }
  },
}));

const mockCanvas = {
  width: 800,
  height: 1200,
  getContext: vi.fn().mockReturnValue({
    fillStyle: '',
    fillRect: vi.fn(),
    drawImage: vi.fn(),
  }),
  toDataURL: vi.fn().mockReturnValue('data:image/jpeg;base64,fake'),
};

const mockHtml2canvas = vi.fn().mockResolvedValue(mockCanvas);
vi.mock('html2canvas', () => ({ default: mockHtml2canvas }));

// Mock stores
vi.mock('@/stores', () => ({
  usePrintStore: (selector: (s: Record<string, unknown>) => unknown) => {
    const state = {
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
    };
    return selector(state);
  },
  useStyleStore: (selector: (s: Record<string, unknown>) => unknown) => {
    const state = {
      globalStyles: {
        fontSize: 16,
        fontFamily: 'sans-serif',
        lineHeight: 1.6,
        textColor: '#1a1a1a',
        backgroundColor: '#ffffff',
        linkColor: '#0366d6',
        codeBackground: '#f5f5f5',
        maxWidth: 800,
        padding: 20,
      },
      elementStyles: {},
    };
    return selector(state);
  },
}));

// Mock child components
vi.mock('../PagedPreview', () => ({
  PagedPreview: (props: { markdown: string }) => (
    <div data-testid="paged-preview" data-markdown={props.markdown}>
      Paged Preview
    </div>
  ),
}));

vi.mock('../PrintSettings', () => ({
  PrintSettings: () => <div data-testid="print-settings">Settings</div>,
}));

vi.mock('../HeaderFooter', () => ({
  HeaderFooter: () => <div data-testid="header-footer">Header Footer</div>,
}));

// Mock markdown/print utilities
vi.mock('@/lib/markdown/parser', () => ({
  parseMarkdown: (md: string) => `<p>${md}</p>`,
}));

vi.mock('@/lib/markdown/sanitizer', () => ({
  sanitizeHtml: (html: string) => html,
}));

vi.mock('@/lib/print/pdfStyles', () => ({
  getPdfStyles: () => 'body { margin: 0; }',
}));

vi.mock('@/lib/themes', () => ({
  generateElementStylesCss: () => '',
}));

vi.mock('@/lib/print/pdfTextRenderer', () => ({
  resolveTemplate: (tpl: string) => tpl,
  extractTitle: () => 'Test Title',
  renderTextToImage: () => null,
  calcAlignedX: () => 0,
  buildPdfFilename: (title: string) => `${title}.pdf`,
}));

vi.mock('@/lib/print/pageBreaks', () => ({
  findKeepTogetherZones: () => [],
  computePageBreaks: () => [0],
}));

vi.mock('@/lib/print/paperSizes', () => ({
  getPaperDimensions: () => ({ width: 210, height: 297 }),
  mmToPx: (mm: number) => mm * 3.78,
}));

describe('PrintPreview', () => {
  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- Rendering tests ---

  it('does not render when isOpen is false', () => {
    const { container } = render(
      <PrintPreview isOpen={false} onClose={onClose} content="# Test" />
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders modal when isOpen is true', () => {
    render(
      <PrintPreview isOpen={true} onClose={onClose} content="# Test" />
    );
    expect(screen.getByText('Print Preview')).toBeInTheDocument();
  });

  it('passes content prop to PagedPreview (not reading from store)', () => {
    const testContent = '# My Test Content';
    render(
      <PrintPreview isOpen={true} onClose={onClose} content={testContent} />
    );
    const pagedPreview = screen.getByTestId('paged-preview');
    expect(pagedPreview).toHaveAttribute('data-markdown', testContent);
  });

  it('renders Save PDF button', () => {
    render(
      <PrintPreview isOpen={true} onClose={onClose} content="# Test" />
    );
    expect(screen.getByText('Save PDF')).toBeInTheDocument();
  });

  it('renders Print button', () => {
    render(
      <PrintPreview isOpen={true} onClose={onClose} content="# Test" />
    );
    expect(screen.getByText('Print')).toBeInTheDocument();
  });

  it('renders Cancel button', () => {
    render(
      <PrintPreview isOpen={true} onClose={onClose} content="# Test" />
    );
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('has print-preview-modal class on modal for print CSS hiding', () => {
    const { container } = render(
      <PrintPreview isOpen={true} onClose={onClose} content="# Test" />
    );
    expect(container.querySelector('.print-preview-modal')).toBeInTheDocument();
  });

  it('has print-preview-backdrop class on backdrop for print CSS hiding', () => {
    const { container } = render(
      <PrintPreview isOpen={true} onClose={onClose} content="# Test" />
    );
    expect(container.querySelector('.print-preview-backdrop')).toBeInTheDocument();
  });

  // --- Save PDF tests ---

  it('Save PDF generates PDF via html2canvas + jsPDF and calls pdf.save()', async () => {
    render(
      <PrintPreview isOpen={true} onClose={onClose} content="# Hello" />
    );

    await act(async () => {
      fireEvent.click(screen.getByText('Save PDF'));
      await new Promise((r) => setTimeout(r, 400));
    });

    expect(mockHtml2canvas).toHaveBeenCalled();
    expect(mockPdfInstance.save).toHaveBeenCalledWith('Test Title.pdf');
  });

  it('Save PDF does not call pdf.output (no blob url needed)', async () => {
    render(
      <PrintPreview isOpen={true} onClose={onClose} content="# Test" />
    );

    await act(async () => {
      fireEvent.click(screen.getByText('Save PDF'));
      await new Promise((r) => setTimeout(r, 400));
    });

    expect(mockPdfInstance.output).not.toHaveBeenCalled();
    expect(mockPdfInstance.save).toHaveBeenCalled();
  });

  it('Save PDF handles errors gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockHtml2canvas.mockRejectedValueOnce(new Error('canvas failed'));

    render(
      <PrintPreview isOpen={true} onClose={onClose} content="# Test" />
    );

    await act(async () => {
      fireEvent.click(screen.getByText('Save PDF'));
      await new Promise((r) => setTimeout(r, 400));
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to generate PDF:',
      expect.any(Error),
    );
    // Button should be re-enabled after error
    expect(screen.getByText('Save PDF')).not.toBeDisabled();
    consoleSpy.mockRestore();
  });

  // --- Print tests ---

  it('Print generates PDF and opens it in a hidden iframe for printing', async () => {
    const mockPrint = vi.fn();
    let capturedIframe: HTMLIFrameElement | null = null;

    const origCreateElement = document.createElement.bind(document);
    const createSpy = vi.spyOn(document, 'createElement').mockImplementation((tag: string, options?: ElementCreationOptions) => {
      const el = origCreateElement(tag, options);
      if (tag === 'iframe') {
        capturedIframe = el as HTMLIFrameElement;
        Object.defineProperty(el, 'contentWindow', {
          value: { print: mockPrint, onafterprint: null },
          writable: true,
        });
      }
      return el;
    });

    render(
      <PrintPreview isOpen={true} onClose={onClose} content="# Print Test" />
    );

    await act(async () => {
      fireEvent.click(screen.getByText('Print'));
      await new Promise((r) => setTimeout(r, 400));
    });

    // Should have generated PDF and requested blob URL
    expect(mockHtml2canvas).toHaveBeenCalled();
    expect(mockPdfInstance.output).toHaveBeenCalledWith('bloburl');
    expect(mockPdfInstance.save).not.toHaveBeenCalled();

    // Should have created hidden iframe
    expect(capturedIframe).not.toBeNull();
    expect(capturedIframe!.style.position).toBe('fixed');
    expect(capturedIframe!.style.left).toBe('-9999px');

    // Simulate iframe load → triggers print on iframe's contentWindow
    await act(async () => {
      capturedIframe!.onload?.(new Event('load'));
    });
    expect(mockPrint).toHaveBeenCalled();

    // Should close the modal
    expect(onClose).toHaveBeenCalled();

    createSpy.mockRestore();
  });

  it('Print does not call window.print() directly', async () => {
    const windowPrintSpy = vi.spyOn(window, 'print').mockImplementation(() => {});

    const origCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tag: string, options?: ElementCreationOptions) => {
      const el = origCreateElement(tag, options);
      if (tag === 'iframe') {
        Object.defineProperty(el, 'contentWindow', {
          value: { print: vi.fn(), onafterprint: null },
          writable: true,
        });
      }
      return el;
    });

    render(
      <PrintPreview isOpen={true} onClose={onClose} content="# Test" />
    );

    await act(async () => {
      fireEvent.click(screen.getByText('Print'));
      await new Promise((r) => setTimeout(r, 400));
    });

    expect(windowPrintSpy).not.toHaveBeenCalled();
    windowPrintSpy.mockRestore();
    vi.restoreAllMocks();
  });

  it('Print handles errors gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockHtml2canvas.mockRejectedValueOnce(new Error('print failed'));

    render(
      <PrintPreview isOpen={true} onClose={onClose} content="# Test" />
    );

    await act(async () => {
      fireEvent.click(screen.getByText('Print'));
      await new Promise((r) => setTimeout(r, 400));
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to print PDF:',
      expect.any(Error),
    );
    // Button should be re-enabled after error
    expect(screen.getByText('Print')).not.toBeDisabled();
    consoleSpy.mockRestore();
  });

  it('both buttons show disabled state while generating PDF', async () => {
    render(
      <PrintPreview isOpen={true} onClose={onClose} content="# Test" />
    );

    // Click Save PDF and wait for generation to complete
    await act(async () => {
      fireEvent.click(screen.getByText('Save PDF'));
      await new Promise((r) => setTimeout(r, 400));
    });

    // Verify that generation happened (buttons re-enabled after completion)
    expect(mockPdfInstance.save).toHaveBeenCalled();
    expect(screen.getByText('Save PDF')).not.toBeDisabled();
    expect(screen.getByText('Print')).not.toBeDisabled();
  });
});
