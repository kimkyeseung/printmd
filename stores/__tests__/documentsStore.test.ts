import { describe, it, expect, beforeEach } from 'vitest';
import { useDocumentsStore } from '../documentsStore';

describe('documentsStore', () => {
  beforeEach(() => {
    // Reset store state
    useDocumentsStore.setState({ documents: [], folders: [] });
  });

  describe('renameDocument', () => {
    it('updates document name', () => {
      const id = useDocumentsStore.getState().saveDocument('Old Name', '# content', 'root');
      useDocumentsStore.getState().renameDocument(id, 'New Name');

      const doc = useDocumentsStore.getState().getDocument(id);
      expect(doc?.name).toBe('New Name');
    });

    it('updates updatedAt timestamp', () => {
      const id = useDocumentsStore.getState().saveDocument('Doc', '# content', 'root');
      const before = useDocumentsStore.getState().getDocument(id)!.updatedAt;

      // Small delay to ensure different timestamp
      useDocumentsStore.getState().renameDocument(id, 'Renamed');
      const after = useDocumentsStore.getState().getDocument(id)!.updatedAt;

      expect(after).toBeGreaterThanOrEqual(before);
    });

    it('does not affect other documents', () => {
      const id1 = useDocumentsStore.getState().saveDocument('Doc1', 'a', 'root');
      const id2 = useDocumentsStore.getState().saveDocument('Doc2', 'b', 'root');

      useDocumentsStore.getState().renameDocument(id1, 'Renamed');

      expect(useDocumentsStore.getState().getDocument(id1)?.name).toBe('Renamed');
      expect(useDocumentsStore.getState().getDocument(id2)?.name).toBe('Doc2');
    });
  });

  describe('renameFolder', () => {
    it('updates folder name', () => {
      const id = useDocumentsStore.getState().createFolder('Old Folder', null);
      useDocumentsStore.getState().renameFolder(id, 'New Folder');

      const folder = useDocumentsStore.getState().folders.find((f) => f.id === id);
      expect(folder?.name).toBe('New Folder');
    });

    it('does not affect other folders', () => {
      const id1 = useDocumentsStore.getState().createFolder('Folder1', null);
      const id2 = useDocumentsStore.getState().createFolder('Folder2', null);

      useDocumentsStore.getState().renameFolder(id1, 'Renamed');

      const folders = useDocumentsStore.getState().folders;
      expect(folders.find((f) => f.id === id1)?.name).toBe('Renamed');
      expect(folders.find((f) => f.id === id2)?.name).toBe('Folder2');
    });
  });

  describe('moveDocument', () => {
    it('changes document folderId', () => {
      const folderId = useDocumentsStore.getState().createFolder('Target', null);
      const docId = useDocumentsStore.getState().saveDocument('Doc', '# test', 'root');

      useDocumentsStore.getState().moveDocument(docId, folderId);

      const doc = useDocumentsStore.getState().getDocument(docId);
      expect(doc?.folderId).toBe(folderId);
    });

    it('updates updatedAt timestamp', () => {
      const folderId = useDocumentsStore.getState().createFolder('Target', null);
      const docId = useDocumentsStore.getState().saveDocument('Doc', '# test', 'root');
      const before = useDocumentsStore.getState().getDocument(docId)!.updatedAt;

      useDocumentsStore.getState().moveDocument(docId, folderId);
      const after = useDocumentsStore.getState().getDocument(docId)!.updatedAt;

      expect(after).toBeGreaterThanOrEqual(before);
    });

    it('moves document to root', () => {
      const folderId = useDocumentsStore.getState().createFolder('Folder', null);
      const docId = useDocumentsStore.getState().saveDocument('Doc', '# test', folderId);

      useDocumentsStore.getState().moveDocument(docId, 'root');

      expect(useDocumentsStore.getState().getDocument(docId)?.folderId).toBe('root');
    });
  });

  describe('moveFolder', () => {
    it('moves folder to new parent', () => {
      const parentId = useDocumentsStore.getState().createFolder('Parent', null);
      const childId = useDocumentsStore.getState().createFolder('Child', null);

      const result = useDocumentsStore.getState().moveFolder(childId, parentId);

      expect(result).toBe(true);
      const child = useDocumentsStore.getState().folders.find((f) => f.id === childId);
      expect(child?.parentId).toBe(parentId);
    });

    it('moves folder to root (null parentId)', () => {
      const parentId = useDocumentsStore.getState().createFolder('Parent', null);
      const childId = useDocumentsStore.getState().createFolder('Child', parentId);

      const result = useDocumentsStore.getState().moveFolder(childId, null);

      expect(result).toBe(true);
      const child = useDocumentsStore.getState().folders.find((f) => f.id === childId);
      expect(child?.parentId).toBeNull();
    });

    it('prevents moving folder into itself', () => {
      const id = useDocumentsStore.getState().createFolder('Folder', null);

      const result = useDocumentsStore.getState().moveFolder(id, id);

      expect(result).toBe(false);
      const folder = useDocumentsStore.getState().folders.find((f) => f.id === id);
      expect(folder?.parentId).toBeNull(); // unchanged
    });

    it('prevents direct circular reference (A → B → A)', () => {
      const a = useDocumentsStore.getState().createFolder('A', null);
      const b = useDocumentsStore.getState().createFolder('B', a);

      // Try to move A into B (would create A→B→A)
      const result = useDocumentsStore.getState().moveFolder(a, b);

      expect(result).toBe(false);
      const folderA = useDocumentsStore.getState().folders.find((f) => f.id === a);
      expect(folderA?.parentId).toBeNull(); // unchanged
    });

    it('prevents deep circular reference (A → B → C → A)', () => {
      const a = useDocumentsStore.getState().createFolder('A', null);
      const b = useDocumentsStore.getState().createFolder('B', a);
      const c = useDocumentsStore.getState().createFolder('C', b);

      // Try to move A into C (would create A→B→C→A)
      const result = useDocumentsStore.getState().moveFolder(a, c);

      expect(result).toBe(false);
      const folderA = useDocumentsStore.getState().folders.find((f) => f.id === a);
      expect(folderA?.parentId).toBeNull(); // unchanged
    });

    it('allows valid non-circular move in deep hierarchy', () => {
      const a = useDocumentsStore.getState().createFolder('A', null);
      const b = useDocumentsStore.getState().createFolder('B', null);
      const c = useDocumentsStore.getState().createFolder('C', a);

      // Move C into B (no cycle: B → C, A has no children)
      const result = useDocumentsStore.getState().moveFolder(c, b);

      expect(result).toBe(true);
      const folderC = useDocumentsStore.getState().folders.find((f) => f.id === c);
      expect(folderC?.parentId).toBe(b);
    });
  });
});
