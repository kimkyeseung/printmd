import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PrintPreview } from '../PrintPreview';

// Mock stores
vi.mock('@/stores', () => ({
  usePrintStore: (selector: (s: Record<string, unknown>) => unknown) => {
    const state = {
      settings: {
        paperSize: 'A4',
        orientation: 'portrait',
        margins: { top: 20, right: 20, bottom: 20, left: 20 },
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
    };
    return selector(state);
  },
}));

// Mock child components (paths relative to the test file)
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

describe('PrintPreview', () => {
  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

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
});
