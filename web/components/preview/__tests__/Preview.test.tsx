import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Preview } from '../Preview';

// Mock stores
const mockUpdateTabContent = vi.fn();
const mockActiveTab = { id: 'tab-1', content: '# Hello\n\nParagraph text', documentId: null, title: 'Test', lastSavedContent: '', isDirty: false };

vi.mock('@/stores', () => ({
  useStyleStore: (selector: (s: Record<string, unknown>) => unknown) => {
    const state = { elementStyles: {} };
    return selector(state);
  },
  useUIStore: (selector: (s: Record<string, unknown>) => unknown) => {
    const state = { spacingHighlight: null };
    return selector(state);
  },
  useTabsStore: (selector: (s: Record<string, unknown>) => unknown) => {
    const state = {
      updateTabContent: mockUpdateTabContent,
      getActiveTab: () => mockActiveTab,
    };
    return selector(state);
  },
}));

vi.mock('@/lib/themes', () => ({
  generateElementStylesCss: () => '',
  ELEMENT_SELECTORS: {},
}));

const defaultStyles = {
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

describe('Preview - inline editing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockActiveTab.content = '# Hello\n\nParagraph text';
  });

  it('renders markdown as HTML', () => {
    render(<Preview markdown="# Hello" styles={defaultStyles} />);
    const article = document.querySelector('.preview-content');
    expect(article).not.toBeNull();
    expect(article!.innerHTML).toContain('<h1');
    expect(article!.innerHTML).toContain('Hello');
  });

  it('adds data-line and data-line-end attributes to rendered blocks', () => {
    render(<Preview markdown="# Hello" styles={defaultStyles} />);
    const article = document.querySelector('.preview-content');
    const h1 = article!.querySelector('h1');
    expect(h1).not.toBeNull();
    expect(h1!.getAttribute('data-line')).toBe('0');
    expect(h1!.getAttribute('data-line-end')).toBe('1');
  });

  it('opens textarea on double-click of a block element', () => {
    render(<Preview markdown="# Hello" styles={defaultStyles} />);
    const article = document.querySelector('.preview-content')!;
    const h1 = article.querySelector('h1')!;

    act(() => {
      fireEvent.dblClick(h1);
    });

    const textarea = document.querySelector('textarea');
    expect(textarea).not.toBeNull();
    expect(textarea!.value).toBe('# Hello');
  });

  it('does not open textarea when double-clicking a checkbox input', () => {
    const md = '- [ ] task item';
    mockActiveTab.content = md;
    render(<Preview markdown={md} styles={defaultStyles} />);
    const article = document.querySelector('.preview-content')!;
    const input = article.querySelector('input[type="checkbox"]');
    expect(input).not.toBeNull();

    act(() => {
      fireEvent.dblClick(input!);
    });

    const textarea = document.querySelector('textarea');
    expect(textarea).toBeNull();
  });

  it('cancels editing on Escape key', () => {
    render(<Preview markdown="# Hello" styles={defaultStyles} />);
    const article = document.querySelector('.preview-content')!;
    const h1 = article.querySelector('h1')!;

    act(() => {
      fireEvent.dblClick(h1);
    });

    const textarea = document.querySelector('textarea')!;
    expect(textarea).not.toBeNull();

    act(() => {
      fireEvent.keyDown(textarea, { key: 'Escape' });
    });

    expect(document.querySelector('textarea')).toBeNull();
    expect(mockUpdateTabContent).not.toHaveBeenCalled();
  });

  it('confirms editing on blur with changed text', () => {
    const md = '# Hello';
    mockActiveTab.content = md;
    render(<Preview markdown={md} styles={defaultStyles} />);
    const article = document.querySelector('.preview-content')!;
    const h1 = article.querySelector('h1')!;

    act(() => {
      fireEvent.dblClick(h1);
    });

    const textarea = document.querySelector('textarea')!;

    act(() => {
      fireEvent.change(textarea, { target: { value: '# Updated' } });
      Object.defineProperty(textarea, 'value', { value: '# Updated', writable: true });
      fireEvent.blur(textarea);
    });

    expect(mockUpdateTabContent).toHaveBeenCalledWith('tab-1', '# Updated');
  });

  it('confirms editing on Meta+Enter for multi-line blocks', () => {
    const md = 'Paragraph text';
    mockActiveTab.content = md;
    render(<Preview markdown={md} styles={defaultStyles} />);
    const article = document.querySelector('.preview-content')!;
    const p = article.querySelector('p')!;

    act(() => {
      fireEvent.dblClick(p);
    });

    const textarea = document.querySelector('textarea')!;

    act(() => {
      Object.defineProperty(textarea, 'value', { value: 'Updated paragraph', writable: true });
      fireEvent.keyDown(textarea, { key: 'Enter', metaKey: true });
    });

    expect(mockUpdateTabContent).toHaveBeenCalledWith('tab-1', 'Updated paragraph');
  });

  it('confirms editing on plain Enter for single-line heading', () => {
    const md = '# Hello';
    mockActiveTab.content = md;
    render(<Preview markdown={md} styles={defaultStyles} />);
    const article = document.querySelector('.preview-content')!;
    const h1 = article.querySelector('h1')!;

    act(() => {
      fireEvent.dblClick(h1);
    });

    const textarea = document.querySelector('textarea')!;

    act(() => {
      Object.defineProperty(textarea, 'value', { value: '# Changed', writable: true });
      fireEvent.keyDown(textarea, { key: 'Enter' });
    });

    expect(mockUpdateTabContent).toHaveBeenCalledWith('tab-1', '# Changed');
  });

  it('does NOT confirm on plain Enter for paragraph (allows newline)', () => {
    const md = 'Paragraph text';
    mockActiveTab.content = md;
    render(<Preview markdown={md} styles={defaultStyles} />);
    const article = document.querySelector('.preview-content')!;
    const p = article.querySelector('p')!;

    act(() => {
      fireEvent.dblClick(p);
    });

    const textarea = document.querySelector('textarea')!;

    act(() => {
      fireEvent.keyDown(textarea, { key: 'Enter' });
    });

    expect(document.querySelector('textarea')).not.toBeNull();
    expect(mockUpdateTabContent).not.toHaveBeenCalled();
  });

  it('does not call updateTabContent if text is unchanged on blur', () => {
    const md = '# Hello';
    mockActiveTab.content = md;
    render(<Preview markdown={md} styles={defaultStyles} />);
    const article = document.querySelector('.preview-content')!;
    const h1 = article.querySelector('h1')!;

    act(() => {
      fireEvent.dblClick(h1);
    });

    const textarea = document.querySelector('textarea')!;

    act(() => {
      fireEvent.blur(textarea);
    });

    expect(mockUpdateTabContent).not.toHaveBeenCalled();
  });

  it('checkbox click still toggles correctly', () => {
    const md = '- [ ] task item';
    mockActiveTab.content = md;
    render(<Preview markdown={md} styles={defaultStyles} />);
    const article = document.querySelector('.preview-content')!;
    const checkbox = article.querySelector('input[type="checkbox"]')!;

    act(() => {
      fireEvent.click(checkbox);
    });

    expect(mockUpdateTabContent).toHaveBeenCalledWith('tab-1', '- [x] task item');
  });

  it('preview-container has position relative for textarea overlay', () => {
    render(<Preview markdown="# Hello" styles={defaultStyles} />);
    const container = document.querySelector('.preview-container') as HTMLElement;
    expect(container).not.toBeNull();
    expect(container.style.position).toBe('relative');
  });
});
