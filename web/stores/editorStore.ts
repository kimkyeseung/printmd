import { create } from 'zustand';
import type { EditorStore } from '@/types/editor';

const initialState = {
  sourceUrl: null as string | null,
};

export const useEditorStore = create<EditorStore>((set) => ({
  ...initialState,

  setSourceUrl: (sourceUrl: string | null) =>
    set({ sourceUrl }),

  reset: () =>
    set(initialState),
}));
