import { create } from 'zustand';
import type { EditorStore } from '@/types/editor';

const initialState = {
  content: '',
  sourceUrl: null,
  currentDocumentId: null,
};

export const useEditorStore = create<EditorStore>((set) => ({
  ...initialState,

  setContent: (content: string) =>
    set({ content }),

  setSourceUrl: (sourceUrl: string | null) =>
    set({ sourceUrl }),

  setCurrentDocumentId: (currentDocumentId: string | null) =>
    set({ currentDocumentId }),

  reset: () =>
    set(initialState),
}));
