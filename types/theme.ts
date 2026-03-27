import type { GlobalStyles, ThemePreset } from './style';

export interface ThemeDefinition {
  name: string;
  description: string;
  styles: GlobalStyles;
}

export type ThemePresets = Record<ThemePreset, ThemeDefinition>;

export interface ThemeSelectorProps {
  currentTheme: ThemePreset;
  onSelect: (theme: ThemePreset) => void;
}

/** @deprecated Use getThemeNames(locale) instead */
export const THEME_NAMES: Record<ThemePreset, string> = {
  default: 'Default',
  dark: 'Dark',
  document: 'Document',
  blog: 'Blog',
  minimal: 'Minimal',
  sepia: 'Sepia',
  ocean: 'Ocean',
  forest: 'Forest',
  sunset: 'Sunset',
  newspaper: 'Newspaper',
  academic: 'Academic',
  notebook: 'Notebook',
  terminal: 'Terminal',
  elegant: 'Elegant',
  pastel: 'Pastel',
};

/** @deprecated Use getThemeDescriptions(locale) instead */
export const THEME_DESCRIPTIONS: Record<ThemePreset, string> = {
  default: 'Clean white background, dark text',
  dark: 'Dark background, light text',
  document: 'Serif font, generous margins',
  blog: 'Readability focused, wide line height',
  minimal: 'Minimal styling, print optimized',
  sepia: 'Vintage feel, warm tones',
  ocean: 'Deep ocean blue, cool tones',
  forest: 'Natural green, easy on the eyes',
  sunset: 'Purple twilight, warm atmosphere',
  newspaper: 'Classic newspaper, serif type',
  academic: 'Academic paper, structured layout',
  notebook: 'Notebook feel, wide line spacing',
  terminal: 'Developer terminal, monospace',
  elegant: 'Elegant serif, gold accents',
  pastel: 'Soft pastel, lavender tones',
};
