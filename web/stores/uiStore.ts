import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { EditableElement } from '@/types/style';

export type ViewMode = 'split' | 'editor' | 'preview';

export interface SpacingHighlight {
  element: EditableElement;
  type: 'margin' | 'padding';
  side: 'top' | 'bottom' | 'left' | 'right';
}

export interface UIState {
  viewMode: ViewMode;
  isStylePanelOpen: boolean;
  isFullscreen: boolean;
  editorWidth: number;
  stylePanelWidth: number;
  spacingHighlight: SpacingHighlight | null;
}

export interface UIActions {
  setViewMode: (mode: ViewMode) => void;
  toggleStylePanel: () => void;
  openStylePanel: () => void;
  closeStylePanel: () => void;
  toggleFullscreen: () => void;
  setEditorWidth: (width: number) => void;
  setStylePanelWidth: (width: number) => void;
  setSpacingHighlight: (highlight: SpacingHighlight | null) => void;
}

export type UIStore = UIState & UIActions;

const initialState: UIState = {
  viewMode: 'split',
  isStylePanelOpen: false,
  isFullscreen: false,
  editorWidth: 50,
  stylePanelWidth: 320,
  spacingHighlight: null,
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

      setStylePanelWidth: (stylePanelWidth: number) =>
        set({ stylePanelWidth: Math.min(Math.max(stylePanelWidth, 240), 480) }),

      setSpacingHighlight: (spacingHighlight) => set({ spacingHighlight }),
    }),
    {
      name: 'printmd-ui',
      partialize: (state) => ({
        viewMode: state.viewMode,
        editorWidth: state.editorWidth,
        stylePanelWidth: state.stylePanelWidth,
      }),
    }
  )
);
