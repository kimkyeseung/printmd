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
  isSidebarOpen: boolean;
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
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleFullscreen: () => void;
  setEditorWidth: (width: number) => void;
  setStylePanelWidth: (width: number) => void;
  setSpacingHighlight: (highlight: SpacingHighlight | null) => void;
}

export type UIStore = UIState & UIActions;

const initialState: UIState = {
  viewMode: 'split',
  isStylePanelOpen: false,
  isSidebarOpen: false,
  isFullscreen: false,
  editorWidth: 50,
  stylePanelWidth: 360,
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

      toggleSidebar: () =>
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

      openSidebar: () => set({ isSidebarOpen: true }),

      closeSidebar: () => set({ isSidebarOpen: false }),

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

      setStylePanelWidth: (stylePanelWidth: number) => {
        const maxWidth = typeof window !== 'undefined' ? Math.floor(window.innerWidth * 0.45) : 480;
        set({ stylePanelWidth: Math.min(Math.max(stylePanelWidth, 280), Math.min(maxWidth, 480)) });
      },

      setSpacingHighlight: (spacingHighlight) => set({ spacingHighlight }),
    }),
    {
      name: 'printmd-ui',
      partialize: (state) => ({
        viewMode: state.viewMode,
        isSidebarOpen: state.isSidebarOpen,
        editorWidth: state.editorWidth,
        stylePanelWidth: state.stylePanelWidth,
      }),
    }
  )
);
