/**
 * Syntax-highlight palettes for fenced code blocks.
 *
 * `auto` picks GitHub light or dark from the theme's code background. Every
 * other theme brings its own block background and text colour so the tokens
 * are always drawn on the surface they were designed for.
 */

export type CodeThemeId =
  | 'auto'
  | 'none'
  | 'github-light'
  | 'github-dark'
  | 'one-light'
  | 'one-dark'
  | 'monokai'
  | 'dracula'
  | 'nord'
  | 'solarized-light';

export interface CodeThemePalette {
  background: string;
  foreground: string;
  comment: string;
  keyword: string;
  string: string;
  number: string;
  title: string;
  type: string;
  tag: string;
  meta: string;
  addition: string;
  additionBg: string;
  deletion: string;
  deletionBg: string;
}

export interface CodeThemeDefinition {
  id: Exclude<CodeThemeId, 'auto' | 'none'>;
  label: string;
  dark: boolean;
  palette: CodeThemePalette;
}

export const CODE_THEMES: CodeThemeDefinition[] = [
  {
    id: 'github-light',
    label: 'GitHub Light',
    dark: false,
    palette: {
      background: '#f6f8fa', foreground: '#24292e',
      comment: '#6a737d', keyword: '#d73a49', string: '#032f62',
      number: '#005cc5', title: '#6f42c1', type: '#e36209',
      tag: '#22863a', meta: '#6a737d',
      addition: '#22863a', additionBg: '#f0fff4',
      deletion: '#b31d28', deletionBg: '#ffeef0',
    },
  },
  {
    id: 'github-dark',
    label: 'GitHub Dark',
    dark: true,
    palette: {
      background: '#0d1117', foreground: '#c9d1d9',
      comment: '#8b949e', keyword: '#ff7b72', string: '#a5d6ff',
      number: '#79c0ff', title: '#d2a8ff', type: '#ffa657',
      tag: '#7ee787', meta: '#8b949e',
      addition: '#aff5b4', additionBg: 'rgba(46, 160, 67, 0.15)',
      deletion: '#ffdcd7', deletionBg: 'rgba(248, 81, 73, 0.15)',
    },
  },
  {
    id: 'one-light',
    label: 'One Light',
    dark: false,
    palette: {
      background: '#fafafa', foreground: '#383a42',
      comment: '#a0a1a7', keyword: '#a626a4', string: '#50a14f',
      number: '#986801', title: '#4078f2', type: '#c18401',
      tag: '#e45649', meta: '#4078f2',
      addition: '#50a14f', additionBg: 'rgba(80, 161, 79, 0.1)',
      deletion: '#e45649', deletionBg: 'rgba(228, 86, 73, 0.1)',
    },
  },
  {
    id: 'one-dark',
    label: 'One Dark',
    dark: true,
    palette: {
      background: '#282c34', foreground: '#abb2bf',
      comment: '#5c6370', keyword: '#c678dd', string: '#98c379',
      number: '#d19a66', title: '#61afef', type: '#e6c07b',
      tag: '#e06c75', meta: '#61afef',
      addition: '#98c379', additionBg: 'rgba(152, 195, 121, 0.12)',
      deletion: '#e06c75', deletionBg: 'rgba(224, 108, 117, 0.12)',
    },
  },
  {
    id: 'monokai',
    label: 'Monokai',
    dark: true,
    palette: {
      background: '#272822', foreground: '#f8f8f2',
      comment: '#75715e', keyword: '#f92672', string: '#e6db74',
      number: '#ae81ff', title: '#a6e22e', type: '#66d9ef',
      tag: '#f92672', meta: '#75715e',
      addition: '#a6e22e', additionBg: 'rgba(166, 226, 46, 0.12)',
      deletion: '#f92672', deletionBg: 'rgba(249, 38, 114, 0.12)',
    },
  },
  {
    id: 'dracula',
    label: 'Dracula',
    dark: true,
    palette: {
      background: '#282a36', foreground: '#f8f8f2',
      comment: '#6272a4', keyword: '#ff79c6', string: '#f1fa8c',
      number: '#bd93f9', title: '#50fa7b', type: '#8be9fd',
      tag: '#ff79c6', meta: '#6272a4',
      addition: '#50fa7b', additionBg: 'rgba(80, 250, 123, 0.12)',
      deletion: '#ff5555', deletionBg: 'rgba(255, 85, 85, 0.12)',
    },
  },
  {
    id: 'nord',
    label: 'Nord',
    dark: true,
    palette: {
      background: '#2e3440', foreground: '#d8dee9',
      comment: '#616e88', keyword: '#81a1c1', string: '#a3be8c',
      number: '#b48ead', title: '#88c0d0', type: '#8fbcbb',
      tag: '#81a1c1', meta: '#5e81ac',
      addition: '#a3be8c', additionBg: 'rgba(163, 190, 140, 0.12)',
      deletion: '#bf616a', deletionBg: 'rgba(191, 97, 106, 0.12)',
    },
  },
  {
    id: 'solarized-light',
    label: 'Solarized Light',
    dark: false,
    palette: {
      background: '#fdf6e3', foreground: '#657b83',
      comment: '#93a1a1', keyword: '#859900', string: '#2aa198',
      number: '#d33682', title: '#268bd2', type: '#b58900',
      tag: '#268bd2', meta: '#cb4b16',
      addition: '#859900', additionBg: 'rgba(133, 153, 0, 0.1)',
      deletion: '#dc322f', deletionBg: 'rgba(220, 50, 47, 0.1)',
    },
  },
];

export function getCodeTheme(id: CodeThemeId | undefined): CodeThemeDefinition | undefined {
  return CODE_THEMES.find((t) => t.id === id);
}

/**
 * The palette a code block actually renders with. `named` is true when the
 * theme supplies its own block background/text; `auto` keeps the document's
 * code background and picks GitHub light or dark to suit it. `none` → null.
 */
export function resolveCodePalette(
  id: CodeThemeId | undefined,
  codeBackground: string,
): { palette: CodeThemePalette; named: boolean } | null {
  if (id === 'none') return null;
  const named = getCodeTheme(id);
  if (named) return { palette: named.palette, named: true };
  const fallback = isDarkHex(codeBackground) ? 'github-dark' : 'github-light';
  return { palette: getCodeTheme(fallback)!.palette, named: false };
}

function isDarkHex(color: string): boolean {
  const hex = color.trim().replace('#', '');
  if (!/^([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(hex)) return false;
  const full = hex.length === 3 ? hex.replace(/./g, '$&$&') : hex.slice(0, 6);
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 <= 128;
}
