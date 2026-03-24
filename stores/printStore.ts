import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PrintStore, PrintSettings, Margins, HeaderFooterConfig } from '@/types/print';

const defaultSettings: PrintSettings = {
  paperSize: 'A4',
  orientation: 'portrait',
  margins: {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20,
  },
  includeBackground: false,
  header: {
    enabled: true,
    left: '{title}',
    center: '',
    right: '{date}',
  },
  footer: {
    enabled: true,
    left: '',
    center: '{page} / {pages}',
    right: '',
  },
};

const initialState = {
  settings: defaultSettings,
  isPreviewOpen: false,
};

export const usePrintStore = create<PrintStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      updateSettings: (settings: Partial<PrintSettings>) =>
        set((state) => ({
          settings: { ...state.settings, ...settings },
        })),

      updateMargins: (margins: Partial<Margins>) =>
        set((state) => ({
          settings: {
            ...state.settings,
            margins: { ...state.settings.margins, ...margins },
          },
        })),

      updateHeader: (header: Partial<HeaderFooterConfig>) =>
        set((state) => ({
          settings: {
            ...state.settings,
            header: { ...state.settings.header, ...header },
          },
        })),

      updateFooter: (footer: Partial<HeaderFooterConfig>) =>
        set((state) => ({
          settings: {
            ...state.settings,
            footer: { ...state.settings.footer, ...footer },
          },
        })),

      openPreview: () => set({ isPreviewOpen: true }),

      closePreview: () => set({ isPreviewOpen: false }),

      print: () => {
        const { closePreview } = get();
        window.print();
        closePreview();
      },
    }),
    {
      name: 'printmd-print',
      partialize: (state) => ({
        settings: state.settings,
      }),
    }
  )
);
