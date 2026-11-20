import type { Locale } from '@/lib/i18n/config';

/**
 * Release notes shown on /[locale]/changelog and linked from the editor's
 * sidebar. Newest first. Add an entry per release and bump the changelog's
 * lastModified in app/sitemap.ts to the same date.
 *
 * What to record and how to write it: docs/changelog-guide.md.
 */

export type ChangeKind = 'new' | 'improved' | 'fixed';

type Localized = Record<Locale, string>;

export interface ChangelogImage {
  /** File is public/changelog/<date>/<locale>-<name>.png (scripts/capture-changelog.mjs). */
  name: string;
  /** Pixel size per locale; the captures differ where text wraps differently. */
  size: Record<Locale, [width: number, height: number]>;
  alt: Localized;
  caption: Localized;
}

export interface ChangelogEntry {
  /** Release date, YYYY-MM-DD. Also the entry's anchor id. */
  date: string;
  title: Localized;
  summary: Localized;
  images?: ChangelogImage[];
  changes: { kind: ChangeKind; text: Localized }[];
}

export function changelogImageSrc(entry: ChangelogEntry, image: ChangelogImage, locale: Locale): string {
  return `/changelog/${entry.date}/${locale}-${image.name}.png`;
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    date: '2026-11-20',
    title: {
      ko: '코드블럭 문법 강조·코드 테마, 프롬프트 문서를 위한 문서 정보 카드',
      en: 'Syntax highlighting, code themes, and a front matter card for prompt files',
    },
    summary: {
      ko: '코드와 프롬프트 문서를 더 보기 좋게 쓰고 출력할 수 있도록 코드블럭과 YAML 프론트매터 표시를 크게 개선했습니다. 메타 프롬프트나 스킬 파일(SKILL.md)처럼 맨 앞에 name, description 같은 메타데이터가 붙은 프롬프트 문서도 이제 깔끔한 문서 정보 카드로 보이고, 그대로 PDF로 저장할 수 있습니다. 프롬프트를 마크다운으로 관리하는 프롬프터라면 프롬프트 모음을 문서로 정리할 때 써 보세요.',
      en: 'Code blocks and YAML front matter got a big upgrade, so code and prompt documents read and print better. Prompt files that start with metadata such as name and description — meta prompts, skill files (SKILL.md) and the like — now show that metadata as a tidy document info card, and save to PDF just as they look. If you keep your prompts in Markdown, this makes a prompt library easy to turn into a readable document.',
    },
    images: [
      {
        name: 'code-and-frontmatter',
        size: { ko: [1536, 894], en: [1536, 936] },
        alt: {
          ko: '메타 프롬프트 문서의 프론트매터가 name, description, tags, version 카드로 표시되고, 아래 TypeScript 코드블럭에 문법 강조와 언어·테마·복사 툴바가 보이는 미리보기',
          en: 'Preview of a meta prompt file: its front matter shown as a name, description, tags and version card, and a TypeScript code block with syntax highlighting and the language, theme and copy toolbar',
        },
        caption: {
          ko: '프론트매터는 문서 정보 카드로, 코드블럭은 언어에 맞는 색으로 표시됩니다. 코드블럭에 마우스를 올리면 툴바가 나타납니다.',
          en: 'Front matter becomes a document info card and code is coloured for its language. Hover a code block to bring up its toolbar.',
        },
      },
      {
        name: 'code-theme',
        size: { ko: [1536, 414], en: [1536, 414] },
        alt: {
          ko: '코드블럭 툴바에서 Dracula 테마를 선택해 어두운 배경에 색이 입혀진 TypeScript 코드',
          en: 'TypeScript code in the Dracula theme, chosen from the code block toolbar',
        },
        caption: {
          ko: '툴바에서 테마를 고르면 바로 바뀝니다. (Dracula)',
          en: 'Pick a theme from the toolbar and it applies at once. (Dracula)',
        },
      },
      {
        name: 'style-panel',
        size: { ko: [2488, 2034], en: [2488, 2034] },
        alt: {
          ko: '스타일 설정 패널에서 문서 정보를 선택해 키와 값 묶음이 각각 색상·폰트·글자 크기·굵기 칸을 가진 카드로 나뉜 모습',
          en: 'The style panel with Front Matter selected: Keys and Values are separate cards, each with colour, font, size and weight',
        },
        caption: {
          ko: '스타일 패널에서 키와 값을 따로 꾸밀 수 있고, 설정 묶음이 카드로 구분됩니다.',
          en: 'Style keys and values separately in the style panel, where each group of settings is its own card.',
        },
      },
    ],
    changes: [
      {
        kind: 'new',
        text: {
          ko: '코드블럭 문법 강조: ```ts 처럼 언어를 적으면 언어에 맞는 색이 입혀집니다. TypeScript, Python, Go, Rust, Kotlin, Swift, C/C++, C#, PHP, Ruby, SQL 등 24개 언어를 지원합니다.',
          en: 'Syntax highlighting: write a language after the fence (```ts) and the code is coloured for it. 24 languages including TypeScript, Python, Go, Rust, Kotlin, Swift, C/C++, C#, PHP, Ruby and SQL.',
        },
      },
      {
        kind: 'new',
        text: {
          ko: '코드 테마: GitHub, One, Monokai, Dracula, Nord, Solarized 테마를 고를 수 있고, 미리보기·인쇄·PDF에 똑같이 적용됩니다. 기본값(자동)은 코드 배경 밝기에 맞춰 밝은/어두운 색을 고릅니다.',
          en: 'Code themes: choose GitHub, One, Monokai, Dracula, Nord or Solarized — the same in the preview, print and PDF. The default (Auto) picks light or dark colours to suit the code background.',
        },
      },
      {
        kind: 'new',
        text: {
          ko: '코드블럭 툴바: 미리보기에서 코드블럭에 마우스를 올리면 언어와 테마를 바로 바꾸고 코드를 복사할 수 있습니다. 언어를 바꾸면 원본 마크다운도 함께 수정됩니다.',
          en: 'Code block toolbar: hover a code block in the preview to change its language or theme and copy the code. Changing the language updates the Markdown source too.',
        },
      },
      {
        kind: 'new',
        text: {
          ko: '문서 정보 카드: 문서 맨 앞의 YAML 프론트매터(--- 로 감싼 블록)를 키와 값으로 된 카드로 보여줍니다. 메타 프롬프트, 스킬 파일, 블로그 글 메타데이터 등에 쓰입니다.',
          en: 'Document info card: YAML front matter at the top of a file (the block between --- lines) is shown as a key/value card — handy for meta prompts, skill files and blog post metadata.',
        },
      },
      {
        kind: 'new',
        text: {
          ko: '문서 정보 스타일: 스타일 패널에서 키와 값의 색상·서체·크기·굵기를 각각 바꾸고, 카드의 배경·여백·테두리도 설정할 수 있습니다.',
          en: 'Document info styling: in the style panel, set colour, font, size and weight separately for keys and values, plus the card\'s background, margin and border.',
        },
      },
      {
        kind: 'improved',
        text: {
          ko: '코드블럭과 인라인 코드를 따로 꾸밀 수 있습니다. 기존에 저장한 스타일은 지금 모습 그대로 옮겨집니다.',
          en: 'Code blocks and inline code are now styled separately. Styles you saved earlier carry over unchanged.',
        },
      },
      {
        kind: 'improved',
        text: {
          ko: '스타일 패널의 설정 묶음을 카드로 구분해 어떤 칸이 어느 묶음에 속하는지 한눈에 보입니다. 색상 칸에는 실제 화면에 보이는 기본 색이 표시됩니다.',
          en: 'Style panel groups are now separate cards, so it\'s clear which fields belong together. Colour fields show the default colour that is actually on screen.',
        },
      },
      {
        kind: 'improved',
        text: {
          ko: '스타일 패널을 열면 오른쪽 광고 영역을 숨겨 미리보기를 더 넓게 씁니다.',
          en: 'Opening the style panel hides the right-hand ad column, giving the preview more room.',
        },
      },
      {
        kind: 'fixed',
        text: {
          ko: '코드블럭의 여백·테두리가 줄마다 따로 그려지던 문제를 고쳤습니다.',
          en: 'Fixed code block margin and border being drawn on every line.',
        },
      },
      {
        kind: 'fixed',
        text: {
          ko: '프론트매터의 닫는 --- 때문에 메타데이터 전체가 거대한 제목으로 보이던 문제를 고쳤습니다.',
          en: 'Fixed front matter turning into one giant heading because of its closing ---.',
        },
      },
      {
        kind: 'fixed',
        text: {
          ko: '요소 초기화 시 문서 정보의 키·값, 표의 헤더·셀 설정이 남던 문제와 요소 버튼을 고를 때 버튼 줄이 흔들리던 문제를 고쳤습니다.',
          en: 'Fixed element reset leaving front matter key/value and table header/cell styles behind, and the element buttons shifting when one was selected.',
        },
      },
    ],
  },
];

export const LATEST_CHANGELOG_DATE = CHANGELOG[0].date;

/** Copy for the changelog page itself. */
export const CHANGELOG_PAGE: Record<Locale, {
  title: string;
  heading: string;
  description: string;
  keywords: string[];
  kinds: Record<ChangeKind, string>;
  cta: string;
  ctaButton: string;
}> = {
  ko: {
    title: '업데이트 내역',
    heading: 'printmd 업데이트 내역',
    description: 'printmd의 새 기능과 개선 사항을 날짜별로 정리했습니다. 코드블럭 문법 강조와 코드 테마, 메타 프롬프트·스킬 파일 같은 프롬프트 문서의 프론트매터를 보여주는 문서 정보 카드 등 최근 변경 사항을 확인하세요.',
    keywords: [
      'printmd 업데이트', '마크다운 에디터 업데이트', '메타 프롬프트', '메타 프롬프트 PDF', '프롬프터',
      '프롬프트 문서 PDF 변환', '프롬프트 마크다운', 'SKILL.md 뷰어', 'YAML 프론트매터 미리보기',
      '마크다운 프론트매터', '마크다운 코드블럭 문법 강조', '마크다운 코드 테마',
    ],
    kinds: { new: '새 기능', improved: '개선', fixed: '수정' },
    cta: '새 기능을 바로 써 보세요.',
    ctaButton: '에디터 열기',
  },
  en: {
    title: 'Updates',
    heading: 'printmd updates',
    description: 'New features and improvements in printmd, by date: syntax highlighting and code themes, and a document info card that shows the front matter of prompt files such as meta prompts and skill files.',
    keywords: [
      'printmd updates', 'printmd changelog', 'markdown editor updates', 'meta prompt', 'meta prompt to pdf',
      'prompter', 'prompt markdown to pdf', 'SKILL.md viewer', 'yaml front matter preview',
      'markdown front matter', 'markdown syntax highlighting', 'markdown code theme',
    ],
    kinds: { new: 'New', improved: 'Improved', fixed: 'Fixed' },
    cta: 'Try the new features now.',
    ctaButton: 'Open the editor',
  },
};
