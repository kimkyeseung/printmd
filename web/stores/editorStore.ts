import { create } from 'zustand';
import type { EditorStore } from '@/types/editor';

const initialState = {
  content: '',
  sourceUrl: null,
  isFromExtension: false,
  isDirty: false,
  currentDocumentId: null,
};

export const useEditorStore = create<EditorStore>((set) => ({
  ...initialState,

  setContent: (content: string) =>
    set({ content, isDirty: true }),

  setSourceUrl: (sourceUrl: string | null) =>
    set({ sourceUrl }),

  setCurrentDocumentId: (currentDocumentId: string | null) =>
    set({ currentDocumentId }),

  loadFromExtension: (content: string, sourceUrl?: string) =>
    set({
      content,
      sourceUrl: sourceUrl ?? null,
      isFromExtension: true,
      isDirty: false,
      currentDocumentId: null,
    }),

  markClean: () =>
    set({ isDirty: false }),

  reset: () =>
    set(initialState),
}));
