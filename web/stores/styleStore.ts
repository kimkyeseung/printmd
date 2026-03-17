import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { StyleStore, ThemePreset, GlobalStyles, ListStyles, HeadingStyles, CustomTheme, EditableElement, ElementStyle, ElementStyles, CustomFont } from '@/types/style';

const defaultGlobalStyles: GlobalStyles = {
  fontSize: 16,
  fontFamily: 'system-ui, -apple-system, sans-serif',
  textColor: '#1a1a1a',
  backgroundColor: '#ffffff',
  lineHeight: 1.6,
  linkColor: '#0066cc',
  codeBackground: '#f5f5f5',
  maxWidth: 800,
  padding: { top: 40, right: 40, bottom: 40, left: 40 },
};

const themePresets: Record<ThemePreset, GlobalStyles> = {
  default: defaultGlobalStyles,
  dark: {
    fontSize: 16,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    textColor: '#e0e0e0',
    backgroundColor: '#1a1a1a',
    lineHeight: 1.6,
    linkColor: '#6db3f2',
    codeBackground: '#2d2d2d',
    maxWidth: 800,
    padding: { top: 40, right: 40, bottom: 40, left: 40 },
  },
  document: {
    fontSize: 14,
    fontFamily: 'Georgia, "Times New Roman", serif',
    textColor: '#333333',
    backgroundColor: '#ffffff',
    lineHeight: 1.8,
    linkColor: '#1a0dab',
    codeBackground: '#f8f8f8',
    maxWidth: 700,
    padding: { top: 60, right: 60, bottom: 60, left: 60 },
  },
  blog: {
    fontSize: 18,
    fontFamily: '"Noto Sans KR", system-ui, sans-serif',
    textColor: '#2c2c2c',
    backgroundColor: '#fafafa',
    lineHeight: 2.0,
    linkColor: '#0070f3',
    codeBackground: '#f0f0f0',
    maxWidth: 720,
    padding: { top: 48, right: 24, bottom: 48, left: 24 },
  },
  minimal: {
    fontSize: 14,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    textColor: '#000000',
    backgroundColor: '#ffffff',
    lineHeight: 1.5,
    linkColor: '#000000',
    codeBackground: '#f5f5f5',
    maxWidth: 650,
    padding: { top: 20, right: 20, bottom: 20, left: 20 },
  },
};

const initialState = {
  currentTheme: 'default' as ThemePreset,
  globalStyles: defaultGlobalStyles,
  listStyles: {} as ListStyles,
  headingStyles: {} as HeadingStyles,
  customThemes: [] as CustomTheme[],
  elementStyles: {} as ElementStyles,
  customFonts: [] as CustomFont[],
};

export const useStyleStore = create<StyleStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setTheme: (theme: ThemePreset) =>
        set({
          currentTheme: theme,
          globalStyles: { ...themePresets[theme] },
        }),

      updateGlobalStyles: (styles: Partial<GlobalStyles>) =>
        set((state) => ({
          globalStyles: { ...state.globalStyles, ...styles },
        })),

      updateListStyles: (styles: Partial<ListStyles>) =>
        set((state) => ({
          listStyles: { ...state.listStyles, ...styles },
        })),

      updateHeadingStyles: (styles: Partial<HeadingStyles>) =>
        set((state) => ({
          headingStyles: { ...state.headingStyles, ...styles },
        })),

      saveCustomTheme: (name: string) => {
        const { globalStyles, listStyles, headingStyles, elementStyles, customThemes } = get();
        const newTheme: CustomTheme = {
          id: `custom-${Date.now()}`,
          name,
          globalStyles: { ...globalStyles },
          listStyles: { ...listStyles },
          headingStyles: { ...headingStyles },
          elementStyles: { ...elementStyles },
          createdAt: new Date().toISOString(),
        };
        set({ customThemes: [...customThemes, newTheme] });
      },

      loadCustomTheme: (id: string) => {
        const { customThemes } = get();
        const theme = customThemes.find((t) => t.id === id);
        if (theme) {
          set({
            globalStyles: { ...theme.globalStyles },
            listStyles: { ...theme.listStyles },
            headingStyles: { ...theme.headingStyles },
            elementStyles: theme.elementStyles ? { ...theme.elementStyles } : {},
          });
        }
      },

      deleteCustomTheme: (id: string) =>
        set((state) => ({
          customThemes: state.customThemes.filter((t) => t.id !== id),
        })),

      updateElementStyle: (element: EditableElement, style: Partial<ElementStyle>) =>
        set((state) => ({
          elementStyles: {
            ...state.elementStyles,
            [element]: { ...state.elementStyles[element], ...style },
          },
        })),

      resetElementStyle: (element: EditableElement) =>
        set((state) => {
          const { [element]: _, ...rest } = state.elementStyles;
          return { elementStyles: rest };
        }),

      addCustomFont: (font: CustomFont) =>
        set((state) => ({
          customFonts: [...state.customFonts, font],
        })),

      removeCustomFont: (name: string) =>
        set((state) => ({
          customFonts: state.customFonts.filter((f) => f.name !== name),
        })),

      resetToDefault: () =>
        set({
          currentTheme: 'default',
          globalStyles: defaultGlobalStyles,
          listStyles: {},
          headingStyles: {},
          elementStyles: {},
          customFonts: [],
        }),
    }),
    {
      name: 'printmd-styles',
      partialize: (state) => ({
        currentTheme: state.currentTheme,
        globalStyles: state.globalStyles,
        listStyles: state.listStyles,
        headingStyles: state.headingStyles,
        customThemes: state.customThemes,
        elementStyles: state.elementStyles,
        customFonts: state.customFonts,
      }),
    }
  )
);

export { themePresets };
