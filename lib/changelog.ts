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
  {
    date: '2026-11-06',
    title: {
      ko: '미리보기 폭 눈금자, 문서 사이드바 순서 변경과 의견 보내기',
      en: 'Preview width ruler, sidebar reordering and a feedback button',
    },
    summary: {
      ko: '미리보기 폭을 눈금자로 바로 조절하고, 인쇄될 폭에 맞춰 줄바꿈을 미리 확인할 수 있습니다. 문서 사이드바에서는 드래그로 순서를 바꿀 수 있고, 의견을 바로 메일로 보낼 수 있습니다.',
      en: 'Resize the preview straight from a ruler and check line wrapping at the printed width. In the document sidebar you can drag to reorder, and send feedback by email in one click.',
    },
    changes: [
      c('new',
        '미리보기 폭 눈금자: 미리보기 위 눈금자의 양 끝을 드래그해 폭을 바꿉니다. 더블클릭하면 전체 폭으로, 화살표 키로 50px씩 조절됩니다.',
        'Preview width ruler: drag either end of the ruler above the preview to resize it. Double-click for full width; arrow keys move it 50px at a time.'),
      c('new',
        "인쇄 폭 버튼: 현재 용지의 본문 폭에 맞춰, 인쇄될 때와 같은 위치에서 줄이 바뀌게 합니다.",
        'Print width button: matches the preview to the page body width, so lines wrap where they will when printed.'),
      c('new',
        '문서 사이드바에서 문서와 폴더를 드래그해 순서를 바꿀 수 있고, 저장하지 않은 문서에는 점이 표시됩니다.',
        'Drag documents and folders in the sidebar to reorder them; unsaved documents show a dot.'),
      c('new',
        '의견 보내기: 사이드바에서 바로 메일로 의견을 보낼 수 있습니다. 버그 확인에 필요한 환경 정보가 메일 본문에 미리 채워집니다.',
        'Send feedback: email us straight from the sidebar, with the environment details we need for bug reports filled in.'),
      c('improved',
        '스타일 패널의 최대 너비를 2400px까지 늘릴 수 있습니다.',
        'The style panel\'s maximum width now goes up to 2400px.'),
    ],
  },
  {
    date: '2026-10-10',
    title: {
      ko: '한글(HWP·HWPX) 파일 열기, 서식을 살리는 붙여넣기',
      en: 'Open Hangul (HWP/HWPX) files, and paste with formatting kept',
    },
    summary: {
      ko: '한글 문서를 브라우저에서 바로 열어 마크다운으로 바꿀 수 있습니다. 웹페이지나 ChatGPT·Claude·Gemini 답변을 복사해 붙여 넣으면 제목·목록·표·코드 블록 구조가 그대로 마크다운으로 들어옵니다.',
      en: 'Open Hangul documents right in the browser and turn them into Markdown. Copy from a web page or a ChatGPT, Claude or Gemini answer and paste — headings, lists, tables and code blocks come through as Markdown.',
    },
    changes: [
      c('new',
        'HWPX와 구형 HWP(5.0) 파일을 열면 브라우저 안에서 마크다운으로 변환합니다. 파일은 서버로 올라가지 않습니다.',
        'Opening an HWPX or older HWP (5.0) file converts it to Markdown inside your browser. The file never leaves your computer.'),
      c('new',
        '서식을 살리는 붙여넣기: 웹페이지나 AI 답변을 붙여 넣으면 구조를 살려 마크다운으로 바꿉니다. 코드는 언어가 붙은 코드블럭으로, 수식은 LaTeX 원문으로 복원됩니다.',
        'Paste with formatting: pasting a web page or AI answer keeps its structure as Markdown. Code becomes fenced blocks with their language, and math is restored to its LaTeX source.'),
      c('new',
        'HWP 뷰어, HWP 마크다운 변환, ChatGPT 답변 PDF 저장 안내 페이지를 추가했습니다.',
        'Added guide pages for the HWP viewer, HWP to Markdown, and saving ChatGPT answers as PDF.'),
      c('fixed',
        '크롬 확장 프로그램에서 npm·PyPI·Notion·이슈 페이지 열기가 동작하지 않던 문제를 고쳤습니다.',
        'Fixed the Chrome extension failing to open npm, PyPI, Notion and issue pages.'),
    ],
  },
  {
    date: '2026-09-30',
    title: {
      ko: '에디터 사용성 개선: 초안 유지, 탭 이름, 다크 모드',
      en: 'Editor polish: drafts that survive refresh, tab names, dark mode',
    },
    summary: {
      ko: '매일 쓰기 편하도록 에디터 곳곳을 다듬었습니다. 새로고침해도 쓰던 초안이 남고, 홈은 스크롤 없이 에디터만 보이는 화면으로 바뀌었습니다.',
      en: 'Lots of small fixes for everyday writing. Drafts now survive a refresh, and the home page is the editor alone, with no scrolling.',
    },
    changes: [
      c('new',
        '새 초안 탭의 이름이 본문의 첫 제목으로 표시됩니다.',
        'New draft tabs are named after the document\'s first heading.'),
      c('new',
        '빈 에디터에 입력 안내 문구가 표시되고, 에디터 화면의 버튼·메뉴가 페이지 언어(한국어/영어)에 맞게 나옵니다.',
        'An empty editor shows a hint, and the editor\'s buttons and menus follow the page language (Korean/English).'),
      c('improved',
        '홈을 스크롤 없이 에디터만 보이는 화면으로 바꾸고, 문서 사이드바에서 다른 도구와 안내 페이지로 갈 수 있게 했습니다.',
        'The home page is now just the editor, and the document sidebar links to the other tools and guides.'),
      c('improved',
        '헤더 버튼의 배치를 자주 쓰는 순서로 정리하고, 아이콘을 통일했습니다.',
        'Header buttons are ordered by how often they\'re used, with consistent icons.'),
      c('fixed',
        '새로고침하면 저장하지 않은 초안이 사라지던 문제를 고쳤습니다.',
        'Fixed unsaved drafts disappearing on refresh.'),
      c('fixed',
        '다크 모드에서 에디터의 마크다운 구문 강조가 잘 보이지 않던 문제와, 인쇄 머리글·바닥글 입력칸이 좁아 값이 잘리던 문제를 고쳤습니다.',
        'Fixed hard-to-read Markdown highlighting in the editor in dark mode, and print header/footer fields too narrow to show their values.'),
      c('fixed',
        '광고가 채워지지 않을 때 빈 띠가 남던 문제와, 사이드바 토글이 툴바를 가리던 문제를 고쳤습니다.',
        'Fixed an empty strip left where an ad didn\'t load, and the sidebar toggle covering the toolbar.'),
    ],
  },
  {
    date: '2026-09-20',
    title: {
      ko: '글자를 선택·검색할 수 있는 PDF',
      en: 'PDFs with real, selectable text',
    },
    summary: {
      ko: 'PDF를 화면을 찍은 이미지 대신 브라우저 인쇄로 만들도록 바꿨습니다. 이제 PDF 속 글자를 선택·복사·검색할 수 있고, 확대해도 선명합니다. 한글과 업로드한 폰트도 그대로 나옵니다.',
      en: 'PDFs are now made with the browser\'s own printing instead of a picture of the screen. Text in the PDF can be selected, copied and searched, stays sharp when zoomed, and keeps Korean and uploaded fonts.',
    },
    changes: [
      c('new',
        'PDF가 이미지가 아닌 실제 글자로 저장됩니다. 선택·복사·검색이 되고 파일도 가볍습니다.',
        'PDFs now contain real text — selectable, copyable, searchable, and smaller.'),
      c('improved',
        '인쇄·PDF 저장 버튼을 하나로 합쳤습니다. 브라우저 인쇄 창에서 프린터나 PDF 저장을 고르면 됩니다.',
        'Print and Save PDF are now one button; pick a printer or "Save as PDF" in the browser\'s print dialog.'),
      c('improved',
        '미리보기와 PDF가 같은 스타일을 쓰도록 통합해 화면과 출력물이 똑같이 나옵니다.',
        'The preview and the PDF now share one stylesheet, so what you see is what prints.'),
      c('fixed',
        '업로드한 폰트가 인쇄물에 적용되지 않던 문제와, 배경 없이 인쇄할 때 요소 스타일 레이아웃이 흐트러지던 문제를 고쳤습니다.',
        'Fixed uploaded fonts missing from printouts, and element layout breaking when printing without backgrounds.'),
    ],
  },
  {
    date: '2026-05-08',
    title: {
      ko: '인쇄와 PDF 저장 결과 일치',
      en: 'Print and PDF now match',
    },
    summary: {
      ko: '인쇄와 PDF 저장이 같은 결과를 내도록 맞추고, PDF에서 글자 위치가 어긋나던 문제들을 고쳤습니다.',
      en: 'Printing and saving as PDF now produce the same result, and text in PDFs sits where it should.',
    },
    changes: [
      c('improved',
        '인쇄 버튼이 PDF 저장과 같은 방식으로 출력해 두 결과가 같아졌습니다. PDF 저장 시 배경색 포함이 기본값이 되었습니다.',
        'Print now uses the same output as Save PDF, so both match. Backgrounds are included in PDFs by default.'),
      c('improved',
        '에디터에서 Tab 들여쓰기를 4칸으로 바꿔 미리보기의 목록 중첩과 맞췄습니다.',
        'Tab indents by 4 spaces in the editor, matching nested lists in the preview.'),
      c('fixed',
        'PDF에서 표·체크리스트 글자가 아래로 치우치던 문제와 첫 요소 위에 불필요한 여백이 생기던 문제를 고쳤습니다.',
        'Fixed table and checklist text sitting too low in PDFs, and extra space above the first element.'),
    ],
  },
  {
    date: '2026-04-16',
    title: {
      ko: 'PDF 출력 품질 개선, 미리보기에서 체크박스 클릭',
      en: 'Better PDF output, and clickable checkboxes in the preview',
    },
    summary: {
      ko: 'PDF와 인쇄 결과를 손봤습니다. 프리셋 테마가 출력물에 그대로 반영되고, 한글 머리글·바닥글과 페이지 나눔이 깔끔해졌습니다. 미리보기에서 체크박스를 눌러 할 일을 체크할 수 있습니다.',
      en: 'A round of PDF and print fixes: theme presets carry into the output, and Korean headers/footers and page breaks come out clean. You can also tick checkboxes right in the preview.',
    },
    changes: [
      c('new',
        '미리보기에서 체크박스를 클릭하면 원본 마크다운의 [ ]와 [x]가 바뀝니다. 목록 밖에 쓴 [ ]·[x]도 체크박스로 표시됩니다.',
        'Click a checkbox in the preview to toggle [ ] / [x] in the Markdown. [ ] and [x] outside lists also render as checkboxes.'),
      c('new',
        "PDF 파일 이름이 '문서 제목-날짜.pdf' 형식으로 저장됩니다.",
        "PDFs are saved as 'title-date.pdf'."),
      c('fixed',
        'PDF 다운로드와 인쇄에 프리셋 테마 스타일이 반영되지 않던 문제를 고쳤습니다.',
        'Fixed theme preset styles not applying to PDF downloads and printing.'),
      c('fixed',
        'PDF 머리글·바닥글의 한글이 깨지던 문제, 페이지가 나뉠 때 표 머리행이나 제목만 따로 떨어지던 문제를 고치고 PDF 용량을 크게 줄였습니다.',
        'Fixed garbled Korean in PDF headers/footers and table headers or headings stranded at page breaks, and made PDFs much smaller.'),
      c('fixed',
        '브라우저로 인쇄할 때 미리보기 창 UI가 함께 인쇄되던 문제와, 파일 드래그 표시가 창 밖으로 나가도 사라지지 않던 문제를 고쳤습니다.',
        'Fixed the print preview window\'s UI being printed along with the document, and the drag-and-drop overlay staying up after leaving the window.'),
    ],
  },
  {
    date: '2026-03-27',
    title: {
      ko: '프리셋 15종, 슬라이드 모드, 스타일·문서 공유 링크',
      en: '15 presets, slide mode, and share links for styles and documents',
    },
    summary: {
      ko: '테마 프리셋을 15가지로 늘리고 표·제목·이미지·코드블럭까지 세밀하게 꾸밀 수 있게 했습니다. --- 로 나눈 문서를 슬라이드로 보여주고, 스타일이나 문서를 링크 하나로 공유할 수 있습니다.',
      en: 'Theme presets grow to 15, with fine control over tables, headings, images and code blocks. Show a document split by --- as slides, and share a style or a whole document with one link.',
    },
    changes: [
      c('new',
        '테마 프리셋 10종 추가: 세피아, 오션, 포레스트, 선셋, 뉴스페이퍼, 아카데믹, 노트북, 터미널, 엘레강트, 파스텔. 프리셋마다 제목·굵은 글씨·표 색이 다릅니다.',
        '10 new theme presets — Sepia, Ocean, Forest, Sunset, Newspaper, Academic, Notebook, Terminal, Elegant and Pastel — each with its own heading, bold and table colours.'),
      c('new',
        '슬라이드 모드: --- 로 나눈 문서를 한 장씩 프레젠테이션처럼 보여줍니다. 키보드로 넘길 수 있습니다.',
        'Slide mode: present a document split by --- one slide at a time, using the keyboard to move.'),
      c('new',
        '공유 링크: 지금 스타일을 링크로 공유하거나, 문서 전체를 압축한 링크로 공유할 수 있습니다.',
        'Share links: share your current style as a link, or a whole document as a compressed link.'),
      c('new',
        '스타일 편집 확대: 제목 밑줄, 이미지, 코드블럭, 표(머리행·셀·줄무늬 행)를 스타일 패널에서 꾸밀 수 있습니다.',
        'More to style: heading underlines, images, code blocks and tables (header, cells, striped rows) in the style panel.'),
      c('new',
        '마크다운 치트시트 페이지를 추가했습니다. 문법을 보면서 바로 따라 쓸 수 있습니다.',
        'Added an interactive Markdown cheatsheet page.'),
      c('new',
        '크롬 확장 프로그램이 GitLab, Bitbucket, npm, PyPI, Notion도 지원하고, 한국어/영어로 표시됩니다.',
        'The Chrome extension now supports GitLab, Bitbucket, npm, PyPI and Notion, in Korean and English.'),
      c('improved',
        '색 선택기를 새로 만들어 색상 역할과 내가 만든 색을 바로 고를 수 있습니다. 스타일 패널 문구를 한국어/영어로 통일했습니다.',
        'A new colour picker with colour roles and your own colours one click away, and style panel text in a single language.'),
      c('improved',
        '모바일에서는 스타일 패널이 전체 화면으로 열리고, 저장·불러오기 창도 모바일에 맞게 바뀌었습니다. 오프라인일 때 보이는 화면도 다듬었습니다.',
        'On mobile the style panel opens full screen and the save/load dialogs fit the screen. The offline screen is clearer too.'),
    ],
  },
  {
    date: '2026-03-20',
    title: {
      ko: '요소별 스타일 편집기, 내 프리셋, 문서 사이드바와 탭',
      en: 'Per-element style editor, custom presets, document sidebar and tabs',
    },
    summary: {
      ko: '스타일을 요소별로 세밀하게 편집하고 나만의 프리셋으로 저장할 수 있게 됐습니다. 왼쪽 문서 사이드바에서 폴더로 문서를 정리하고, 여러 문서를 탭으로 열어 오갈 수 있습니다.',
      en: 'Style each element in detail and save the result as your own preset. Organise documents in folders in the new left sidebar, and keep several open in tabs.',
    },
    changes: [
      c('new',
        '요소별 스타일 편집기: 제목, 본문, 목록, 인용문 등 요소마다 글꼴·크기·색·여백을 바꿀 수 있습니다. 여백을 고칠 때 미리보기에 영역이 표시됩니다.',
        'Per-element style editor: set font, size, colour and spacing for headings, paragraphs, lists, quotes and more, with the spacing highlighted in the preview as you edit.'),
      c('new',
        '내 프리셋: 지금 스타일을 저장·불러오기·삭제하고, JSON 파일로 내보내거나 가져올 수 있습니다. 스타일 변경은 실행 취소·다시 실행이 됩니다.',
        'Custom presets: save, load and delete your styles, and export or import them as JSON. Style changes support undo and redo.'),
      c('new',
        '커스텀 폰트를 올려 쓸 수 있고, 색상 탭에서 색상 역할별 팔레트를 고를 수 있습니다. 프리셋 갤러리 페이지도 추가했습니다.',
        'Upload your own fonts, pick palettes by colour role in the Color tab, and browse the new preset gallery page.'),
      c('new',
        '문서 사이드바: 저장한 문서를 폴더 트리로 보고, 이름 바꾸기·드래그 이동·폴더 만들기를 할 수 있습니다.',
        'Document sidebar: see saved documents as a folder tree, and rename, drag to move, or create folders.'),
      c('new',
        '탭: 여러 문서를 탭으로 열어 일반 에디터처럼 오갈 수 있습니다.',
        'Tabs: open several documents in tabs and switch between them like any editor.'),
      c('new',
        '할 일 목록(- [ ] / - [x])이 체크박스로 표시됩니다.',
        'Task lists (- [ ] / - [x]) render as checkboxes.'),
      c('improved',
        '스타일 설정을 대화상자 대신 옆에 붙는 패널로 바꿔, 미리보기를 보면서 편집할 수 있습니다.',
        'Style settings moved from a dialog into a side panel, so you can edit while watching the preview.'),
      c('fixed',
        '페이지 글꼴과 업로드한 폰트가 새로고침 후 사라지던 문제를 고쳤습니다.',
        'Fixed the page font and uploaded fonts being lost after a refresh.'),
    ],
  },
  {
    date: '2026-03-13',
    title: {
      ko: '모바일 화면, 한글 서식·PDF 수정, 크롬 확장 개선',
      en: 'Mobile layout, Korean formatting and PDF fixes, a better Chrome extension',
    },
    summary: {
      ko: '휴대폰에서도 쓸 수 있도록 화면을 고치고, 한글 문서에서 자주 겪던 서식 문제와 PDF 문제를 해결했습니다. 크롬 확장 프로그램은 Gist와 이슈·PR 본문까지 열 수 있게 됐습니다.',
      en: 'The layout now works on phones, and common formatting and PDF problems with Korean text are fixed. The Chrome extension can also open Gists and issue/PR descriptions.',
    },
    changes: [
      c('new',
        '크롬 확장 프로그램: GitHub Gist와 이슈·PR 본문을 printmd로 열 수 있고, 단축키(Ctrl+Shift+P)와 최근 파일 삭제를 지원합니다.',
        'Chrome extension: open GitHub Gists and issue/PR descriptions in printmd, with a keyboard shortcut (Ctrl+Shift+P) and clearing of recent files.'),
      c('new',
        '블로그와 소개 페이지를 추가했습니다.',
        'Added the blog and about pages.'),
      c('improved',
        '작성 중인 문서가 브라우저에 자동으로 저장됩니다.',
        'Documents you\'re writing are saved in your browser automatically.'),
      c('fixed',
        '한글 바로 옆에 쓴 **굵게**·*기울임*이 적용되지 않던 문제를 고쳤습니다.',
        'Fixed **bold** and *italic* not working right next to Korean (CJK) characters.'),
      c('fixed',
        'PDF를 내려받을 때 빈 페이지가 생기던 문제와, 에디터·미리보기 스크롤이 하나로 묶여 움직이던 문제를 고쳤습니다.',
        'Fixed blank pages in downloaded PDFs, and the editor and preview scrolling as one.'),
      c('fixed',
        '모바일에서 화면이 깨지던 문제, 미리보기의 목록 기호와 코드블럭 배경이 사라지던 문제를 고쳤습니다.',
        'Fixed the broken mobile layout, and missing list bullets and code block backgrounds in the preview.'),
    ],
  },
  {
    date: '2026-03-03',
    title: {
      ko: '문서 저장·폴더 정리, 여러 쪽 인쇄 미리보기',
      en: 'Save documents in folders, and a multi-page print preview',
    },
    summary: {
      ko: '쓴 문서를 폴더로 정리해 저장하고 다시 불러올 수 있습니다. 인쇄 미리보기는 실제 용지처럼 쪽을 나눠 보여줍니다.',
      en: 'Save your documents into folders and open them again later. The print preview now splits pages just like real paper.',
    },
    changes: [
      c('new',
        '문서 저장·불러오기: 브라우저에 문서를 폴더 구조로 저장합니다.',
        'Save and open documents, organised in folders in your browser.'),
      c('new',
        '인쇄 미리보기에서 여러 쪽이 실제 용지 크기로 나뉘어 보입니다.',
        'The print preview shows multiple pages at real paper size.'),
      c('improved',
        'README의 배지 이미지가 미리보기에서 한 줄로 나란히 표시됩니다.',
        'README badge images line up side by side in the preview.'),
      c('fixed',
        '크롬 확장 프로그램이 GitHub 저장소 첫 화면의 README를 찾지 못하던 문제를 고쳤습니다.',
        'Fixed the Chrome extension not finding the README on a repository\'s main page.'),
    ],
  },
  {
    date: '2026-03-01',
    title: {
      ko: 'printmd 공개',
      en: 'printmd launches',
    },
    summary: {
      ko: '마크다운을 쓰고 원하는 스타일로 꾸며 PDF로 저장하는 무료 웹 도구 printmd를 공개했습니다. 회원가입이나 설치 없이 브라우저에서 바로 쓸 수 있습니다.',
      en: 'printmd is out: a free web tool to write Markdown, style it the way you like, and save it as a PDF — no sign-up, no install.',
    },
    changes: [
      c('new',
        '실시간 미리보기가 있는 마크다운 에디터, 테마 프리셋, 인쇄 미리보기와 PDF 다운로드.',
        'A Markdown editor with live preview, theme presets, print preview and PDF download.'),
      c('new',
        '마크다운 파일을 끌어다 놓아 열기, 저장·내려받기.',
        'Drag and drop Markdown files to open them; save and download.'),
      c('new',
        'GitHub의 README와 마크다운 파일을 바로 printmd로 여는 크롬 확장 프로그램.',
        'A Chrome extension that opens GitHub READMEs and Markdown files in printmd.'),
      c('new',
        '한국어와 영어 지원.',
        'Korean and English.'),
    ],
  },
];

/** Shorthand for one change line. */
function c(kind: ChangeKind, ko: string, en: string): ChangelogEntry['changes'][number] {
  return { kind, text: { ko, en } };
}

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
