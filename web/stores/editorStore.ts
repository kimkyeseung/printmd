import { create } from 'zustand';
import type { EditorStore } from '@/types/editor';

const initialState = {
  content: '',
  sourceUrl: null,
  isFromExtension: false,
  isDirty: false,
};

export const useEditorStore = create<EditorStore>((set) => ({
  ...initialState,

  setContent: (content: string) =>
    set({ content, isDirty: true }),

  setSourceUrl: (sourceUrl: string | null) =>
    set({ sourceUrl }),

  loadFromExtension: (content: string, sourceUrl?: string) =>
    set({
      content,
      sourceUrl: sourceUrl ?? null,
      isFromExtension: true,
      isDirty: false,
    }),

  markClean: () =>
    set({ isDirty: false }),

  reset: () =>
    set(initialState),
}));
