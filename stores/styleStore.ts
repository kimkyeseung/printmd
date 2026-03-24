import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { temporal } from 'zundo';
import type { StyleStore, ThemePreset, GlobalStyles, ListStyles, HeadingStyles, CustomTheme, EditableElement, ElementStyle, ElementStyles, CustomFont, ColorPreset } from '@/types/style';
import { themePresets, defaultStyles } from '@/lib/themes/presets';

const defaultGlobalStyles = defaultStyles;

const initialState = {
  currentTheme: 'default' as ThemePreset,
  globalStyles: defaultGlobalStyles,
  listStyles: {} as ListStyles,
  headingStyles: {} as HeadingStyles,
  customThemes: [] as CustomTheme[],
  elementStyles: {} as ElementStyles,
  customFonts: [] as CustomFont[],
  colorPresets: [] as ColorPreset[],
};

export const useStyleStore = create<StyleStore>()(
  persist(
    temporal(
      (set, get) => ({
        ...initialState,

        setTheme: (theme: ThemePreset) =>
          set({
            currentTheme: theme,
            globalStyles: { ...themePresets[theme] },
            elementStyles: {},
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

        renameCustomTheme: (id: string, name: string) =>
          set((state) => ({
            customThemes: state.customThemes.map((t) =>
              t.id === id ? { ...t, name } : t
            ),
          })),

        importCustomTheme: (theme: CustomTheme) =>
          set((state) => ({
            customThemes: [
              ...state.customThemes,
              { ...theme, id: `custom-${Date.now()}` },
            ],
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

        addColorPreset: (preset: ColorPreset) =>
          set((state) => ({
            colorPresets: [...state.colorPresets, preset],
          })),

        removeColorPreset: (name: string) =>
          set((state) => ({
            colorPresets: state.colorPresets.filter((p) => p.name !== name),
          })),

        updateColorPreset: (name: string, update: Partial<ColorPreset>) =>
          set((state) => ({
            colorPresets: state.colorPresets.map((p) =>
              p.name === name ? { ...p, ...update } : p
            ),
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
        limit: 50,
        partialize: (state) => {
          const { currentTheme, globalStyles, listStyles, headingStyles, elementStyles } = state;
          return { currentTheme, globalStyles, listStyles, headingStyles, elementStyles } as StyleStore;
        },
      }
    ),
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
        colorPresets: state.colorPresets,
      }),
    }
  )
);

export { themePresets };
