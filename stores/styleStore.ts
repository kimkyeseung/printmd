import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { temporal } from 'zundo';
import type { StyleStore, ThemePreset, GlobalStyles, ListStyles, HeadingStyles, CustomTheme, EditableElement, ElementStyle, ElementStyles, CustomFont, ColorPreset } from '@/types/style';
import { themePresets, themeElementStyles, defaultStyles } from '@/lib/themes/presets';
import { deriveColorRolesFromStyles } from '@/lib/themes/colorRoles';
import { migrateLegacyCodeStyles, ELEMENT_STYLES_VERSION } from '@/lib/themes/migrateElementStyles';

/** Bring a custom theme saved before the code / inline code split up to date. */
function upgradeCustomTheme(theme: CustomTheme): CustomTheme {
  if ((theme.version ?? 1) >= ELEMENT_STYLES_VERSION) return theme;
  return { ...theme, elementStyles: migrateLegacyCodeStyles(theme.elementStyles), version: ELEMENT_STYLES_VERSION };
}

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

        setTheme: (theme: ThemePreset) => {
          const gs = themePresets[theme];
          const es = themeElementStyles[theme] ? { ...themeElementStyles[theme] } : {};
          set({
            currentTheme: theme,
            globalStyles: { ...gs },
            elementStyles: es,
            colorPresets: deriveColorRolesFromStyles(gs, es),
          });
        },

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
            version: ELEMENT_STYLES_VERSION,
            createdAt: new Date().toISOString(),
          };
          set({ customThemes: [...customThemes, newTheme] });
        },

        loadCustomTheme: (id: string) => {
          const { customThemes } = get();
          const found = customThemes.find((t) => t.id === id);
          const theme = found && upgradeCustomTheme(found);
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
              { ...upgradeCustomTheme(theme), id: `custom-${Date.now()}` },
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
      // v2: the code element split into code (blocks) and inlineCode.
      version: ELEMENT_STYLES_VERSION,
      migrate: (persisted, version) => {
        const state = (persisted ?? {}) as Partial<StyleStore>;
        if (version < ELEMENT_STYLES_VERSION) {
          state.elementStyles = migrateLegacyCodeStyles(state.elementStyles) ?? {};
          state.customThemes = (state.customThemes ?? []).map(upgradeCustomTheme);
        }
        return state as StyleStore;
      },
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
