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

/**
 * Locales with their own captures. Chinese and Japanese pages show the English
 * screenshots rather than a second set of captures per release.
 */
export type CaptureLocale = 'en' | 'ko';

export function captureLocale(locale: Locale): CaptureLocale {
  return locale === 'ko' ? 'ko' : 'en';
}

export interface ChangelogImage {
  /** File is public/changelog/<date>/<captureLocale>-<name>.png (scripts/capture-changelog.mjs). */
  name: string;
  /** Pixel size per locale; the captures differ where text wraps differently. */
  size: Record<CaptureLocale, [width: number, height: number]>;
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
  return `/changelog/${entry.date}/${captureLocale(locale)}-${image.name}.png`;
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    date: '2026-11-27',
    title: {
      ko: '폴더 드래그 앤 드롭, 에디터 선택 영역 표시 수정',
      en: 'Drag and drop folders, and a fix for selected text in the editor',
      zh: '拖放文件夹导入，修复编辑器选区显示',
      ja: 'フォルダーのドラッグ＆ドロップ、エディターの選択範囲の表示を修正',
    },
    summary: {
      ko: '마크다운 문서가 든 폴더를 화면에 끌어다 놓으면 폴더 구조 그대로 문서 사이드바에 추가됩니다. 여러 문서를 한 번에 옮겨 오고 싶을 때 편리합니다. 에디터에서 커서가 있는 줄의 선택 영역이 보이지 않던 문제도 고쳤습니다.',
      en: 'Drop a folder of Markdown files onto the page and it is added to the document sidebar with the same folder structure, which makes bringing in many documents at once easy. Selected text on the cursor line in the editor is also visible again.',
      zh: '把装有 Markdown 文件的文件夹拖到页面上，就会按原有的文件夹结构添加到文档侧边栏，方便一次导入多篇文档。同时修复了编辑器中光标所在行的选区看不见的问题。',
      ja: 'Markdown ファイルが入ったフォルダーをページにドラッグ＆ドロップすると、フォルダー構成のまま文書サイドバーに追加されます。たくさんの文書をまとめて取り込みたいときに便利です。エディターでカーソルのある行の選択範囲が見えなかった問題も修正しました。',
    },
    changes: [
      c(
        'new',
        '폴더 드래그 앤 드롭: 폴더를 화면에 끌어다 놓으면 폴더 구조 그대로 문서 사이드바에 추가됩니다. 마크다운·한글 파일만 문서로 추가되고, 문서가 없는 폴더는 건너뜁니다.',
        'Folder drag and drop: drop a folder onto the page to add it to the document sidebar with the same structure. Only Markdown and Hangul files become documents, and folders with no documents are skipped.',
        '拖放文件夹：把文件夹拖到页面上，即可按相同结构添加到文档侧边栏。只有 Markdown 和韩文（HWP）文件会添加为文档，没有文档的文件夹会被跳过。',
        'フォルダーのドラッグ＆ドロップ：フォルダーをページにドロップすると、同じ構成のまま文書サイドバーに追加されます。文書として追加されるのは Markdown とハングル（HWP）ファイルだけで、文書のないフォルダーはスキップされます。',
      ),
      c(
        'fixed',
        '에디터에서 커서가 있는 줄의 텍스트를 선택하면 회색 배경에 가려 무엇을 선택했는지 보이지 않던 문제를 고쳤습니다.',
        'Fixed text selected on the cursor line in the editor being hidden by the gray line highlight.',
        '修复了在编辑器中选中光标所在行的文本时，被灰色背景遮住、看不出选中了什么的问题。',
        'エディターでカーソルのある行のテキストを選択すると、灰色の背景に隠れて何を選択したか見えなかった問題を修正しました。',
      ),
    ],
  },
  {
    date: '2026-11-24',
    title: {
      ko: '중국어·일본어 버전, 언어 선택',
      en: 'Chinese and Japanese versions, and a language picker',
      zh: '中文版与日文版上线，新增语言切换',
      ja: '中国語版・日本語版、言語の切り替え',
    },
    summary: {
      ko: 'printmd를 이제 중국어(간체)와 일본어로도 쓸 수 있습니다. 에디터와 가이드, 업데이트 내역, 의견 보내기 페이지까지 고른 언어로 보입니다. 사이트 아래쪽이나 에디터 사이드바에서 언어를 바꾸면 다음에 들어올 때도 그 언어로 열립니다.',
      en: 'printmd now comes in Simplified Chinese and Japanese. The editor, the guides, the updates page and the feedback page all appear in the language you pick. Change the language at the bottom of the site or in the editor sidebar, and printmd opens in that language next time too.',
      zh: 'printmd 现已支持简体中文和日文。编辑器、指南、更新日志和反馈页面都会以你选择的语言显示。在网站底部或编辑器侧边栏切换语言后，下次打开时也会使用该语言。',
      ja: 'printmd が簡体字中国語と日本語でも使えるようになりました。エディター、ガイド、アップデート履歴、フィードバックページまで、選んだ言語で表示されます。サイトの下部やエディターのサイドバーで言語を切り替えると、次に開いたときもその言語で表示されます。',
    },
    changes: [
      c(
        'new',
        '중국어(간체)·일본어 버전: 에디터, 마크다운 가이드, 테마 안내, 업데이트 내역, 의견 보내기 페이지가 각 언어로 보입니다. 중국어 번체를 쓰는 브라우저도 중국어 버전으로 열립니다.',
        'Chinese (Simplified) and Japanese versions: the editor, the Markdown guide, the theme pages, the updates page and the feedback page all appear in each language. Browsers set to Traditional Chinese open the Chinese version.',
        '简体中文与日文版：编辑器、Markdown 指南、主题介绍、更新日志和反馈页面都以对应语言显示。浏览器语言为繁体中文时也会打开中文版。',
        '中国語（簡体字）版・日本語版：エディター、Markdown ガイド、テーマの案内、アップデート履歴、フィードバックページがそれぞれの言語で表示されます。ブラウザーが繁体字中国語の場合も中国語版が開きます。',
      ),
      c(
        'new',
        '언어 선택: 사이트 아래쪽과 에디터 사이드바에서 언어를 바꿀 수 있습니다. 보던 페이지 그대로 언어만 바뀌고, 고른 언어는 다음 방문 때도 유지됩니다.',
        'Language picker: switch languages at the bottom of the site or in the editor sidebar. You stay on the same page, and your choice is remembered for your next visit.',
        '语言切换：可以在网站底部和编辑器侧边栏切换语言。切换后仍停留在当前页面，所选语言下次访问时也会保留。',
        '言語の切り替え：サイトの下部とエディターのサイドバーで言語を切り替えられます。見ていたページのまま言語だけが変わり、選んだ言語は次に訪れたときも保持されます。',
      ),
      c(
        'fixed',
        '영어 사이트에서 마크다운 가이드와 GitHub README 페이지가 한국어로 보이던 문제를 고쳤습니다.',
        'Fixed the Markdown guide and the GitHub README page showing Korean on the English site.',
        '修复了英文网站上 Markdown 指南和 GitHub README 页面显示为韩文的问题。',
        '英語サイトで Markdown ガイドと GitHub README のページが韓国語で表示されていた問題を修正しました。',
      ),
      c(
        'fixed',
        '블로그 글 목록의 읽기 시간이 모든 언어에서 영어로 보이던 문제를 고쳤습니다.',
        'Fixed the reading time on the blog post list showing in English in every language.',
        '修复了博客文章列表中的阅读时间在所有语言下都显示为英文的问题。',
        'ブログ記事一覧の読了時間が、どの言語でも英語で表示されていた問題を修正しました。',
      ),
    ],
  },
  {
    date: '2026-11-23',
    title: {
      ko: '미리보기 목차, 블로그 글 따라오는 목차, 의견 보내기 페이지',
      en: 'A preview outline, a table of contents that follows you on the blog, and a feedback page',
      zh: "预览目录、跟随滚动的博客目录，以及反馈页面",
      ja: "プレビューの目次、ブログ記事についてくる目次、フィードバックページ",
    },
    summary: {
      ko: '긴 마크다운 문서를 미리보기에서 훑어볼 때 지금 어디를 읽고 있는지 바로 알 수 있도록 목차를 추가했습니다. 제목이 많은 보고서, 매뉴얼, README를 다듬을 때 목차에서 원하는 부분으로 바로 이동해 보세요. 블로그 글도 넓은 화면에서 오른쪽 목차가 스크롤을 따라옵니다. 의견은 이제 메일 앱 없이 의견 보내기 페이지에서 바로 보낼 수 있습니다.',
      en: 'The preview now has an outline, so you always know where you are in a long Markdown document. When polishing a report, manual or README with many headings, jump straight to any section from the outline. Blog posts on wide screens also get a table of contents that stays beside you as you scroll. And you can now send feedback straight from the feedback page, no mail app needed.',
      zh: "预览新增了目录，在 Markdown 长文档中浏览时，随时知道自己读到了哪里。打磨标题众多的报告、手册或 README 时，可以从目录直接跳到想看的部分。在宽屏上阅读博客文章时，右侧的目录也会跟着滚动。现在还可以直接在反馈页面发送意见，不必打开邮件应用。",
      ja: "長い Markdown 文書をプレビューで読むとき、いまどこを読んでいるかすぐわかるよう目次を追加しました。見出しの多い報告書、マニュアル、README を仕上げるときは、目次から読みたい箇所へすぐ移動できます。ブログ記事も広い画面では右側の目次がスクロールについてきます。フィードバックも、メールアプリを開かずにフィードバックページから直接送れるようになりました。",
    },
    images: [
      {
        name: 'preview-outline',
        size: { ko: [2968, 1076], en: [2968, 1076] },
        alt: {
          ko: '분기 운영 보고서 미리보기 오른쪽 위에 목차 카드가 떠 있고, 지금 보고 있는 "성능" 제목이 파란색으로 표시된 화면. 위쪽 도구 막대에 인쇄 폭과 목차 버튼이 보입니다.',
          en: 'A quarterly operations report in the preview with the outline card floating at the top right, the current "Performance" heading highlighted in blue, and the Print width and Outline buttons in the toolbar above',
          zh: "季度运营报告的预览右上角浮着目录卡片，当前正在看的“性能”标题以蓝色标出，上方工具栏中可以看到“打印宽度”和“目录”按钮",
          ja: "四半期の運用報告書のプレビュー右上に目次カードが浮かび、いま見ている「パフォーマンス」の見出しが青く表示された画面。上のツールバーに「印刷幅」と「目次」ボタンが見えます",
        },
        caption: {
          ko: '목차 버튼을 누르면 미리보기 위에 목차 카드가 뜨고, 지금 보고 있는 제목이 표시됩니다. 카드는 드래그로 옮기거나 접어 둘 수 있습니다.',
          en: 'Press Outline to float the outline over the preview, with the heading you\'re on marked. Drag the card anywhere, or fold it away.',
          zh: "点击“目录”按钮，目录卡片会浮在预览上方，并标出当前正在看的标题。卡片可以拖动到任意位置，也可以收起。",
          ja: "「目次」ボタンを押すとプレビューの上に目次カードが表示され、いま見ている見出しに印が付きます。カードはドラッグで移動したり、たたんだりできます。",
        },
      },
      {
        name: 'blog-toc',
        size: { ko: [2256, 1280], en: [2256, 1280] },
        alt: {
          ko: '블로그 글 오른쪽에 목차가 고정되어 있고, 지금 읽고 있는 섹션이 파란 선과 진한 글씨로 표시된 화면',
          en: 'A blog post with the table of contents fixed on the right, the section being read marked with a blue line and darker text',
          zh: "博客文章右侧固定着目录，正在阅读的章节以蓝色竖线和深色文字标出",
          ja: "ブログ記事の右側に目次が固定され、いま読んでいるセクションが青い線と濃い文字で示された画面",
        },
        caption: {
          ko: '블로그 글에서는 오른쪽 목차가 스크롤을 따라옵니다.',
          en: 'On the blog, the table of contents on the right follows you as you scroll.',
          zh: "在博客中，右侧的目录会跟随你的滚动。",
          ja: "ブログでは、右側の目次がスクロールについてきます。",
        },
      },
    ],
    changes: [
      {
        kind: 'new',
        text: {
          ko: '미리보기 목차: 인쇄 폭 옆의 목차 버튼으로 켜고 끕니다. 문서의 제목(#, ##, ###)을 보여주고, 지금 보고 있는 제목을 표시하며, 누르면 그 제목으로 이동합니다. 켜고 끈 상태는 다음에도 유지됩니다.',
          en: 'Preview outline: turn it on or off with the Outline button next to Print width. It lists the document\'s headings (#, ##, ###), marks the one you\'re looking at, and jumps to a heading when you click it. Your on/off choice is remembered.',
          zh: "预览目录：用“打印宽度”旁边的“目录”按钮打开或关闭。它会列出文档中的标题（#、##、###），标出你正在看的标题，点击即可跳到该标题。开关状态会被记住。",
          ja: "プレビューの目次：「印刷幅」の隣にある「目次」ボタンでオン・オフします。文書の見出し（#、##、###）を一覧にし、いま見ている見出しに印を付け、クリックするとその見出しへ移動します。オン・オフの状態は次回も保持されます。",
        },
      },
      {
        kind: 'new',
        text: {
          ko: '의견 보내기 페이지: 메일 앱을 열지 않아도 이름(선택)과 내용만 적어 바로 보낼 수 있습니다. 사이드바와 홈의 의견 보내기 버튼이 이 페이지로 연결됩니다.',
          en: 'Feedback page: send feedback right from printmd — just your name (optional) and a message, no mail app needed. The Send feedback buttons in the sidebar and on the home page now open it.',
          zh: "反馈页面：不用打开邮件应用，只需填写名字（可选）和内容就能直接发送。侧边栏和首页的“发送反馈”按钮现在会打开这个页面。",
          ja: "フィードバックページ：メールアプリを開かなくても、お名前（任意）と内容を書くだけで直接送れます。サイドバーとホームの「フィードバックを送る」ボタンからこのページが開きます。",
        },
      },
      {
        kind: 'improved',
        text: {
          ko: '블로그 글을 넓은 화면에서 보면 오른쪽 목차가 스크롤을 따라오고, 지금 읽고 있는 부분이 표시됩니다.',
          en: 'On wide screens, blog posts show a table of contents on the right that follows you down the page and marks the section you\'re reading.',
          zh: "在宽屏上阅读博客文章时，右侧会显示随页面滚动的目录，并标出你正在阅读的章节。",
          ja: "広い画面でブログ記事を読むと、右側の目次がページのスクロールについてきて、いま読んでいる箇所を示します。",
        },
      },
    ],
  },
  {
    date: '2026-11-20',
    title: {
      ko: '코드블럭 문법 강조·코드 테마, 프롬프트 문서를 위한 문서 정보 카드',
      en: 'Syntax highlighting, code themes, and a front matter card for prompt files',
      zh: "代码块语法高亮与代码主题，以及为提示词文件准备的文档信息卡片",
      ja: "コードブロックのシンタックスハイライトとコードテーマ、プロンプト文書のための文書情報カード",
    },
    summary: {
      ko: '코드와 프롬프트 문서를 더 보기 좋게 쓰고 출력할 수 있도록 코드블럭과 YAML 프론트매터 표시를 크게 개선했습니다. 메타 프롬프트나 스킬 파일(SKILL.md)처럼 맨 앞에 name, description 같은 메타데이터가 붙은 프롬프트 문서도 이제 깔끔한 문서 정보 카드로 보이고, 그대로 PDF로 저장할 수 있습니다. 프롬프트를 마크다운으로 관리하는 프롬프터라면 프롬프트 모음을 문서로 정리할 때 써 보세요.',
      en: 'Code blocks and YAML front matter got a big upgrade, so code and prompt documents read and print better. Prompt files that start with metadata such as name and description — meta prompts, skill files (SKILL.md) and the like — now show that metadata as a tidy document info card, and save to PDF just as they look. If you keep your prompts in Markdown, this makes a prompt library easy to turn into a readable document.',
      zh: "我们大幅改进了代码块和 YAML front matter 的显示，让代码和提示词文档写起来、打印出来都更好看。像元提示词（meta prompt）或技能文件（SKILL.md）这样开头带有 name、description 等元数据的提示词文档，现在会显示为整洁的文档信息卡片，并能原样保存为 PDF。如果你用 Markdown 管理提示词，整理提示词合集时不妨试试。",
      ja: "コードとプロンプト文書をもっと見やすく書いて出力できるよう、コードブロックと YAML フロントマターの表示を大きく改善しました。メタプロンプトやスキルファイル（SKILL.md）のように、先頭に name や description などのメタデータが付いたプロンプト文書も、すっきりした文書情報カードとして表示され、そのまま PDF に保存できます。Markdown でプロンプトを管理しているなら、プロンプト集を文書にまとめるときにぜひ使ってみてください。",
    },
    images: [
      {
        name: 'code-and-frontmatter',
        size: { ko: [1536, 894], en: [1536, 936] },
        alt: {
          ko: '메타 프롬프트 문서의 프론트매터가 name, description, tags, version 카드로 표시되고, 아래 TypeScript 코드블럭에 문법 강조와 언어·테마·복사 툴바가 보이는 미리보기',
          en: 'Preview of a meta prompt file: its front matter shown as a name, description, tags and version card, and a TypeScript code block with syntax highlighting and the language, theme and copy toolbar',
          zh: "元提示词文件的预览：front matter 显示为包含 name、description、tags、version 的卡片，下方的 TypeScript 代码块带有语法高亮以及语言、主题和复制工具栏",
          ja: "メタプロンプト文書のプレビュー。フロントマターが name、description、tags、version のカードで表示され、その下の TypeScript のコードブロックにシンタックスハイライトと、言語・テーマ・コピーのツールバーが見えます",
        },
        caption: {
          ko: '프론트매터는 문서 정보 카드로, 코드블럭은 언어에 맞는 색으로 표시됩니다. 코드블럭에 마우스를 올리면 툴바가 나타납니다.',
          en: 'Front matter becomes a document info card and code is coloured for its language. Hover a code block to bring up its toolbar.',
          zh: "front matter 会变成文档信息卡片，代码按其语言着色。把鼠标移到代码块上即可显示工具栏。",
          ja: "フロントマターは文書情報カードに、コードは言語に合った色で表示されます。コードブロックにマウスを重ねるとツールバーが現れます。",
        },
      },
      {
        name: 'code-theme',
        size: { ko: [1536, 414], en: [1536, 414] },
        alt: {
          ko: '코드블럭 툴바에서 Dracula 테마를 선택해 어두운 배경에 색이 입혀진 TypeScript 코드',
          en: 'TypeScript code in the Dracula theme, chosen from the code block toolbar',
          zh: "在代码块工具栏中选择 Dracula 主题后，深色背景上着色的 TypeScript 代码",
          ja: "コードブロックのツールバーで Dracula テーマを選び、暗い背景に色が付いた TypeScript のコード",
        },
        caption: {
          ko: '툴바에서 테마를 고르면 바로 바뀝니다. (Dracula)',
          en: 'Pick a theme from the toolbar and it applies at once. (Dracula)',
          zh: "在工具栏中选择主题，立即生效。（Dracula）",
          ja: "ツールバーでテーマを選ぶと、すぐに切り替わります。（Dracula）",
        },
      },
      {
        name: 'style-panel',
        size: { ko: [2488, 2034], en: [2488, 2034] },
        alt: {
          ko: '스타일 설정 패널에서 문서 정보를 선택해 키와 값 묶음이 각각 색상·폰트·글자 크기·굵기 칸을 가진 카드로 나뉜 모습',
          en: 'The style panel with Front Matter selected: Keys and Values are separate cards, each with colour, font, size and weight',
          zh: "在样式面板中选中 Front Matter：键和值各自是一张卡片，分别有颜色、字体、字号和字重设置",
          ja: "スタイルパネルでフロントマターを選ぶと、キーと値がそれぞれ色・フォント・文字サイズ・太さの欄を持つカードに分かれて表示されます",
        },
        caption: {
          ko: '스타일 패널에서 키와 값을 따로 꾸밀 수 있고, 설정 묶음이 카드로 구분됩니다.',
          en: 'Style keys and values separately in the style panel, where each group of settings is its own card.',
          zh: "在样式面板中可以分别设置键和值的样式，每组设置各自是一张卡片。",
          ja: "スタイルパネルでキーと値を別々に整えられ、設定のまとまりがカードで区切られています。",
        },
      },
    ],
    changes: [
      {
        kind: 'new',
        text: {
          ko: '코드블럭 문법 강조: ```ts 처럼 언어를 적으면 언어에 맞는 색이 입혀집니다. TypeScript, Python, Go, Rust, Kotlin, Swift, C/C++, C#, PHP, Ruby, SQL 등 24개 언어를 지원합니다.',
          en: 'Syntax highlighting: write a language after the fence (```ts) and the code is coloured for it. 24 languages including TypeScript, Python, Go, Rust, Kotlin, Swift, C/C++, C#, PHP, Ruby and SQL.',
          zh: "代码块语法高亮：在代码围栏后写上语言（如 ```ts），代码就会按该语言着色。支持 TypeScript、Python、Go、Rust、Kotlin、Swift、C/C++、C#、PHP、Ruby、SQL 等 24 种语言。",
          ja: "コードブロックのシンタックスハイライト：```ts のように言語を書くと、その言語に合った色が付きます。TypeScript、Python、Go、Rust、Kotlin、Swift、C/C++、C#、PHP、Ruby、SQL など 24 言語に対応しています。",
        },
      },
      {
        kind: 'new',
        text: {
          ko: '코드 테마: GitHub, One, Monokai, Dracula, Nord, Solarized 테마를 고를 수 있고, 미리보기·인쇄·PDF에 똑같이 적용됩니다. 기본값(자동)은 코드 배경 밝기에 맞춰 밝은/어두운 색을 고릅니다.',
          en: 'Code themes: choose GitHub, One, Monokai, Dracula, Nord or Solarized — the same in the preview, print and PDF. The default (Auto) picks light or dark colours to suit the code background.',
          zh: "代码主题：可以选择 GitHub、One、Monokai、Dracula、Nord 或 Solarized，在预览、打印和 PDF 中效果一致。默认（自动）会根据代码背景的明暗选择浅色或深色配色。",
          ja: "コードテーマ：GitHub、One、Monokai、Dracula、Nord、Solarized から選べ、プレビュー・印刷・PDF に同じように適用されます。デフォルト（自動）では、コード背景の明るさに合わせて明るい色・暗い色を選びます。",
        },
      },
      {
        kind: 'new',
        text: {
          ko: '코드블럭 툴바: 미리보기에서 코드블럭에 마우스를 올리면 언어와 테마를 바로 바꾸고 코드를 복사할 수 있습니다. 언어를 바꾸면 원본 마크다운도 함께 수정됩니다.',
          en: 'Code block toolbar: hover a code block in the preview to change its language or theme and copy the code. Changing the language updates the Markdown source too.',
          zh: "代码块工具栏：在预览中把鼠标移到代码块上，就能直接更改语言和主题、复制代码。更改语言时，Markdown 源码也会一起更新。",
          ja: "コードブロックのツールバー：プレビューでコードブロックにマウスを重ねると、言語やテーマをその場で変えたり、コードをコピーしたりできます。言語を変えると元の Markdown も一緒に書き換わります。",
        },
      },
      {
        kind: 'new',
        text: {
          ko: '문서 정보 카드: 문서 맨 앞의 YAML 프론트매터(--- 로 감싼 블록)를 키와 값으로 된 카드로 보여줍니다. 메타 프롬프트, 스킬 파일, 블로그 글 메타데이터 등에 쓰입니다.',
          en: 'Document info card: YAML front matter at the top of a file (the block between --- lines) is shown as a key/value card — handy for meta prompts, skill files and blog post metadata.',
          zh: "文档信息卡片：文档开头的 YAML front matter（用 --- 包起来的块）会显示为键值卡片，适用于元提示词、技能文件和博客文章的元数据等。",
          ja: "文書情報カード：文書の先頭にある YAML フロントマター（--- で囲まれたブロック）を、キーと値のカードとして表示します。メタプロンプト、スキルファイル、ブログ記事のメタデータなどに便利です。",
        },
      },
      {
        kind: 'new',
        text: {
          ko: '문서 정보 스타일: 스타일 패널에서 키와 값의 색상·서체·크기·굵기를 각각 바꾸고, 카드의 배경·여백·테두리도 설정할 수 있습니다.',
          en: 'Document info styling: in the style panel, set colour, font, size and weight separately for keys and values, plus the card\'s background, margin and border.',
          zh: "文档信息样式：在样式面板中可以分别设置键和值的颜色、字体、字号和字重，还能设置卡片的背景、边距和边框。",
          ja: "文書情報のスタイル：スタイルパネルで、キーと値の色・フォント・文字サイズ・太さを別々に変えられ、カードの背景・余白・枠線も設定できます。",
        },
      },
      {
        kind: 'improved',
        text: {
          ko: '코드블럭과 인라인 코드를 따로 꾸밀 수 있습니다. 기존에 저장한 스타일은 지금 모습 그대로 옮겨집니다.',
          en: 'Code blocks and inline code are now styled separately. Styles you saved earlier carry over unchanged.',
          zh: "代码块和行内代码现在可以分别设置样式。之前保存的样式会原样沿用。",
          ja: "コードブロックとインラインコードを別々にスタイル設定できるようになりました。以前に保存したスタイルは、いまの見た目のまま引き継がれます。",
        },
      },
      {
        kind: 'improved',
        text: {
          ko: '스타일 패널의 설정 묶음을 카드로 구분해 어떤 칸이 어느 묶음에 속하는지 한눈에 보입니다. 색상 칸에는 실제 화면에 보이는 기본 색이 표시됩니다.',
          en: 'Style panel groups are now separate cards, so it\'s clear which fields belong together. Colour fields show the default colour that is actually on screen.',
          zh: "样式面板中的每组设置现在各自是一张卡片，哪些选项属于同一组一目了然。颜色选项会显示屏幕上实际使用的默认颜色。",
          ja: "スタイルパネルの設定のまとまりをカードで区切り、どの欄がどのまとまりに属するか一目でわかるようにしました。色の欄には、実際に画面に表示されているデフォルトの色が表示されます。",
        },
      },
      {
        kind: 'improved',
        text: {
          ko: '스타일 패널을 열면 오른쪽 광고 영역을 숨겨 미리보기를 더 넓게 씁니다.',
          en: 'Opening the style panel hides the right-hand ad column, giving the preview more room.',
          zh: "打开样式面板时会隐藏右侧的广告栏，让预览有更多空间。",
          ja: "スタイルパネルを開くと右側の広告欄を隠し、プレビューを広く使えるようにしました。",
        },
      },
      {
        kind: 'fixed',
        text: {
          ko: '코드블럭의 여백·테두리가 줄마다 따로 그려지던 문제를 고쳤습니다.',
          en: 'Fixed code block margin and border being drawn on every line.',
          zh: "修复了代码块的边距和边框在每一行都单独绘制的问题。",
          ja: "コードブロックの余白と枠線が行ごとに描かれていた問題を修正しました。",
        },
      },
      {
        kind: 'fixed',
        text: {
          ko: '프론트매터의 닫는 --- 때문에 메타데이터 전체가 거대한 제목으로 보이던 문제를 고쳤습니다.',
          en: 'Fixed front matter turning into one giant heading because of its closing ---.',
          zh: "修复了 front matter 结尾的 --- 导致全部元数据显示成一个巨大标题的问题。",
          ja: "フロントマターの閉じる --- のせいで、メタデータ全体が巨大な見出しとして表示されていた問題を修正しました。",
        },
      },
      {
        kind: 'fixed',
        text: {
          ko: '요소 초기화 시 문서 정보의 키·값, 표의 헤더·셀 설정이 남던 문제와 요소 버튼을 고를 때 버튼 줄이 흔들리던 문제를 고쳤습니다.',
          en: 'Fixed element reset leaving front matter key/value and table header/cell styles behind, and the element buttons shifting when one was selected.',
          zh: "修复了重置元素时 front matter 键值样式和表格表头/单元格样式残留的问题，以及选择元素按钮时按钮行跳动的问题。",
          ja: "要素をリセットしてもフロントマターのキー・値、表の見出しセル・セルの設定が残っていた問題と、要素ボタンを選ぶとボタンの列がずれていた問題を修正しました。",
        },
      },
    ],
  },
  {
    date: '2026-11-06',
    title: {
      ko: '미리보기 폭 눈금자, 문서 사이드바 순서 변경과 의견 보내기',
      en: 'Preview width ruler, sidebar reordering and a feedback button',
      zh: "预览宽度标尺、侧边栏拖动排序和反馈按钮",
      ja: "プレビュー幅のルーラー、サイドバーの並べ替え、フィードバックボタン",
    },
    summary: {
      ko: '미리보기 폭을 눈금자로 바로 조절하고, 인쇄될 폭에 맞춰 줄바꿈을 미리 확인할 수 있습니다. 문서 사이드바에서는 드래그로 순서를 바꿀 수 있고, 의견을 바로 메일로 보낼 수 있습니다.',
      en: 'Resize the preview straight from a ruler and check line wrapping at the printed width. In the document sidebar you can drag to reorder, and send feedback by email in one click.',
      zh: "可以直接用标尺调整预览宽度，并按打印宽度提前确认换行位置。在文档侧边栏中可以拖动调整顺序，还能一键通过邮件发送反馈。",
      ja: "ルーラーでプレビューの幅をすぐ調整でき、印刷される幅に合わせて改行位置を事前に確認できます。文書サイドバーではドラッグで並べ替えができ、ワンクリックでメールからフィードバックを送れます。",
    },
    changes: [
      c('new',
        '미리보기 폭 눈금자: 미리보기 위 눈금자의 양 끝을 드래그해 폭을 바꿉니다. 더블클릭하면 전체 폭으로, 화살표 키로 50px씩 조절됩니다.',
        'Preview width ruler: drag either end of the ruler above the preview to resize it. Double-click for full width; arrow keys move it 50px at a time.',
        "预览宽度标尺：拖动预览上方标尺的任意一端即可调整宽度。双击恢复全宽，方向键每次调整 50px。",
        "プレビュー幅のルーラー：プレビュー上部のルーラーの両端をドラッグして幅を変えます。ダブルクリックで全幅に、矢印キーで 50px ずつ調整できます。"),
      c('new',
        "인쇄 폭 버튼: 현재 용지의 본문 폭에 맞춰, 인쇄될 때와 같은 위치에서 줄이 바뀌게 합니다.",
        'Print width button: matches the preview to the page body width, so lines wrap where they will when printed.',
        "“打印宽度”按钮：按当前纸张的正文宽度显示预览，换行位置与打印时一致。",
        "「印刷幅」ボタン：現在の用紙の本文幅に合わせ、印刷時と同じ位置で改行されるようにします。"),
      c('new',
        '문서 사이드바에서 문서와 폴더를 드래그해 순서를 바꿀 수 있고, 저장하지 않은 문서에는 점이 표시됩니다.',
        'Drag documents and folders in the sidebar to reorder them; unsaved documents show a dot.',
        "可以在侧边栏中拖动文档和文件夹调整顺序；未保存的文档会显示一个圆点。",
        "サイドバーで文書やフォルダをドラッグして並べ替えられます。保存していない文書には点が表示されます。"),
      c('new',
        '의견 보내기: 사이드바에서 바로 메일로 의견을 보낼 수 있습니다. 버그 확인에 필요한 환경 정보가 메일 본문에 미리 채워집니다.',
        'Send feedback: email us straight from the sidebar, with the environment details we need for bug reports filled in.',
        "发送反馈：可以直接从侧边栏发邮件给我们，排查问题所需的环境信息会预先填好。",
        "フィードバックを送る：サイドバーから直接メールで送れます。不具合の確認に必要な環境情報がメール本文にあらかじめ入ります。"),
      c('improved',
        '스타일 패널의 최대 너비를 2400px까지 늘릴 수 있습니다.',
        'The style panel\'s maximum width now goes up to 2400px.',
        "样式面板中的最大宽度现在最多可以设到 2400px。",
        "スタイルパネルの最大幅を 2400px まで広げられるようになりました。"),
    ],
  },
  {
    date: '2026-10-10',
    title: {
      ko: '한글(HWP·HWPX) 파일 열기, 서식을 살리는 붙여넣기',
      en: 'Open Hangul (HWP/HWPX) files, and paste with formatting kept',
      zh: "打开韩文（HWP/HWPX）文件，粘贴时保留格式",
      ja: "ハングル（HWP/HWPX）ファイルを開く、書式を保った貼り付け",
    },
    summary: {
      ko: '한글 문서를 브라우저에서 바로 열어 마크다운으로 바꿀 수 있습니다. 웹페이지나 ChatGPT·Claude·Gemini 답변을 복사해 붙여 넣으면 제목·목록·표·코드 블록 구조가 그대로 마크다운으로 들어옵니다.',
      en: 'Open Hangul documents right in the browser and turn them into Markdown. Copy from a web page or a ChatGPT, Claude or Gemini answer and paste — headings, lists, tables and code blocks come through as Markdown.',
      zh: "可以直接在浏览器中打开韩文文档并转换成 Markdown。从网页或 ChatGPT、Claude、Gemini 的回答复制后粘贴，标题、列表、表格和代码块都会以 Markdown 形式带过来。",
      ja: "ハングル文書をブラウザで直接開いて Markdown に変換できます。Web ページや ChatGPT・Claude・Gemini の回答をコピーして貼り付けると、見出し・リスト・表・コードブロックの構造がそのまま Markdown として入ります。",
    },
    changes: [
      c('new',
        'HWPX와 구형 HWP(5.0) 파일을 열면 브라우저 안에서 마크다운으로 변환합니다. 파일은 서버로 올라가지 않습니다.',
        'Opening an HWPX or older HWP (5.0) file converts it to Markdown inside your browser. The file never leaves your computer.',
        "打开 HWPX 或旧版 HWP（5.0）文件时，会在浏览器中把它转换成 Markdown。文件不会离开你的电脑。",
        "HWPX や旧形式の HWP（5.0）ファイルを開くと、ブラウザ内で Markdown に変換します。ファイルがサーバーにアップロードされることはありません。"),
      c('new',
        '서식을 살리는 붙여넣기: 웹페이지나 AI 답변을 붙여 넣으면 구조를 살려 마크다운으로 바꿉니다. 코드는 언어가 붙은 코드블럭으로, 수식은 LaTeX 원문으로 복원됩니다.',
        'Paste with formatting: pasting a web page or AI answer keeps its structure as Markdown. Code becomes fenced blocks with their language, and math is restored to its LaTeX source.',
        "保留格式的粘贴：粘贴网页或 AI 回答时，会保留其结构并转换成 Markdown。代码会变成带语言标注的代码块，公式会还原为 LaTeX 源码。",
        "書式を保った貼り付け：Web ページや AI の回答を貼り付けると、構造を保ったまま Markdown に変換します。コードは言語付きのコードブロックに、数式は LaTeX のソースに戻ります。"),
      c('new',
        'HWP 뷰어, HWP 마크다운 변환, ChatGPT 답변 PDF 저장 안내 페이지를 추가했습니다.',
        'Added guide pages for the HWP viewer, HWP to Markdown, and saving ChatGPT answers as PDF.',
        "新增了 HWP 查看器、HWP 转 Markdown，以及把 ChatGPT 回答保存为 PDF 的介绍页面。",
        "HWP ビューア、HWP を Markdown に変換、ChatGPT の回答を PDF に保存する方法の案内ページを追加しました。"),
      c('fixed',
        '크롬 확장 프로그램에서 npm·PyPI·Notion·이슈 페이지 열기가 동작하지 않던 문제를 고쳤습니다.',
        'Fixed the Chrome extension failing to open npm, PyPI, Notion and issue pages.',
        "修复了 Chrome 扩展无法打开 npm、PyPI、Notion 和 issue 页面的问题。",
        "Chrome 拡張機能で npm・PyPI・Notion・Issue のページを開けなかった問題を修正しました。"),
    ],
  },
  {
    date: '2026-09-30',
    title: {
      ko: '에디터 사용성 개선: 초안 유지, 탭 이름, 다크 모드',
      en: 'Editor polish: drafts that survive refresh, tab names, dark mode',
      zh: "编辑器打磨：刷新后保留草稿、标签页名称、深色模式",
      ja: "エディタの使い勝手を改善：下書きの保持、タブ名、ダークモード",
    },
    summary: {
      ko: '매일 쓰기 편하도록 에디터 곳곳을 다듬었습니다. 새로고침해도 쓰던 초안이 남고, 홈은 스크롤 없이 에디터만 보이는 화면으로 바뀌었습니다.',
      en: 'Lots of small fixes for everyday writing. Drafts now survive a refresh, and the home page is the editor alone, with no scrolling.',
      zh: "为了让日常写作更顺手，我们打磨了编辑器的许多细节。刷新后正在写的草稿依然保留，首页也改成了无需滚动、只显示编辑器的界面。",
      ja: "毎日使いやすいよう、エディタのあちこちを手直ししました。再読み込みしても書きかけの下書きが残り、ホームはスクロールなしでエディタだけが表示される画面になりました。",
    },
    changes: [
      c('new',
        '새 초안 탭의 이름이 본문의 첫 제목으로 표시됩니다.',
        'New draft tabs are named after the document\'s first heading.',
        "新草稿标签页会以正文的第一个标题命名。",
        "新しい下書きタブの名前に、本文の最初の見出しが表示されます。"),
      c('new',
        '빈 에디터에 입력 안내 문구가 표시되고, 에디터 화면의 버튼·메뉴가 페이지 언어(한국어/영어)에 맞게 나옵니다.',
        'An empty editor shows a hint, and the editor\'s buttons and menus follow the page language (Korean/English).',
        "空白编辑器会显示输入提示，编辑器界面的按钮和菜单会跟随页面语言（韩语/英语）显示。",
        "空のエディタに入力のヒントが表示され、エディタ画面のボタンやメニューがページの言語（韓国語／英語）に合わせて表示されるようになりました。"),
      c('improved',
        '홈을 스크롤 없이 에디터만 보이는 화면으로 바꾸고, 문서 사이드바에서 다른 도구와 안내 페이지로 갈 수 있게 했습니다.',
        'The home page is now just the editor, and the document sidebar links to the other tools and guides.',
        "首页改成了只有编辑器的界面，文档侧边栏可以前往其他工具和介绍页面。",
        "ホームをエディタだけの画面にし、文書サイドバーからほかのツールや案内ページへ移動できるようにしました。"),
      c('improved',
        '헤더 버튼의 배치를 자주 쓰는 순서로 정리하고, 아이콘을 통일했습니다.',
        'Header buttons are ordered by how often they\'re used, with consistent icons.',
        "顶部按钮按使用频率重新排列，并统一了图标。",
        "ヘッダーのボタンをよく使う順に並べ直し、アイコンを統一しました。"),
      c('fixed',
        '새로고침하면 저장하지 않은 초안이 사라지던 문제를 고쳤습니다.',
        'Fixed unsaved drafts disappearing on refresh.',
        "修复了刷新后未保存的草稿消失的问题。",
        "再読み込みすると保存していない下書きが消えていた問題を修正しました。"),
      c('fixed',
        '다크 모드에서 에디터의 마크다운 구문 강조가 잘 보이지 않던 문제와, 인쇄 머리글·바닥글 입력칸이 좁아 값이 잘리던 문제를 고쳤습니다.',
        'Fixed hard-to-read Markdown highlighting in the editor in dark mode, and print header/footer fields too narrow to show their values.',
        "修复了深色模式下编辑器的 Markdown 语法高亮看不清的问题，以及打印页眉/页脚输入框太窄导致内容被截断的问题。",
        "ダークモードでエディタの Markdown のハイライトが見えにくかった問題と、印刷のヘッダー・フッターの入力欄が狭くて値が切れていた問題を修正しました。"),
      c('fixed',
        '광고가 채워지지 않을 때 빈 띠가 남던 문제와, 사이드바 토글이 툴바를 가리던 문제를 고쳤습니다.',
        'Fixed an empty strip left where an ad didn\'t load, and the sidebar toggle covering the toolbar.',
        "修复了广告未加载时留下空白条的问题，以及侧边栏开关遮住工具栏的问题。",
        "広告が読み込まれないときに空白の帯が残っていた問題と、サイドバーの切り替えボタンがツールバーを隠していた問題を修正しました。"),
    ],
  },
  {
    date: '2026-09-20',
    title: {
      ko: '글자를 선택·검색할 수 있는 PDF',
      en: 'PDFs with real, selectable text',
      zh: "文字可选中、可搜索的 PDF",
      ja: "文字を選択・検索できる PDF",
    },
    summary: {
      ko: 'PDF를 화면을 찍은 이미지 대신 브라우저 인쇄로 만들도록 바꿨습니다. 이제 PDF 속 글자를 선택·복사·검색할 수 있고, 확대해도 선명합니다. 한글과 업로드한 폰트도 그대로 나옵니다.',
      en: 'PDFs are now made with the browser\'s own printing instead of a picture of the screen. Text in the PDF can be selected, copied and searched, stays sharp when zoomed, and keeps Korean and uploaded fonts.',
      zh: "PDF 改为通过浏览器自带的打印功能生成，而不是截取屏幕图像。现在 PDF 中的文字可以选中、复制和搜索，放大后依然清晰，韩文和上传的字体也会原样保留。",
      ja: "PDF を画面のキャプチャ画像ではなく、ブラウザの印刷機能で作るように変えました。PDF 内の文字を選択・コピー・検索でき、拡大してもくっきりしています。韓国語やアップロードしたフォントもそのまま出力されます。",
    },
    changes: [
      c('new',
        'PDF가 이미지가 아닌 실제 글자로 저장됩니다. 선택·복사·검색이 되고 파일도 가볍습니다.',
        'PDFs now contain real text — selectable, copyable, searchable, and smaller.',
        "PDF 现在保存的是真正的文字，而不是图片：可以选中、复制、搜索，文件也更小。",
        "PDF が画像ではなく実際の文字で保存されるようになりました。選択・コピー・検索ができ、ファイルも軽くなります。"),
      c('improved',
        '인쇄·PDF 저장 버튼을 하나로 합쳤습니다. 브라우저 인쇄 창에서 프린터나 PDF 저장을 고르면 됩니다.',
        'Print and Save PDF are now one button; pick a printer or "Save as PDF" in the browser\'s print dialog.',
        "“打印”和“保存 PDF”按钮合并为一个。在浏览器的打印窗口中选择打印机或“另存为 PDF”即可。",
        "印刷と PDF 保存のボタンを 1 つにまとめました。ブラウザの印刷画面でプリンターか「PDF に保存」を選んでください。"),
      c('improved',
        '미리보기와 PDF가 같은 스타일을 쓰도록 통합해 화면과 출력물이 똑같이 나옵니다.',
        'The preview and the PDF now share one stylesheet, so what you see is what prints.',
        "预览和 PDF 现在共用同一套样式，屏幕上看到的就是打印出来的样子。",
        "プレビューと PDF が同じスタイルを使うように統一し、画面と出力結果が同じになりました。"),
      c('fixed',
        '업로드한 폰트가 인쇄물에 적용되지 않던 문제와, 배경 없이 인쇄할 때 요소 스타일 레이아웃이 흐트러지던 문제를 고쳤습니다.',
        'Fixed uploaded fonts missing from printouts, and element layout breaking when printing without backgrounds.',
        "修复了上传的字体在打印件中不生效的问题，以及不带背景打印时元素样式布局错乱的问题。",
        "アップロードしたフォントが印刷物に反映されなかった問題と、背景なしで印刷すると要素のレイアウトが崩れていた問題を修正しました。"),
    ],
  },
  {
    date: '2026-05-08',
    title: {
      ko: '인쇄와 PDF 저장 결과 일치',
      en: 'Print and PDF now match',
      zh: "打印与 PDF 保存的结果一致",
      ja: "印刷と PDF 保存の結果を統一",
    },
    summary: {
      ko: '인쇄와 PDF 저장이 같은 결과를 내도록 맞추고, PDF에서 글자 위치가 어긋나던 문제들을 고쳤습니다.',
      en: 'Printing and saving as PDF now produce the same result, and text in PDFs sits where it should.',
      zh: "打印和保存为 PDF 现在会得到相同的结果，PDF 中文字位置错位的问题也已修复。",
      ja: "印刷と PDF 保存で同じ結果が出るようにそろえ、PDF で文字の位置がずれていた問題を修正しました。",
    },
    changes: [
      c('improved',
        '인쇄 버튼이 PDF 저장과 같은 방식으로 출력해 두 결과가 같아졌습니다. PDF 저장 시 배경색 포함이 기본값이 되었습니다.',
        'Print now uses the same output as Save PDF, so both match. Backgrounds are included in PDFs by default.',
        "“打印”按钮现在与“保存 PDF”采用相同的输出方式，两者结果一致。保存 PDF 时默认包含背景颜色。",
        "印刷ボタンが PDF 保存と同じ方式で出力するようになり、両者の結果が同じになりました。PDF 保存時は背景色を含めるのがデフォルトになりました。"),
      c('improved',
        '에디터에서 Tab 들여쓰기를 4칸으로 바꿔 미리보기의 목록 중첩과 맞췄습니다.',
        'Tab indents by 4 spaces in the editor, matching nested lists in the preview.',
        "编辑器中按 Tab 缩进改为 4 个空格，与预览中的嵌套列表一致。",
        "エディタの Tab によるインデントを 4 スペースにし、プレビューの入れ子リストとそろえました。"),
      c('fixed',
        'PDF에서 표·체크리스트 글자가 아래로 치우치던 문제와 첫 요소 위에 불필요한 여백이 생기던 문제를 고쳤습니다.',
        'Fixed table and checklist text sitting too low in PDFs, and extra space above the first element.',
        "修复了 PDF 中表格和清单文字偏下的问题，以及第一个元素上方出现多余空白的问题。",
        "PDF で表やチェックリストの文字が下に寄っていた問題と、最初の要素の上に余計な余白ができていた問題を修正しました。"),
    ],
  },
  {
    date: '2026-04-16',
    title: {
      ko: 'PDF 출력 품질 개선, 미리보기에서 체크박스 클릭',
      en: 'Better PDF output, and clickable checkboxes in the preview',
      zh: "PDF 输出质量提升，可在预览中点击复选框",
      ja: "PDF 出力の品質向上、プレビューでチェックボックスをクリック",
    },
    summary: {
      ko: 'PDF와 인쇄 결과를 손봤습니다. 프리셋 테마가 출력물에 그대로 반영되고, 한글 머리글·바닥글과 페이지 나눔이 깔끔해졌습니다. 미리보기에서 체크박스를 눌러 할 일을 체크할 수 있습니다.',
      en: 'A round of PDF and print fixes: theme presets carry into the output, and Korean headers/footers and page breaks come out clean. You can also tick checkboxes right in the preview.',
      zh: "我们改进了 PDF 和打印结果：主题预设会原样体现在输出中，韩文页眉/页脚和分页也更加整齐。还可以在预览中直接勾选待办事项的复选框。",
      ja: "PDF と印刷の結果に手を入れました。テーマプリセットが出力にそのまま反映され、韓国語のヘッダー・フッターと改ページもきれいになりました。プレビューでチェックボックスを押して ToDo にチェックを付けられます。",
    },
    changes: [
      c('new',
        '미리보기에서 체크박스를 클릭하면 원본 마크다운의 [ ]와 [x]가 바뀝니다. 목록 밖에 쓴 [ ]·[x]도 체크박스로 표시됩니다.',
        'Click a checkbox in the preview to toggle [ ] / [x] in the Markdown. [ ] and [x] outside lists also render as checkboxes.',
        "在预览中点击复选框，会切换 Markdown 源码中的 [ ] 和 [x]。写在列表外的 [ ] 和 [x] 也会显示为复选框。",
        "プレビューでチェックボックスをクリックすると、元の Markdown の [ ] と [x] が切り替わります。リストの外に書いた [ ] や [x] もチェックボックスとして表示されます。"),
      c('new',
        "PDF 파일 이름이 '문서 제목-날짜.pdf' 형식으로 저장됩니다.",
        "PDFs are saved as 'title-date.pdf'.",
        "PDF 文件会以“文档标题-日期.pdf”的格式命名保存。",
        "PDF のファイル名が「文書タイトル-日付.pdf」の形式で保存されるようになりました。"),
      c('fixed',
        'PDF 다운로드와 인쇄에 프리셋 테마 스타일이 반영되지 않던 문제를 고쳤습니다.',
        'Fixed theme preset styles not applying to PDF downloads and printing.',
        "修复了下载 PDF 和打印时预设主题样式不生效的问题。",
        "PDF のダウンロードと印刷にプリセットテーマのスタイルが反映されなかった問題を修正しました。"),
      c('fixed',
        'PDF 머리글·바닥글의 한글이 깨지던 문제, 페이지가 나뉠 때 표 머리행이나 제목만 따로 떨어지던 문제를 고치고 PDF 용량을 크게 줄였습니다.',
        'Fixed garbled Korean in PDF headers/footers and table headers or headings stranded at page breaks, and made PDFs much smaller.',
        "修复了 PDF 页眉/页脚中韩文乱码的问题，以及分页时表头行或标题单独落到上一页的问题，并大幅减小了 PDF 体积。",
        "PDF のヘッダー・フッターで韓国語が文字化けしていた問題と、改ページで表の見出し行や見出しだけが取り残されていた問題を修正し、PDF のサイズを大きく減らしました。"),
      c('fixed',
        '브라우저로 인쇄할 때 미리보기 창 UI가 함께 인쇄되던 문제와, 파일 드래그 표시가 창 밖으로 나가도 사라지지 않던 문제를 고쳤습니다.',
        'Fixed the print preview window\'s UI being printed along with the document, and the drag-and-drop overlay staying up after leaving the window.',
        "修复了用浏览器打印时预览窗口的界面被一起打印的问题，以及拖动文件的提示在移出窗口后仍不消失的问题。",
        "ブラウザで印刷するとプレビュー画面の UI まで印刷されていた問題と、ファイルをドラッグしたときの表示がウィンドウの外に出ても消えなかった問題を修正しました。"),
    ],
  },
  {
    date: '2026-03-27',
    title: {
      ko: '프리셋 15종, 슬라이드 모드, 스타일·문서 공유 링크',
      en: '15 presets, slide mode, and share links for styles and documents',
      zh: "15 种预设、幻灯片模式，以及样式和文档分享链接",
      ja: "15 種類のプリセット、スライドモード、スタイルと文書の共有リンク",
    },
    summary: {
      ko: '테마 프리셋을 15가지로 늘리고 표·제목·이미지·코드블럭까지 세밀하게 꾸밀 수 있게 했습니다. --- 로 나눈 문서를 슬라이드로 보여주고, 스타일이나 문서를 링크 하나로 공유할 수 있습니다.',
      en: 'Theme presets grow to 15, with fine control over tables, headings, images and code blocks. Show a document split by --- as slides, and share a style or a whole document with one link.',
      zh: "主题预设增加到 15 种，表格、标题、图片和代码块都能细致调整。用 --- 分隔的文档可以作为幻灯片展示，样式或整篇文档都能通过一个链接分享。",
      ja: "テーマプリセットを 15 種類に増やし、表・見出し・画像・コードブロックまで細かく整えられるようにしました。--- で区切った文書をスライドとして表示でき、スタイルや文書をリンク 1 つで共有できます。",
    },
    changes: [
      c('new',
        '테마 프리셋 10종 추가: 세피아, 오션, 포레스트, 선셋, 뉴스페이퍼, 아카데믹, 노트북, 터미널, 엘레강트, 파스텔. 프리셋마다 제목·굵은 글씨·표 색이 다릅니다.',
        '10 new theme presets — Sepia, Ocean, Forest, Sunset, Newspaper, Academic, Notebook, Terminal, Elegant and Pastel — each with its own heading, bold and table colours.',
        "新增 10 种主题预设：复古、海洋、森林、日落、报纸、学术、笔记本、终端、典雅、粉彩。每种预设的标题、粗体和表格颜色各不相同。",
        "テーマプリセットを 10 種類追加：セピア、オーシャン、フォレスト、サンセット、新聞、アカデミック、ノート、ターミナル、エレガント、パステル。プリセットごとに見出し・太字・表の色が異なります。"),
      c('new',
        '슬라이드 모드: --- 로 나눈 문서를 한 장씩 프레젠테이션처럼 보여줍니다. 키보드로 넘길 수 있습니다.',
        'Slide mode: present a document split by --- one slide at a time, using the keyboard to move.',
        "幻灯片模式：把用 --- 分隔的文档像演示文稿一样逐页展示，可以用键盘翻页。",
        "スライドモード：--- で区切った文書を、プレゼンテーションのように 1 枚ずつ表示します。キーボードでめくれます。"),
      c('new',
        '공유 링크: 지금 스타일을 링크로 공유하거나, 문서 전체를 압축한 링크로 공유할 수 있습니다.',
        'Share links: share your current style as a link, or a whole document as a compressed link.',
        "分享链接：可以把当前样式作为链接分享，也可以把整篇文档压缩成链接分享。",
        "共有リンク：いまのスタイルをリンクで共有したり、文書全体を圧縮したリンクで共有したりできます。"),
      c('new',
        '스타일 편집 확대: 제목 밑줄, 이미지, 코드블럭, 표(머리행·셀·줄무늬 행)를 스타일 패널에서 꾸밀 수 있습니다.',
        'More to style: heading underlines, images, code blocks and tables (header, cells, striped rows) in the style panel.',
        "可调整的样式更多了：在样式面板中可以设置标题下划线、图片、代码块和表格（表头、单元格、斑马纹行）。",
        "スタイル編集の対象を拡大：見出しの下線、画像、コードブロック、表（見出し行・セル・縞模様の行）をスタイルパネルで整えられます。"),
      c('new',
        '마크다운 치트시트 페이지를 추가했습니다. 문법을 보면서 바로 따라 쓸 수 있습니다.',
        'Added an interactive Markdown cheatsheet page.',
        "新增 Markdown 速查表页面，可以一边看语法一边动手写。",
        "Markdown チートシートのページを追加しました。構文を見ながらすぐに試せます。"),
      c('new',
        '크롬 확장 프로그램이 GitLab, Bitbucket, npm, PyPI, Notion도 지원하고, 한국어/영어로 표시됩니다.',
        'The Chrome extension now supports GitLab, Bitbucket, npm, PyPI and Notion, in Korean and English.',
        "Chrome 扩展新增支持 GitLab、Bitbucket、npm、PyPI 和 Notion，并提供韩语/英语界面。",
        "Chrome 拡張機能が GitLab、Bitbucket、npm、PyPI、Notion にも対応し、韓国語／英語で表示されるようになりました。"),
      c('improved',
        '색 선택기를 새로 만들어 색상 역할과 내가 만든 색을 바로 고를 수 있습니다. 스타일 패널 문구를 한국어/영어로 통일했습니다.',
        'A new colour picker with colour roles and your own colours one click away, and style panel text in a single language.',
        "全新的取色器，可以一键选择颜色角色和自己创建的颜色。样式面板的文字也统一成了单一语言。",
        "カラーピッカーを作り直し、色の役割や自分で作った色をすぐに選べるようにしました。スタイルパネルの文言も 1 つの言語に統一しました。"),
      c('improved',
        '모바일에서는 스타일 패널이 전체 화면으로 열리고, 저장·불러오기 창도 모바일에 맞게 바뀌었습니다. 오프라인일 때 보이는 화면도 다듬었습니다.',
        'On mobile the style panel opens full screen and the save/load dialogs fit the screen. The offline screen is clearer too.',
        "在手机上，样式面板会全屏打开，保存/打开窗口也针对手机做了调整。离线时显示的界面也更清晰了。",
        "モバイルではスタイルパネルが全画面で開き、保存・読み込みの画面もモバイルに合わせて変わりました。オフライン時の画面も手直ししました。"),
    ],
  },
  {
    date: '2026-03-20',
    title: {
      ko: '요소별 스타일 편집기, 내 프리셋, 문서 사이드바와 탭',
      en: 'Per-element style editor, custom presets, document sidebar and tabs',
      zh: "按元素编辑样式、自定义预设、文档侧边栏和标签页",
      ja: "要素ごとのスタイル編集、マイプリセット、文書サイドバーとタブ",
    },
    summary: {
      ko: '스타일을 요소별로 세밀하게 편집하고 나만의 프리셋으로 저장할 수 있게 됐습니다. 왼쪽 문서 사이드바에서 폴더로 문서를 정리하고, 여러 문서를 탭으로 열어 오갈 수 있습니다.',
      en: 'Style each element in detail and save the result as your own preset. Organise documents in folders in the new left sidebar, and keep several open in tabs.',
      zh: "现在可以按元素细致地编辑样式，并保存为自己的预设。在新的左侧文档侧边栏中可以用文件夹整理文档，还能用标签页同时打开多篇文档来回切换。",
      ja: "スタイルを要素ごとに細かく編集し、自分だけのプリセットとして保存できるようになりました。左側の新しい文書サイドバーでフォルダごとに文書を整理し、複数の文書をタブで開いて行き来できます。",
    },
    changes: [
      c('new',
        '요소별 스타일 편집기: 제목, 본문, 목록, 인용문 등 요소마다 글꼴·크기·색·여백을 바꿀 수 있습니다. 여백을 고칠 때 미리보기에 영역이 표시됩니다.',
        'Per-element style editor: set font, size, colour and spacing for headings, paragraphs, lists, quotes and more, with the spacing highlighted in the preview as you edit.',
        "按元素编辑样式：可以为标题、正文、列表、引用等每种元素设置字体、字号、颜色和间距。调整间距时，预览中会标出对应区域。",
        "要素ごとのスタイル編集：見出し、本文、リスト、引用など要素ごとにフォント・サイズ・色・余白を変えられます。余白を調整するときは、プレビューにその範囲が表示されます。"),
      c('new',
        '내 프리셋: 지금 스타일을 저장·불러오기·삭제하고, JSON 파일로 내보내거나 가져올 수 있습니다. 스타일 변경은 실행 취소·다시 실행이 됩니다.',
        'Custom presets: save, load and delete your styles, and export or import them as JSON. Style changes support undo and redo.',
        "自定义预设：可以保存、载入和删除当前样式，也可以导出或导入为 JSON 文件。样式修改支持撤销和重做。",
        "マイプリセット：いまのスタイルを保存・適用・削除でき、JSON ファイルとして書き出し・読み込みもできます。スタイルの変更は元に戻す・やり直すに対応しています。"),
      c('new',
        '커스텀 폰트를 올려 쓸 수 있고, 색상 탭에서 색상 역할별 팔레트를 고를 수 있습니다. 프리셋 갤러리 페이지도 추가했습니다.',
        'Upload your own fonts, pick palettes by colour role in the Color tab, and browse the new preset gallery page.',
        "可以上传自己的字体，在“颜色”标签页中按颜色角色挑选配色。还新增了预设展示页面。",
        "カスタムフォントをアップロードして使え、「カラー」タブでは色の役割ごとにパレットを選べます。プリセットのギャラリーページも追加しました。"),
      c('new',
        '문서 사이드바: 저장한 문서를 폴더 트리로 보고, 이름 바꾸기·드래그 이동·폴더 만들기를 할 수 있습니다.',
        'Document sidebar: see saved documents as a folder tree, and rename, drag to move, or create folders.',
        "文档侧边栏：以文件夹树的形式查看已保存的文档，可以重命名、拖动移动或新建文件夹。",
        "文書サイドバー：保存した文書をフォルダツリーで表示し、名前の変更、ドラッグでの移動、フォルダの作成ができます。"),
      c('new',
        '탭: 여러 문서를 탭으로 열어 일반 에디터처럼 오갈 수 있습니다.',
        'Tabs: open several documents in tabs and switch between them like any editor.',
        "标签页：可以用标签页打开多篇文档，像普通编辑器一样来回切换。",
        "タブ：複数の文書をタブで開き、一般的なエディタのように行き来できます。"),
      c('new',
        '할 일 목록(- [ ] / - [x])이 체크박스로 표시됩니다.',
        'Task lists (- [ ] / - [x]) render as checkboxes.',
        "待办清单（- [ ] / - [x]）会显示为复选框。",
        "ToDo リスト（- [ ] / - [x]）がチェックボックスとして表示されます。"),
      c('improved',
        '스타일 설정을 대화상자 대신 옆에 붙는 패널로 바꿔, 미리보기를 보면서 편집할 수 있습니다.',
        'Style settings moved from a dialog into a side panel, so you can edit while watching the preview.',
        "样式设置从对话框改为停靠在旁边的面板，可以一边看预览一边编辑。",
        "スタイル設定をダイアログから横に並ぶパネルに変え、プレビューを見ながら編集できるようにしました。"),
      c('fixed',
        '페이지 글꼴과 업로드한 폰트가 새로고침 후 사라지던 문제를 고쳤습니다.',
        'Fixed the page font and uploaded fonts being lost after a refresh.',
        "修复了页面字体和上传的字体在刷新后丢失的问题。",
        "ページのフォントとアップロードしたフォントが再読み込み後に消えていた問題を修正しました。"),
    ],
  },
  {
    date: '2026-03-13',
    title: {
      ko: '모바일 화면, 한글 서식·PDF 수정, 크롬 확장 개선',
      en: 'Mobile layout, Korean formatting and PDF fixes, a better Chrome extension',
      zh: "手机界面、韩文格式与 PDF 修复、Chrome 扩展改进",
      ja: "モバイル画面、韓国語の書式と PDF の修正、Chrome 拡張機能の改善",
    },
    summary: {
      ko: '휴대폰에서도 쓸 수 있도록 화면을 고치고, 한글 문서에서 자주 겪던 서식 문제와 PDF 문제를 해결했습니다. 크롬 확장 프로그램은 Gist와 이슈·PR 본문까지 열 수 있게 됐습니다.',
      en: 'The layout now works on phones, and common formatting and PDF problems with Korean text are fixed. The Chrome extension can also open Gists and issue/PR descriptions.',
      zh: "界面现在可以在手机上使用，韩文文档中常见的格式问题和 PDF 问题也已解决。Chrome 扩展还可以打开 Gist 以及 issue/PR 的正文。",
      ja: "スマートフォンでも使えるよう画面を直し、韓国語の文書でよく起きていた書式と PDF の問題を解決しました。Chrome 拡張機能では Gist や Issue・PR の本文も開けるようになりました。",
    },
    changes: [
      c('new',
        '크롬 확장 프로그램: GitHub Gist와 이슈·PR 본문을 printmd로 열 수 있고, 단축키(Ctrl+Shift+P)와 최근 파일 삭제를 지원합니다.',
        'Chrome extension: open GitHub Gists and issue/PR descriptions in printmd, with a keyboard shortcut (Ctrl+Shift+P) and clearing of recent files.',
        "Chrome 扩展：可以在 printmd 中打开 GitHub Gist 以及 issue/PR 的正文，支持快捷键（Ctrl+Shift+P）和清除最近的文件。",
        "Chrome 拡張機能：GitHub の Gist や Issue・PR の本文を printmd で開けるようになり、ショートカットキー（Ctrl+Shift+P）と最近のファイルの削除に対応しました。"),
      c('new',
        '블로그와 소개 페이지를 추가했습니다.',
        'Added the blog and about pages.',
        "新增了博客和关于页面。",
        "ブログと紹介ページを追加しました。"),
      c('improved',
        '작성 중인 문서가 브라우저에 자동으로 저장됩니다.',
        'Documents you\'re writing are saved in your browser automatically.',
        "正在写的文档会自动保存在浏览器中。",
        "書いている文書がブラウザに自動で保存されます。"),
      c('fixed',
        '한글 바로 옆에 쓴 **굵게**·*기울임*이 적용되지 않던 문제를 고쳤습니다.',
        'Fixed **bold** and *italic* not working right next to Korean (CJK) characters.',
        "修复了紧挨着韩文（中日韩）字符书写的 **粗体** 和 *斜体* 不生效的问题。",
        "韓国語（CJK）の文字のすぐ隣に書いた **太字** や *斜体* が反映されなかった問題を修正しました。"),
      c('fixed',
        'PDF를 내려받을 때 빈 페이지가 생기던 문제와, 에디터·미리보기 스크롤이 하나로 묶여 움직이던 문제를 고쳤습니다.',
        'Fixed blank pages in downloaded PDFs, and the editor and preview scrolling as one.',
        "修复了下载的 PDF 出现空白页的问题，以及编辑器和预览滚动被绑在一起的问题。",
        "PDF をダウンロードすると空白ページができていた問題と、エディタとプレビューのスクロールが連動して動いていた問題を修正しました。"),
      c('fixed',
        '모바일에서 화면이 깨지던 문제, 미리보기의 목록 기호와 코드블럭 배경이 사라지던 문제를 고쳤습니다.',
        'Fixed the broken mobile layout, and missing list bullets and code block backgrounds in the preview.',
        "修复了手机上界面错乱的问题，以及预览中列表符号和代码块背景消失的问题。",
        "モバイルで画面が崩れていた問題と、プレビューでリストの記号やコードブロックの背景が消えていた問題を修正しました。"),
    ],
  },
  {
    date: '2026-03-03',
    title: {
      ko: '문서 저장·폴더 정리, 여러 쪽 인쇄 미리보기',
      en: 'Save documents in folders, and a multi-page print preview',
      zh: "文档保存与文件夹整理、多页打印预览",
      ja: "文書の保存とフォルダ整理、複数ページの印刷プレビュー",
    },
    summary: {
      ko: '쓴 문서를 폴더로 정리해 저장하고 다시 불러올 수 있습니다. 인쇄 미리보기는 실제 용지처럼 쪽을 나눠 보여줍니다.',
      en: 'Save your documents into folders and open them again later. The print preview now splits pages just like real paper.',
      zh: "写好的文档可以分文件夹保存，之后再打开。打印预览现在会像真实纸张一样分页显示。",
      ja: "書いた文書をフォルダに整理して保存し、あとで開き直せます。印刷プレビューは実際の用紙のようにページを分けて表示します。",
    },
    changes: [
      c('new',
        '문서 저장·불러오기: 브라우저에 문서를 폴더 구조로 저장합니다.',
        'Save and open documents, organised in folders in your browser.',
        "保存和打开文档：文档以文件夹结构保存在浏览器中。",
        "文書の保存と読み込み：文書をフォルダ構造でブラウザに保存します。"),
      c('new',
        '인쇄 미리보기에서 여러 쪽이 실제 용지 크기로 나뉘어 보입니다.',
        'The print preview shows multiple pages at real paper size.',
        "打印预览会按实际纸张大小分成多页显示。",
        "印刷プレビューで、複数のページが実際の用紙サイズに分かれて表示されます。"),
      c('improved',
        'README의 배지 이미지가 미리보기에서 한 줄로 나란히 표시됩니다.',
        'README badge images line up side by side in the preview.',
        "README 中的徽章图片在预览中会并排显示在一行。",
        "README のバッジ画像がプレビューで 1 行に横並びで表示されます。"),
      c('fixed',
        '크롬 확장 프로그램이 GitHub 저장소 첫 화면의 README를 찾지 못하던 문제를 고쳤습니다.',
        'Fixed the Chrome extension not finding the README on a repository\'s main page.',
        "修复了 Chrome 扩展在 GitHub 仓库首页找不到 README 的问题。",
        "Chrome 拡張機能が GitHub リポジトリのトップページで README を見つけられなかった問題を修正しました。"),
    ],
  },
  {
    date: '2026-03-01',
    title: {
      ko: 'printmd 공개',
      en: 'printmd launches',
      zh: "printmd 正式发布",
      ja: "printmd を公開",
    },
    summary: {
      ko: '마크다운을 쓰고 원하는 스타일로 꾸며 PDF로 저장하는 무료 웹 도구 printmd를 공개했습니다. 회원가입이나 설치 없이 브라우저에서 바로 쓸 수 있습니다.',
      en: 'printmd is out: a free web tool to write Markdown, style it the way you like, and save it as a PDF — no sign-up, no install.',
      zh: "printmd 发布了：一款免费的网页工具，可以写 Markdown、按喜欢的样式排版并保存为 PDF——无需注册，无需安装。",
      ja: "Markdown を書いて好きなスタイルに整え、PDF として保存できる無料の Web ツール、printmd を公開しました。会員登録もインストールも不要で、ブラウザからすぐに使えます。",
    },
    changes: [
      c('new',
        '실시간 미리보기가 있는 마크다운 에디터, 테마 프리셋, 인쇄 미리보기와 PDF 다운로드.',
        'A Markdown editor with live preview, theme presets, print preview and PDF download.',
        "带实时预览的 Markdown 编辑器、主题预设、打印预览和 PDF 下载。",
        "リアルタイムプレビュー付きの Markdown エディタ、テーマプリセット、印刷プレビューと PDF ダウンロード。"),
      c('new',
        '마크다운 파일을 끌어다 놓아 열기, 저장·내려받기.',
        'Drag and drop Markdown files to open them; save and download.',
        "拖入 Markdown 文件即可打开，支持保存和下载。",
        "Markdown ファイルをドラッグ＆ドロップで開く、保存・ダウンロード。"),
      c('new',
        'GitHub의 README와 마크다운 파일을 바로 printmd로 여는 크롬 확장 프로그램.',
        'A Chrome extension that opens GitHub READMEs and Markdown files in printmd.',
        "可以把 GitHub 上的 README 和 Markdown 文件直接在 printmd 中打开的 Chrome 扩展。",
        "GitHub の README や Markdown ファイルをそのまま printmd で開ける Chrome 拡張機能。"),
      c('new',
        '한국어와 영어 지원.',
        'Korean and English.',
        "支持韩语和英语。",
        "韓国語と英語に対応。"),
    ],
  },
];

/** Shorthand for one change line. */
function c(kind: ChangeKind, ko: string, en: string, zh: string, ja: string): ChangelogEntry['changes'][number] {
  return { kind, text: { ko, en, zh, ja } };
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
  zh: {
    title: '更新日志',
    heading: 'printmd 更新日志',
    description: '按日期整理的 printmd 新功能与改进：代码块语法高亮与代码主题、为元提示词和技能文件等提示词文档显示 front matter 的文档信息卡片等最新变化。',
    keywords: [
      'printmd 更新', 'printmd 更新日志', 'markdown 编辑器 更新', '元提示词', '元提示词 PDF',
      '提示词 markdown 转 PDF', 'SKILL.md 查看器', 'yaml front matter 预览',
      'markdown front matter', 'markdown 代码高亮', 'markdown 代码主题',
    ],
    kinds: { new: '新功能', improved: '改进', fixed: '修复' },
    cta: '马上试试新功能吧。',
    ctaButton: '打开编辑器',
  },
  ja: {
    title: 'アップデート履歴',
    heading: 'printmd のアップデート履歴',
    description: 'printmd の新機能と改善点を日付順にまとめました。コードブロックのシンタックスハイライトとコードテーマ、メタプロンプトやスキルファイルなどプロンプト文書のフロントマターを表示する文書情報カードなど、最近の変更をご覧ください。',
    keywords: [
      'printmd アップデート', 'printmd 更新履歴', 'markdown エディタ アップデート', 'メタプロンプト', 'メタプロンプト PDF',
      'プロンプト markdown PDF', 'SKILL.md ビューア', 'yaml フロントマター プレビュー',
      'markdown フロントマター', 'markdown シンタックスハイライト', 'markdown コードテーマ',
    ],
    kinds: { new: '新機能', improved: '改善', fixed: '修正' },
    cta: '新しい機能をさっそく使ってみましょう。',
    ctaButton: 'エディタを開く',
  },
};
