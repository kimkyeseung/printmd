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
  sepia: '세피아 (Sepia)',
  ocean: '오션 (Ocean)',
  forest: '포레스트 (Forest)',
  sunset: '선셋 (Sunset)',
  newspaper: '뉴스페이퍼 (Newspaper)',
  academic: '아카데믹 (Academic)',
  notebook: '노트북 (Notebook)',
  terminal: '터미널 (Terminal)',
  elegant: '엘레강트 (Elegant)',
  pastel: '파스텔 (Pastel)',
};

export const THEME_DESCRIPTIONS: Record<ThemePreset, string> = {
  default: '깔끔한 흰 배경, 검정 텍스트',
  dark: '어두운 배경, 밝은 텍스트',
  document: '세리프 폰트, 넉넉한 여백',
  blog: '가독성 중심, 넓은 행간',
  minimal: '최소 스타일, 인쇄 최적화',
  sepia: '빈티지 느낌, 따뜻한 톤',
  ocean: '깊은 바다색, 시원한 느낌',
  forest: '자연의 초록, 편안한 눈',
  sunset: '보라빛 노을, 따뜻한 분위기',
  newspaper: '클래식 신문, 세리프 활자',
  academic: '학술 논문, 정돈된 레이아웃',
  notebook: '노트 필기, 넓은 줄간격',
  terminal: '개발자 터미널, 모노스페이스',
  elegant: '고급스러운 세리프, 골드 포인트',
  pastel: '부드러운 파스텔, 라벤더 톤',
};
