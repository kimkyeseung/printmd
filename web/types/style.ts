export interface Padding {
  top: number;
  right: number;
  bottom: number;
  left: number;
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
  createdAt: string;
}

export interface StyleState {
  currentTheme: ThemePreset;
  globalStyles: GlobalStyles;
  listStyles: ListStyles;
  headingStyles: HeadingStyles;
  customThemes: CustomTheme[];
}

export interface StyleActions {
  setTheme: (theme: ThemePreset) => void;
  updateGlobalStyles: (styles: Partial<GlobalStyles>) => void;
  updateListStyles: (styles: Partial<ListStyles>) => void;
  updateHeadingStyles: (styles: Partial<HeadingStyles>) => void;
  saveCustomTheme: (name: string) => void;
  loadCustomTheme: (id: string) => void;
  deleteCustomTheme: (id: string) => void;
  resetToDefault: () => void;
}

export type StyleStore = StyleState & StyleActions;

export type ThemePreset = 'default' | 'dark' | 'document' | 'blog' | 'minimal';

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
