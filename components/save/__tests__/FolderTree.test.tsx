import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, createEvent } from '@testing-library/react';
import { FolderTree } from '../FolderTree';
import type { Folder, Document } from '@/stores/documentsStore';

const mockFolders: Folder[] = [
  { id: 'f1', name: 'Folder 1', parentId: null },
  { id: 'f2', name: 'Folder 2', parentId: null },
  { id: 'f1-1', name: 'Subfolder', parentId: 'f1' },
];

const mockDocuments: Document[] = [
  { id: 'd1', name: 'Doc 1', content: '# Doc 1', folderId: 'f1', createdAt: 1000, updatedAt: 1000 },
  { id: 'd2', name: 'Doc 2', content: '# Doc 2', folderId: 'root', createdAt: 2000, updatedAt: 2000 },
];

const defaultProps = {
  folders: mockFolders,
  documents: mockDocuments,
  selectedFolderId: 'root',
  onFolderSelect: vi.fn(),
  onDocumentSelect: vi.fn(),
  onDeleteDocument: vi.fn(),
  onDeleteFolder: vi.fn(),
  onRenameDocument: vi.fn(),
  onRenameFolder: vi.fn(),
  onMoveDocument: vi.fn(),
  onMoveFolder: vi.fn(),
  onCreateFolder: vi.fn(),
  showDocuments: true,
  currentDocumentId: null,
};

describe('FolderTree', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders folders', () => {
      render(<FolderTree {...defaultProps} />);
      expect(screen.getByText('Folder 1')).toBeInTheDocument();
      expect(screen.getByText('Folder 2')).toBeInTheDocument();
    });

    it('renders root-level documents', () => {
      render(<FolderTree {...defaultProps} />);
      expect(screen.getByText('Doc 2')).toBeInTheDocument();
    });

    it('renders documents inside expanded folders', () => {
      render(<FolderTree {...defaultProps} />);
      // Click folder to expand
      fireEvent.click(screen.getByText('Folder 1'));
      expect(screen.getByText('Doc 1')).toBeInTheDocument();
    });

    it('renders subfolders inside expanded parent', () => {
      render(<FolderTree {...defaultProps} />);
      fireEvent.click(screen.getByText('Folder 1'));
      expect(screen.getByText('Subfolder')).toBeInTheDocument();
    });
  });

  describe('inline rename - documents', () => {
    it('enters rename mode on double-click', () => {
      render(<FolderTree {...defaultProps} />);
      const docName = screen.getByText('Doc 2');
      fireEvent.doubleClick(docName);

      const input = screen.getByDisplayValue('Doc 2');
      expect(input).toBeInTheDocument();
    });

    it('confirms rename on Enter', () => {
      render(<FolderTree {...defaultProps} />);
      fireEvent.doubleClick(screen.getByText('Doc 2'));

      const input = screen.getByDisplayValue('Doc 2');
      fireEvent.change(input, { target: { value: 'Renamed Doc' } });
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(defaultProps.onRenameDocument).toHaveBeenCalledWith('d2', 'Renamed Doc');
    });

    it('cancels rename on Escape', () => {
      render(<FolderTree {...defaultProps} />);
      fireEvent.doubleClick(screen.getByText('Doc 2'));

      const input = screen.getByDisplayValue('Doc 2');
      fireEvent.change(input, { target: { value: 'Changed' } });
      fireEvent.keyDown(input, { key: 'Escape' });

      expect(defaultProps.onRenameDocument).not.toHaveBeenCalled();
      expect(screen.getByText('Doc 2')).toBeInTheDocument();
    });

    it('cancels rename on blur without changes', () => {
      render(<FolderTree {...defaultProps} />);
      fireEvent.doubleClick(screen.getByText('Doc 2'));

      const input = screen.getByDisplayValue('Doc 2');
      fireEvent.blur(input);

      expect(defaultProps.onRenameDocument).not.toHaveBeenCalled();
    });
  });

  describe('inline rename - folders', () => {
    it('enters rename mode on double-click', () => {
      render(<FolderTree {...defaultProps} />);
      fireEvent.doubleClick(screen.getByText('Folder 1'));

      const input = screen.getByDisplayValue('Folder 1');
      expect(input).toBeInTheDocument();
    });

    it('confirms folder rename on Enter', () => {
      render(<FolderTree {...defaultProps} />);
      fireEvent.doubleClick(screen.getByText('Folder 1'));

      const input = screen.getByDisplayValue('Folder 1');
      fireEvent.change(input, { target: { value: 'New Folder Name' } });
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(defaultProps.onRenameFolder).toHaveBeenCalledWith('f1', 'New Folder Name');
    });

    it('cancels folder rename on Escape', () => {
      render(<FolderTree {...defaultProps} />);
      fireEvent.doubleClick(screen.getByText('Folder 2'));

      const input = screen.getByDisplayValue('Folder 2');
      fireEvent.keyDown(input, { key: 'Escape' });

      expect(defaultProps.onRenameFolder).not.toHaveBeenCalled();
      expect(screen.getByText('Folder 2')).toBeInTheDocument();
    });
  });

  describe('drag and drop', () => {
    it('sets draggable on documents when onMoveDocument is provided', () => {
      render(<FolderTree {...defaultProps} />);
      const doc = screen.getByText('Doc 2').closest('[draggable]');
      expect(doc).toHaveAttribute('draggable', 'true');
    });

    it('sets draggable on non-root folders when onMoveFolder is provided', () => {
      render(<FolderTree {...defaultProps} />);
      const folder = screen.getByText('Folder 1').closest('[draggable]');
      expect(folder).toHaveAttribute('draggable', 'true');
    });

    it('does not make documents draggable without onMoveDocument', () => {
      render(<FolderTree {...defaultProps} onMoveDocument={undefined} />);
      const docRow = screen.getByText('Doc 2').closest('div[class*="group"]');
      expect(docRow).not.toHaveAttribute('draggable', 'true');
    });

    it('calls onMoveDocument when dropping document on folder', () => {
      render(<FolderTree {...defaultProps} />);
      const folderRow = screen.getByText('Folder 2').closest('[role="button"]')!;

      // Simulate drag over
      fireEvent.dragOver(folderRow, {
        preventDefault: vi.fn(),
        dataTransfer: { dropEffect: '', getData: vi.fn() },
      });

      // Simulate drop
      const mockGetData = vi.fn((type: string) => {
        if (type === 'application/x-doc-id') return 'd2';
        return '';
      });
      fireEvent.drop(folderRow, {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: { getData: mockGetData },
      });

      expect(defaultProps.onMoveDocument).toHaveBeenCalledWith('d2', 'f2');
    });

    it('calls onMoveFolder when dropping folder on another folder', () => {
      render(<FolderTree {...defaultProps} />);
      const targetRow = screen.getByText('Folder 2').closest('[role="button"]')!;

      const mockGetData = vi.fn((type: string) => {
        if (type === 'application/x-folder-id') return 'f1';
        if (type === 'application/x-doc-id') return '';
        return '';
      });
      fireEvent.drop(targetRow, {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        dataTransfer: { getData: mockGetData },
      });

      expect(defaultProps.onMoveFolder).toHaveBeenCalledWith('f1', 'f2');
    });

    it('applies drag-over highlight class on folder', () => {
      render(<FolderTree {...defaultProps} />);
      const folderRow = screen.getByText('Folder 2').closest('[role="button"]')!;

      fireEvent.dragOver(folderRow, {
        preventDefault: vi.fn(),
        dataTransfer: { dropEffect: '' },
      });

      expect(folderRow.className).toContain('ring-2');
    });
  });

  describe('reordering', () => {
    const rowRect = { top: 0, height: 40, bottom: 40, left: 0, right: 200, width: 200, x: 0, y: 0, toJSON: () => ({}) };

    function dragTo(source: Element, target: Element, clientY: number, kind: 'doc' | 'folder', id: string) {
      target.getBoundingClientRect = () => rowRect as DOMRect;
      const type = kind === 'doc' ? 'application/x-doc-id' : 'application/x-folder-id';
      const dataTransfer = { setData: vi.fn(), getData: (t: string) => (t === type ? id : ''), dropEffect: '', effectAllowed: '' };
      fireEvent.dragStart(source, { dataTransfer });
      // jsdom's drag events don't take clientY from the init dict.
      for (const create of [createEvent.dragOver, createEvent.drop]) {
        const event = create(target, { dataTransfer });
        Object.defineProperty(event, 'clientY', { value: clientY });
        fireEvent(target, event);
      }
    }

    const docs: Document[] = [
      { id: 'a', name: 'Doc A', content: '', folderId: 'root', createdAt: 1, updatedAt: 1 },
      { id: 'b', name: 'Doc B', content: '', folderId: 'root', createdAt: 2, updatedAt: 2 },
    ];

    it('drops a document above another document', () => {
      const onReorderDocument = vi.fn();
      render(<FolderTree {...defaultProps} documents={docs} onReorderDocument={onReorderDocument} />);
      const a = screen.getByText('Doc A').closest('[draggable]')!;
      const b = screen.getByText('Doc B').closest('[draggable]')!;
      dragTo(b, a, 5, 'doc', 'b');
      expect(onReorderDocument).toHaveBeenCalledWith('b', 'a', 'before');
      expect(defaultProps.onMoveDocument).not.toHaveBeenCalled();
    });

    it('drops a document below another document', () => {
      const onReorderDocument = vi.fn();
      render(<FolderTree {...defaultProps} documents={docs} onReorderDocument={onReorderDocument} />);
      const a = screen.getByText('Doc A').closest('[draggable]')!;
      const b = screen.getByText('Doc B').closest('[draggable]')!;
      dragTo(a, b, 35, 'doc', 'a');
      expect(onReorderDocument).toHaveBeenCalledWith('a', 'b', 'after');
    });

    it('drops a folder next to another folder near its edge', () => {
      const onReorderFolder = vi.fn();
      render(<FolderTree {...defaultProps} onReorderFolder={onReorderFolder} />);
      const f1 = screen.getByText('Folder 1').closest('[role="button"]')!;
      const f2 = screen.getByText('Folder 2').closest('[role="button"]')!;
      dragTo(f2, f1, 2, 'folder', 'f2');
      expect(onReorderFolder).toHaveBeenCalledWith('f2', 'f1', 'before');
      expect(defaultProps.onMoveFolder).not.toHaveBeenCalled();
    });

    it('drops a folder into another folder over its middle', () => {
      const onReorderFolder = vi.fn();
      render(<FolderTree {...defaultProps} onReorderFolder={onReorderFolder} />);
      const f1 = screen.getByText('Folder 1').closest('[role="button"]')!;
      const f2 = screen.getByText('Folder 2').closest('[role="button"]')!;
      dragTo(f2, f1, 20, 'folder', 'f2');
      expect(onReorderFolder).not.toHaveBeenCalled();
      expect(defaultProps.onMoveFolder).toHaveBeenCalledWith('f2', 'f1');
    });
  });

  describe('unsaved dot', () => {
    it('marks documents with unsaved edits', () => {
      render(<FolderTree {...defaultProps} dirtyDocumentIds={new Set(['d2'])} />);
      expect(screen.getByLabelText('Unsaved changes')).toBeInTheDocument();
    });

    it('shows no dot when nothing is dirty', () => {
      render(<FolderTree {...defaultProps} />);
      expect(screen.queryByLabelText('Unsaved changes')).not.toBeInTheDocument();
    });
  });

  describe('folder creation UX', () => {
    it('shows add subfolder button on folder hover', () => {
      render(<FolderTree {...defaultProps} />);
      const addBtn = screen.getByLabelText('Add subfolder in Folder 1');
      expect(addBtn).toBeInTheDocument();
    });

    it('shows inline input when add subfolder button is clicked', () => {
      render(<FolderTree {...defaultProps} />);
      const addBtn = screen.getByLabelText('Add subfolder in Folder 1');
      fireEvent.click(addBtn);

      const input = screen.getByDisplayValue('');
      expect(input).toBeInTheDocument();
    });

    it('calls onCreateFolder on Enter with folder name', () => {
      render(<FolderTree {...defaultProps} />);
      const addBtn = screen.getByLabelText('Add subfolder in Folder 1');
      fireEvent.click(addBtn);

      const input = screen.getByDisplayValue('');
      fireEvent.change(input, { target: { value: 'New Subfolder' } });
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(defaultProps.onCreateFolder).toHaveBeenCalledWith('New Subfolder', 'f1');
    });

    it('cancels folder creation on Escape', () => {
      render(<FolderTree {...defaultProps} />);
      const addBtn = screen.getByLabelText('Add subfolder in Folder 1');
      fireEvent.click(addBtn);

      const input = screen.getByDisplayValue('');
      fireEvent.keyDown(input, { key: 'Escape' });

      expect(defaultProps.onCreateFolder).not.toHaveBeenCalled();
      // Input should be gone
      expect(screen.queryByDisplayValue('')).toBeNull();
    });

    it('expands folder when add subfolder is clicked', () => {
      render(<FolderTree {...defaultProps} />);
      // Folder 2 has no children, should not show subfolder initially
      expect(screen.queryByText('Subfolder')).toBeNull();

      // Click Folder 1's add button — it should expand to show children
      const addBtn = screen.getByLabelText('Add subfolder in Folder 1');
      fireEvent.click(addBtn);

      // Folder 1 should now be expanded showing its subfolder
      expect(screen.getByText('Subfolder')).toBeInTheDocument();
    });
  });

  describe('delete buttons', () => {
    it('shows delete button for non-root folders', () => {
      render(<FolderTree {...defaultProps} />);
      expect(screen.getByLabelText('Delete Folder 1')).toBeInTheDocument();
    });

    it('calls onDeleteFolder when delete button is clicked', () => {
      render(<FolderTree {...defaultProps} />);
      fireEvent.click(screen.getByLabelText('Delete Folder 1'));
      expect(defaultProps.onDeleteFolder).toHaveBeenCalledWith('f1');
    });

    it('shows delete button for documents', () => {
      render(<FolderTree {...defaultProps} />);
      expect(screen.getByLabelText('Delete Doc 2')).toBeInTheDocument();
    });

    it('calls onDeleteDocument when delete button is clicked', () => {
      render(<FolderTree {...defaultProps} />);
      fireEvent.click(screen.getByLabelText('Delete Doc 2'));
      expect(defaultProps.onDeleteDocument).toHaveBeenCalledWith('d2');
    });
  });
});
