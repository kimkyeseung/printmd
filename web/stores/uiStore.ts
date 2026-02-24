import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ViewMode = 'split' | 'editor' | 'preview';

export interface UIState {
  viewMode: ViewMode;
  isStylePanelOpen: boolean;
  isFullscreen: boolean;
  editorWidth: number;
}

export interface UIActions {
  setViewMode: (mode: ViewMode) => void;
  toggleStylePanel: () => void;
  openStylePanel: () => void;
  closeStylePanel: () => void;
  toggleFullscreen: () => void;
  setEditorWidth: (width: number) => void;
}

export type UIStore = UIState & UIActions;

const initialState: UIState = {
  viewMode: 'split',
  isStylePanelOpen: false,
  isFullscreen: false,
  editorWidth: 50,
};

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      ...initialState,

      setViewMode: (viewMode: ViewMode) => set({ viewMode }),

      toggleStylePanel: () =>
        set((state) => ({ isStylePanelOpen: !state.isStylePanelOpen })),

      openStylePanel: () => set({ isStylePanelOpen: true }),

      closeStylePanel: () => set({ isStylePanelOpen: false }),

      toggleFullscreen: () =>
        set((state) => {
          const newFullscreen = !state.isFullscreen;
          if (newFullscreen) {
            document.documentElement.requestFullscreen?.();
          } else {
            document.exitFullscreen?.();
          }
          return { isFullscreen: newFullscreen };
        }),

      setEditorWidth: (editorWidth: number) =>
        set({ editorWidth: Math.min(Math.max(editorWidth, 20), 80) }),
    }),
    {
      name: 'printmd-ui',
      partialize: (state) => ({
        viewMode: state.viewMode,
        editorWidth: state.editorWidth,
      }),
    }
  )
);
