export interface Padding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface ElementStyle {
  color?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  backgroundColor?: string;
  marginTop?: number;
  marginBottom?: number;
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  textIndent?: number;
}

export type EditableElement =
  | 'page' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  | 'paragraph' | 'bulletList' | 'orderedList' | 'todoList' | 'todoChecked'
  | 'blockquote' | 'hr' | 'image' | 'code' | 'table';

export type ElementStyles = Partial<Record<EditableElement, ElementStyle>>;

export interface CustomFont {
  name: string;
  url: string;
}

export interface ColorPreset {
  name: string;
  color: string;
}

export interface GlobalStyles {
  fontSize: number;
  fontFamily: string;
  textColor: string;
  backgroundColor: string;
  lineHeight: number;
  linkColor: string;
  codeBackground: string;
  maxWidth: number;
  padding: Padding;
}

export interface ItemStyle {
  color?: string;
  backgroundColor?: string;
  fontWeight?: string;
}

export interface ListStyles {
  firstChild?: ItemStyle;
  lastChild?: ItemStyle;
  oddChild?: ItemStyle;
  evenChild?: ItemStyle;
  nthChild?: {
    n: number;
    style: ItemStyle;
  };
  prefix?: string;
  suffix?: string;
}

export interface HeadingStyle {
  fontSize?: number;
  fontWeight?: string;
  color?: string;
  marginTop?: number;
  marginBottom?: number;
}

export interface HeadingStyles {
  h1?: HeadingStyle;
  h2?: HeadingStyle;
  h3?: HeadingStyle;
  h4?: HeadingStyle;
  h5?: HeadingStyle;
  h6?: HeadingStyle;
}

export interface CustomTheme {
  id: string;
  name: string;
  globalStyles: GlobalStyles;
  listStyles?: ListStyles;
  headingStyles?: HeadingStyles;
  elementStyles?: ElementStyles;
  createdAt: string;
}

export interface StyleState {
  currentTheme: ThemePreset;
  globalStyles: GlobalStyles;
  listStyles: ListStyles;
  headingStyles: HeadingStyles;
  customThemes: CustomTheme[];
  elementStyles: ElementStyles;
  customFonts: CustomFont[];
  colorPresets: ColorPreset[];
}

export interface StyleActions {
  setTheme: (theme: ThemePreset) => void;
  updateGlobalStyles: (styles: Partial<GlobalStyles>) => void;
  updateListStyles: (styles: Partial<ListStyles>) => void;
  updateHeadingStyles: (styles: Partial<HeadingStyles>) => void;
  saveCustomTheme: (name: string) => void;
  loadCustomTheme: (id: string) => void;
  deleteCustomTheme: (id: string) => void;
  renameCustomTheme: (id: string, name: string) => void;
  importCustomTheme: (theme: CustomTheme) => void;
  resetToDefault: () => void;
  updateElementStyle: (element: EditableElement, style: Partial<ElementStyle>) => void;
  resetElementStyle: (element: EditableElement) => void;
  addCustomFont: (font: CustomFont) => void;
  removeCustomFont: (name: string) => void;
  addColorPreset: (preset: ColorPreset) => void;
  removeColorPreset: (name: string) => void;
  updateColorPreset: (name: string, preset: Partial<ColorPreset>) => void;
}

export type StyleStore = StyleState & StyleActions;

export type ThemePreset =
  | 'default' | 'dark' | 'document' | 'blog' | 'minimal'
  | 'sepia' | 'ocean' | 'forest' | 'sunset' | 'newspaper'
  | 'academic' | 'notebook' | 'terminal' | 'elegant' | 'pastel';

export interface StylePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface GlobalStyleControlsProps {
  styles: GlobalStyles;
  onChange: (styles: Partial<GlobalStyles>) => void;
}

export interface ListStyleControlsProps {
  styles: ListStyles;
  onChange: (styles: Partial<ListStyles>) => void;
}

export interface HeadingStyleControlsProps {
  styles: HeadingStyles;
  onChange: (styles: Partial<HeadingStyles>) => void;
}
