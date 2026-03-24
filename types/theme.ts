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

export const THEME_NAMES: Record<ThemePreset, string> = {
  default: '기본 (Default)',
  dark: '다크 (Dark)',
  document: '문서형 (Document)',
  blog: '블로그형 (Blog)',
  minimal: '미니멀 (Minimal)',
};

export const THEME_DESCRIPTIONS: Record<ThemePreset, string> = {
  default: '깔끔한 흰 배경, 검정 텍스트',
  dark: '어두운 배경, 밝은 텍스트',
  document: '세리프 폰트, 넉넉한 여백',
  blog: '가독성 중심, 넓은 행간',
  minimal: '최소 스타일, 인쇄 최적화',
};
