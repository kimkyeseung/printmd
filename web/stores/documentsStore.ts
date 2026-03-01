import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Document {
  id: string;
  name: string;
  content: string;
  folderId: string; // 'root' for root folder
  createdAt: number;
  updatedAt: number;
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null; // null for root level
}

interface DocumentsState {
  documents: Document[];
  folders: Folder[];
}

interface DocumentsActions {
  saveDocument: (name: string, content: string, folderId: string) => string;
  updateDocument: (id: string, content: string) => void;
  deleteDocument: (id: string) => void;
  createFolder: (name: string, parentId: string | null) => string;
  deleteFolder: (id: string) => boolean; // returns false if has documents
  getDocumentsInFolder: (folderId: string) => Document[];
  getFoldersInFolder: (parentId: string | null) => Folder[];
  getDocument: (id: string) => Document | undefined;
  renameDocument: (id: string, name: string) => void;
  renameFolder: (id: string, name: string) => void;
}

type DocumentsStore = DocumentsState & DocumentsActions;

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useDocumentsStore = create<DocumentsStore>()(
  persist(
    (set, get) => ({
      documents: [],
      folders: [],

      saveDocument: (name: string, content: string, folderId: string) => {
        const id = generateId();
        const now = Date.now();
        const newDocument: Document = {
          id,
          name,
          content,
          folderId,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          documents: [...state.documents, newDocument],
        }));
        return id;
      },

      updateDocument: (id: string, content: string) => {
        set((state) => ({
          documents: state.documents.map((doc) =>
            doc.id === id
              ? { ...doc, content, updatedAt: Date.now() }
              : doc
          ),
        }));
      },

      deleteDocument: (id: string) => {
        set((state) => ({
          documents: state.documents.filter((doc) => doc.id !== id),
        }));
      },

      createFolder: (name: string, parentId: string | null) => {
        const id = generateId();
        const newFolder: Folder = { id, name, parentId };
        set((state) => ({
          folders: [...state.folders, newFolder],
        }));
        return id;
      },

      deleteFolder: (id: string) => {
        const state = get();
        // Check if folder has documents
        const hasDocuments = state.documents.some((doc) => doc.folderId === id);
        // Check if folder has subfolders
        const hasSubfolders = state.folders.some((f) => f.parentId === id);

        if (hasDocuments || hasSubfolders) {
          return false;
        }

        set((state) => ({
          folders: state.folders.filter((folder) => folder.id !== id),
        }));
        return true;
      },

      getDocumentsInFolder: (folderId: string) => {
        return get().documents.filter((doc) => doc.folderId === folderId);
      },

      getFoldersInFolder: (parentId: string | null) => {
        return get().folders.filter((folder) => folder.parentId === parentId);
      },

      getDocument: (id: string) => {
        return get().documents.find((doc) => doc.id === id);
      },

      renameDocument: (id: string, name: string) => {
        set((state) => ({
          documents: state.documents.map((doc) =>
            doc.id === id ? { ...doc, name, updatedAt: Date.now() } : doc
          ),
        }));
      },

      renameFolder: (id: string, name: string) => {
        set((state) => ({
          folders: state.folders.map((folder) =>
            folder.id === id ? { ...folder, name } : folder
          ),
        }));
      },
    }),
    {
      name: 'printmd-documents',
    }
  )
);
