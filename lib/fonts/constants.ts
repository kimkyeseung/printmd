export const FONT_OPTIONS = [
  { value: 'system-ui, -apple-system, sans-serif', label: 'System (Sans)' },
  { value: '"Noto Sans KR", system-ui, sans-serif', label: 'Noto Sans KR' },
  { value: 'Georgia, "Times New Roman", serif', label: 'Georgia (Serif)' },
  { value: '"Nanum Gothic", sans-serif', label: 'Nanum Gothic' },
  { value: '"Nanum Myeongjo", serif', label: 'Nanum Myeongjo' },
  { value: 'ui-monospace, SFMono-Regular, monospace', label: 'Monospace' },
] as const;

export const FONT_OPTIONS_WITH_DEFAULT = [
  { value: '', label: 'Default' },
  ...FONT_OPTIONS,
] as const;
