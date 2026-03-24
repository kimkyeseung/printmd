import type { GlobalStyles, ThemePreset } from '@/types/style';

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

export const themePresets: Record<ThemePreset, GlobalStyles> = {
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

export const defaultStyles = defaultGlobalStyles;
export const presetKeys: ThemePreset[] = ['default', 'dark', 'document', 'blog', 'minimal'];
