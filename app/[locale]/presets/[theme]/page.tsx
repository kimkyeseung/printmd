import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/metadata';
import Link from 'next/link';
import { locales, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { themePresets, themeElementStyles, presetKeys } from '@/lib/themes/presets';
import { THEME_NAMES } from '@/types/theme';
import type { ThemePreset } from '@/types/style';
import { SiteFooter } from '@/components/layout';

function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

function isValidTheme(theme: string): theme is ThemePreset {
  return presetKeys.includes(theme as ThemePreset);
}

export async function generateStaticParams() {
  return locales.flatMap((locale) =>
    presetKeys.map((theme) => ({ locale, theme }))
  );
}

const THEME_KEYWORDS_EN: Record<ThemePreset, string> = {
  default: 'default markdown theme,clean markdown style,white background markdown,standard markdown pdf',
  dark: 'dark mode markdown,dark theme pdf,dark markdown editor,dark background markdown',
  document: 'document style markdown,serif font markdown,formal document pdf,professional markdown',
  blog: 'blog style markdown,blog post pdf,readable markdown theme,blog markdown format',
  minimal: 'minimal markdown theme,minimalist pdf style,clean print markdown,simple markdown style',
  sepia: 'sepia markdown theme,vintage style pdf,warm tone markdown,retro document style',
  ocean: 'ocean theme markdown,blue dark theme pdf,sea color markdown,deep blue document',
  forest: 'forest theme markdown,green nature pdf,natural color markdown,green document style',
  sunset: 'sunset theme markdown,purple warm pdf,sunset color markdown,twilight document style',
  newspaper: 'newspaper style markdown,classic print pdf,serif newspaper markdown,traditional document',
  academic: 'academic paper markdown,research paper pdf,scholarly markdown theme,thesis style document',
  notebook: 'notebook style markdown,handwritten feel pdf,note-taking markdown,casual document style',
  terminal: 'terminal theme markdown,developer console pdf,monospace markdown,hacker style document',
  elegant: 'elegant markdown theme,luxury style pdf,gold accent markdown,premium document style',
  pastel: 'pastel theme markdown,soft color pdf,lavender markdown style,gentle document theme',
};

const THEME_KEYWORDS_KO: Record<ThemePreset, string> = {
  default: '기본 마크다운 테마,깔끔한 마크다운 스타일,흰색 배경 마크다운,표준 마크다운 PDF',
  dark: '다크 모드 마크다운,어두운 테마 PDF,다크 마크다운 에디터,어두운 배경 마크다운',
  document: '문서형 마크다운,세리프 폰트 마크다운,공식 문서 PDF,전문 마크다운',
  blog: '블로그 스타일 마크다운,블로그 글 PDF,가독성 높은 마크다운,블로그 마크다운 형식',
  minimal: '미니멀 마크다운 테마,미니멀리스트 PDF,깔끔한 인쇄 마크다운,심플 마크다운',
  sepia: '세피아 마크다운 테마,빈티지 스타일 PDF,따뜻한 톤 마크다운,레트로 문서 스타일',
  ocean: '오션 테마 마크다운,블루 다크 테마 PDF,바다색 마크다운,깊은 파랑 문서',
  forest: '포레스트 테마 마크다운,초록색 자연 PDF,자연 색상 마크다운,녹색 문서 스타일',
  sunset: '선셋 테마 마크다운,보라빛 노을 PDF,선셋 색상 마크다운,황혼 문서 스타일',
  newspaper: '신문 스타일 마크다운,클래식 인쇄 PDF,세리프 신문 마크다운,전통 문서 스타일',
  academic: '학술 논문 마크다운,연구 논문 PDF,학술 마크다운 테마,논문 스타일 문서',
  notebook: '노트북 스타일 마크다운,필기 느낌 PDF,노트 마크다운,캐주얼 문서 스타일',
  terminal: '터미널 테마 마크다운,개발자 콘솔 PDF,모노스페이스 마크다운,해커 스타일 문서',
  elegant: '엘레강트 마크다운 테마,고급 스타일 PDF,골드 포인트 마크다운,프리미엄 문서 스타일',
  pastel: '파스텔 테마 마크다운,부드러운 색상 PDF,라벤더 마크다운 스타일,부드러운 문서 테마',
};

const THEME_LONG_DESC_EN: Record<ThemePreset, string> = {
  default: 'A clean, versatile theme with a white background and dark text. Perfect for general-purpose documents, README files, and everyday Markdown.',
  dark: 'A modern dark theme with light text on a dark background. Ideal for developers, late-night reading, and presentations with a sleek look.',
  document: 'A formal document style using serif fonts and generous margins. Great for official reports, letters, and professional documentation.',
  blog: 'Optimized for readability with large fonts and wide line spacing. Perfect for blog posts, articles, and long-form content.',
  minimal: 'Stripped-down styling with minimal decoration. Designed for print-first output and distraction-free reading.',
  sepia: 'A warm, vintage-inspired theme with earthy tones. Evokes the feel of aged paper and classic books.',
  ocean: 'A deep blue theme inspired by the ocean depths. Cool cyan accents create a calm, immersive reading experience.',
  forest: 'A natural green theme that is easy on the eyes. Earthy greens and soft backgrounds create a refreshing feel.',
  sunset: 'A warm purple theme inspired by twilight skies. Orange accents on deep purple create a dramatic atmosphere.',
  newspaper: 'Classic newspaper typography with serif fonts and traditional layout. Double-rule borders add authentic print character.',
  academic: 'Designed for scholarly papers and research documents. Clean serif typography with structured, formal layout.',
  notebook: 'A casual notebook style with dashed borders and relaxed spacing. Feels like handwritten notes on lined paper.',
  terminal: 'A developer-focused theme with monospace fonts and green-on-black terminal aesthetics. Code-first design.',
  elegant: 'A sophisticated theme with gold accents and serif typography. Premium feel for special documents and invitations.',
  pastel: 'A soft, gentle theme with pastel lavender and pink tones. Friendly and approachable for creative content.',
};

const THEME_LONG_DESC_KO: Record<ThemePreset, string> = {
  default: '깔끔한 흰 배경에 검정 텍스트의 범용 테마입니다. 일반 문서, README 파일, 일상적인 마크다운에 적합합니다.',
  dark: '어두운 배경에 밝은 텍스트의 모던 다크 테마입니다. 개발자, 야간 독서, 세련된 프레젠테이션에 이상적입니다.',
  document: '세리프 폰트와 넉넉한 여백의 공식 문서 스타일입니다. 공식 보고서, 서한, 전문 문서에 적합합니다.',
  blog: '큰 글꼴과 넓은 행간으로 가독성을 최적화한 테마입니다. 블로그 글, 기사, 장문 콘텐츠에 적합합니다.',
  minimal: '최소한의 장식으로 인쇄 최적화된 스타일입니다. 방해 없는 깔끔한 읽기 경험을 제공합니다.',
  sepia: '따뜻한 톤의 빈티지 감성 테마입니다. 오래된 종이와 고전 도서의 느낌을 재현합니다.',
  ocean: '깊은 바다에서 영감 받은 블루 테마입니다. 시원한 시안 포인트로 차분한 독서 경험을 제공합니다.',
  forest: '눈이 편안한 자연 초록 테마입니다. 부드러운 녹색 톤으로 상쾌한 느낌을 줍니다.',
  sunset: '황혼의 하늘에서 영감 받은 보라빛 테마입니다. 깊은 보라 위 오렌지 포인트가 드라마틱한 분위기를 연출합니다.',
  newspaper: '세리프 활자와 전통 레이아웃의 클래식 신문 스타일입니다. 이중 테두리가 정통 인쇄 느낌을 더합니다.',
  academic: '학술 논문과 연구 문서에 최적화된 테마입니다. 깔끔한 세리프 타이포그래피와 정돈된 레이아웃을 제공합니다.',
  notebook: '점선 테두리와 여유로운 간격의 캐주얼 노트 스타일입니다. 줄 노트에 필기한 듯한 느낌을 줍니다.',
  terminal: '모노스페이스 폰트와 초록색 터미널 미학의 개발자 테마입니다. 코드 중심 디자인입니다.',
  elegant: '골드 포인트와 세리프 타이포그래피의 고급 테마입니다. 특별한 문서와 초대장에 어울리는 프리미엄 느낌입니다.',
  pastel: '파스텔 라벤더와 핑크 톤의 부드러운 테마입니다. 창의적인 콘텐츠에 친근하고 따뜻한 인상을 줍니다.',
};

const THEME_KEYWORDS_ZH: Record<ThemePreset, string> = {
  default: '默认markdown主题,简洁markdown样式,白色背景markdown,标准markdown pdf',
  dark: '深色模式markdown,深色主题pdf,深色markdown编辑器,深色背景markdown',
  document: '文档风格markdown,衬线字体markdown,正式文档pdf,专业markdown',
  blog: '博客风格markdown,博客文章pdf,易读markdown主题,博客markdown格式',
  minimal: '极简markdown主题,极简pdf样式,简洁打印markdown,简约markdown样式',
  sepia: '复古markdown主题,复古风格pdf,暖色调markdown,怀旧文档样式',
  ocean: '海洋主题markdown,蓝色深色主题pdf,海蓝色markdown,深蓝文档',
  forest: '森林主题markdown,绿色自然pdf,自然色markdown,绿色文档样式',
  sunset: '日落主题markdown,紫色暖调pdf,日落配色markdown,暮光文档样式',
  newspaper: '报纸风格markdown,经典印刷pdf,衬线报纸markdown,传统文档样式',
  academic: '学术论文markdown,研究论文pdf,学术markdown主题,论文样式文档',
  notebook: '笔记本风格markdown,手写感pdf,笔记markdown,休闲文档样式',
  terminal: '终端主题markdown,开发者控制台pdf,等宽字体markdown,极客风格文档',
  elegant: '典雅markdown主题,高级感pdf,金色点缀markdown,精致文档样式',
  pastel: '粉彩主题markdown,柔和配色pdf,薰衣草markdown样式,温柔文档主题',
};

const THEME_KEYWORDS_JA: Record<ThemePreset, string> = {
  default: 'markdown デフォルトテーマ,シンプル markdown スタイル,白背景 markdown,標準 markdown pdf',
  dark: 'ダークモード markdown,ダークテーマ pdf,ダーク markdown エディタ,黒背景 markdown',
  document: 'ドキュメント風 markdown,明朝体 markdown,公式文書 pdf,ビジネス markdown',
  blog: 'ブログ風 markdown,ブログ記事 pdf,読みやすい markdown テーマ,ブログ markdown 書式',
  minimal: 'ミニマル markdown テーマ,ミニマリスト pdf,印刷向け markdown,シンプル markdown',
  sepia: 'セピア markdown テーマ,ヴィンテージ pdf,暖色 markdown,レトロ文書スタイル',
  ocean: 'オーシャン markdown テーマ,青いダークテーマ pdf,海の色 markdown,深い青の文書',
  forest: 'フォレスト markdown テーマ,緑 自然 pdf,ナチュラルカラー markdown,緑の文書スタイル',
  sunset: 'サンセット markdown テーマ,紫 暖色 pdf,夕焼けカラー markdown,黄昏の文書スタイル',
  newspaper: '新聞風 markdown,クラシック印刷 pdf,明朝体 新聞 markdown,伝統的な文書',
  academic: '学術論文 markdown,研究論文 pdf,アカデミック markdown テーマ,論文スタイル',
  notebook: 'ノート風 markdown,手書き風 pdf,ノート markdown,カジュアル文書スタイル',
  terminal: 'ターミナル markdown テーマ,開発者コンソール pdf,等幅フォント markdown,ハッカー風文書',
  elegant: 'エレガント markdown テーマ,高級感 pdf,ゴールド markdown,プレミアム文書スタイル',
  pastel: 'パステル markdown テーマ,やわらかい色 pdf,ラベンダー markdown,やさしい文書テーマ',
};

const THEME_LONG_DESC_ZH: Record<ThemePreset, string> = {
  default: '白色背景配深色文字的简洁通用主题。适合一般文档、README 文件和日常 Markdown。',
  dark: '深色背景配浅色文字的现代深色主题。适合开发者、夜间阅读和风格利落的演示。',
  document: '使用衬线字体和宽松页边距的正式文档风格。适合正式报告、信函和专业文档。',
  blog: '用较大字号和宽松行距优化可读性的主题。适合博客文章、专栏和长篇内容。',
  minimal: '装饰极少、为打印优化的样式。带来干净、不受干扰的阅读体验。',
  sepia: '暖色调的复古主题，重现旧纸张和经典书籍的质感。',
  ocean: '灵感来自深海的蓝色主题。清爽的青色点缀带来平静、沉浸的阅读体验。',
  forest: '看着舒服的自然绿色主题。柔和的绿色调带来清新的感觉。',
  sunset: '灵感来自暮色天空的紫色主题。深紫底色上的橙色点缀营造出戏剧化的氛围。',
  newspaper: '衬线字体和传统版式的经典报纸风格。双线边框更添正宗的印刷质感。',
  academic: '为学术论文和研究文档设计的主题。干净的衬线排版和规整的版式。',
  notebook: '虚线边框、间距宽松的休闲笔记本风格，就像写在横格本上的笔记。',
  terminal: '等宽字体、黑底绿字终端风格的开发者主题，以代码为中心的设计。',
  elegant: '金色点缀和衬线排版的高级主题。适合特别的文档和邀请函。',
  pastel: '粉彩薰衣草和粉色调的柔和主题。为创意内容带来亲切温暖的印象。',
};

const THEME_LONG_DESC_JA: Record<ThemePreset, string> = {
  default: '白い背景に濃い文字の、すっきりした汎用テーマです。一般的な文書、README ファイル、普段の Markdown に向いています。',
  dark: '暗い背景に明るい文字のモダンなダークテーマです。開発者、夜の読書、洗練されたプレゼンテーションにぴったりです。',
  document: '明朝系フォントとゆったりした余白を使った、フォーマルな文書スタイルです。公式な報告書、書簡、ビジネス文書に向いています。',
  blog: '大きめの文字と広い行間で読みやすさを高めたテーマです。ブログ記事、コラム、長文のコンテンツに向いています。',
  minimal: '装飾を最小限に抑えた、印刷向けのスタイルです。気が散らない、すっきりとした読み心地です。',
  sepia: '暖かみのあるヴィンテージ調のテーマです。古い紙や古典的な本の雰囲気を再現します。',
  ocean: '深い海から着想を得たブルーのテーマです。涼しげなシアンのアクセントで、落ち着いて読めます。',
  forest: '目にやさしい自然なグリーンのテーマです。やわらかな緑のトーンで、さわやかな印象になります。',
  sunset: '夕暮れの空から着想を得た紫のテーマです。深い紫にオレンジのアクセントが映え、ドラマチックな雰囲気を演出します。',
  newspaper: '明朝系の書体と伝統的なレイアウトによる、クラシックな新聞スタイルです。二重線の罫線が本格的な印刷物らしさを添えます。',
  academic: '学術論文や研究文書のためのテーマです。すっきりした明朝系の文字組みと、整ったレイアウトが特長です。',
  notebook: '点線の枠とゆとりのある間隔の、カジュアルなノート風スタイルです。罫線ノートに手書きしたような雰囲気です。',
  terminal: '等幅フォントと黒地に緑のターミナル風デザインの、開発者向けテーマです。コード中心のデザインです。',
  elegant: 'ゴールドのアクセントと明朝系の文字組みによる上品なテーマです。特別な文書や招待状にふさわしい高級感があります。',
  pastel: 'パステルのラベンダーとピンクを使った、やわらかなテーマです。クリエイティブなコンテンツに親しみやすい印象を与えます。',
};

const THEME_KEYWORDS: Record<Locale, Record<ThemePreset, string>> = {
  en: THEME_KEYWORDS_EN,
  ko: THEME_KEYWORDS_KO,
  zh: THEME_KEYWORDS_ZH,
  ja: THEME_KEYWORDS_JA,
};

const THEME_LONG_DESC: Record<Locale, Record<ThemePreset, string>> = {
  en: THEME_LONG_DESC_EN,
  ko: THEME_LONG_DESC_KO,
  zh: THEME_LONG_DESC_ZH,
  ja: THEME_LONG_DESC_JA,
};

const PAGE_TEXT: Record<Locale, {
  metaTitle: (name: string) => string;
  metaDescription: (name: string, desc: string) => string;
  background: string;
  textColor: string;
  linkColor: string;
  codeBackground: string;
  h1Color: string;
  h1Border: string;
  strongColor: string;
  hrColor: string;
  colorPalette: string;
  elementColors: string;
  font: string;
  fontSize: string;
  lineHeight: string;
  maxWidth: string;
  padding: string;
  themeDetails: string;
  preview: string;
  ctaTitle: (name: string) => string;
  ctaSubtitle: string;
  previous: string;
  next: string;
  allThemes: string;
}> = {
  en: {
    metaTitle: (name) => `${name} Theme - Markdown PDF Theme`,
    metaDescription: (name, desc) => `Convert Markdown to PDF with the printmd ${name} theme. ${desc}`,
    background: 'Background',
    textColor: 'Text Color',
    linkColor: 'Link Color',
    codeBackground: 'Code Background',
    h1Color: 'H1 Color',
    h1Border: 'H1 Border',
    strongColor: 'Strong Color',
    hrColor: 'HR Color',
    colorPalette: 'Color Palette',
    elementColors: 'Element Colors',
    font: 'Font',
    fontSize: 'Font Size',
    lineHeight: 'Line Height',
    maxWidth: 'Max Width',
    padding: 'Padding',
    themeDetails: 'Theme Details',
    preview: 'Preview',
    ctaTitle: (name) => `Try the ${name} theme on your Markdown`,
    ctaSubtitle: 'Free to use. No signup required.',
    previous: '← Previous',
    next: 'Next →',
    allThemes: '← View all themes',
  },
  ko: {
    metaTitle: (name) => `${name} 테마 - 마크다운 PDF 테마`,
    metaDescription: (name, desc) => `printmd ${name} 테마로 마크다운을 PDF로 변환하세요. ${desc}`,
    background: '배경색',
    textColor: '텍스트 색상',
    linkColor: '링크 색상',
    codeBackground: '코드 배경',
    h1Color: 'H1 색상',
    h1Border: 'H1 하단 테두리',
    strongColor: '강조 색상',
    hrColor: '구분선 색상',
    colorPalette: '색상 팔레트',
    elementColors: '요소별 색상',
    font: '폰트',
    fontSize: '글자 크기',
    lineHeight: '행간',
    maxWidth: '최대 너비',
    padding: '여백',
    themeDetails: '테마 상세',
    preview: '미리보기',
    ctaTitle: (name) => `${name} 테마로 마크다운을 변환해보세요`,
    ctaSubtitle: '무료로 사용할 수 있습니다. 가입이 필요 없습니다.',
    previous: '← 이전',
    next: '다음 →',
    allThemes: '← 모든 테마 보기',
  },
  zh: {
    metaTitle: (name) => `${name} 主题 - Markdown PDF 主题`,
    metaDescription: (name, desc) => `用 printmd 的 ${name} 主题把 Markdown 转换成 PDF。${desc}`,
    background: '背景色',
    textColor: '文字颜色',
    linkColor: '链接颜色',
    codeBackground: '代码背景',
    h1Color: 'H1 颜色',
    h1Border: 'H1 下边框',
    strongColor: '强调颜色',
    hrColor: '分隔线颜色',
    colorPalette: '配色',
    elementColors: '各元素颜色',
    font: '字体',
    fontSize: '字号',
    lineHeight: '行高',
    maxWidth: '最大宽度',
    padding: '内边距',
    themeDetails: '主题详情',
    preview: '预览',
    ctaTitle: (name) => `用 ${name} 主题转换你的 Markdown`,
    ctaSubtitle: '免费使用，无需注册。',
    previous: '← 上一个',
    next: '下一个 →',
    allThemes: '← 查看全部主题',
  },
  ja: {
    metaTitle: (name) => `${name} テーマ - Markdown PDF テーマ`,
    metaDescription: (name, desc) => `printmd の ${name} テーマで Markdown を PDF に変換しましょう。${desc}`,
    background: '背景色',
    textColor: '文字色',
    linkColor: 'リンクの色',
    codeBackground: 'コード背景',
    h1Color: 'H1 の色',
    h1Border: 'H1 の下線',
    strongColor: '強調の色',
    hrColor: '区切り線の色',
    colorPalette: 'カラーパレット',
    elementColors: '要素ごとの色',
    font: 'フォント',
    fontSize: '文字サイズ',
    lineHeight: '行間',
    maxWidth: '最大幅',
    padding: '余白',
    themeDetails: 'テーマの詳細',
    preview: 'プレビュー',
    ctaTitle: (name) => `${name} テーマで Markdown を変換してみましょう`,
    ctaSubtitle: '無料で使えます。登録は不要です。',
    previous: '← 前へ',
    next: '次へ →',
    allThemes: '← すべてのテーマを見る',
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; theme: string }>;
}): Promise<Metadata> {
  const { locale, theme } = await params;
  if (!isValidLocale(locale) || !isValidTheme(theme)) return {};

  const dict = await getDictionary(locale);
  const themeName = THEME_NAMES[theme];
  const themeDesc = THEME_LONG_DESC[locale][theme];
  const keywords = THEME_KEYWORDS[locale][theme];
  const tx = PAGE_TEXT[locale];

  const title = tx.metaTitle(themeName);

  const description = tx.metaDescription(themeName, themeDesc);

  return buildPageMetadata({
    locale,
    path: `/presets/${theme}`,
    title,
    description,
    keywords: `${keywords},printmd,markdown to pdf,markdown theme,${dict.meta.keywords?.split(',').slice(0, 5).join(',') ?? ''}`,
    image: {
      url: `/${locale}/presets/opengraph-image`,
      width: 1200,
      height: 630,
      alt: 'printmd Presets - Theme Collection',
    },
  });
}

function ColorSwatch({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="inline-block h-8 w-8 rounded-lg border border-gray-300 shadow-sm"
        style={{ backgroundColor: color }}
      />
      <div>
        <p className="text-sm font-medium text-gray-700">{label}</p>
        <p className="text-xs font-mono text-gray-500">{color}</p>
      </div>
    </div>
  );
}

function ThemePreview({ theme }: { theme: ThemePreset }) {
  const styles = themePresets[theme];
  const elementStyles = themeElementStyles[theme];
  const h1Color = elementStyles?.h1?.color ?? styles.textColor;
  const strongColor = elementStyles?.strong?.color ?? styles.textColor;
  const h1BorderBottom = elementStyles?.h1?.borderBottomStyle !== 'none'
    ? `${elementStyles?.h1?.borderBottomWidth ?? 0}px ${elementStyles?.h1?.borderBottomStyle ?? 'none'} ${elementStyles?.h1?.borderBottomColor ?? 'transparent'}`
    : 'none';
  const hrColor = elementStyles?.hr?.backgroundColor ?? 'rgba(0,0,0,0.15)';

  return (
    <div
      className="rounded-xl border border-gray-200 shadow-lg overflow-hidden"
      style={{
        backgroundColor: styles.backgroundColor,
        color: styles.textColor,
        fontFamily: styles.fontFamily,
        fontSize: `${Math.min(styles.fontSize, 16)}px`,
        lineHeight: styles.lineHeight,
      }}
    >
      <div className="p-8 sm:p-10">
        <h2
          style={{
            fontSize: '1.75em',
            fontWeight: 700,
            marginBottom: 12,
            color: h1Color,
            paddingBottom: h1BorderBottom !== 'none' ? 8 : 0,
            borderBottom: h1BorderBottom,
          }}
        >
          Sample Document
        </h2>
        <p style={{ marginBottom: 16 }}>
          This is a preview of the <strong style={{ color: strongColor }}>{THEME_NAMES[theme]}</strong> theme.
          It demonstrates how your Markdown will look when converted to PDF with this preset applied.
        </p>
        <h3
          style={{
            fontSize: '1.25em',
            fontWeight: 600,
            marginBottom: 8,
            color: elementStyles?.h2?.color ?? styles.textColor,
          }}
        >
          Features
        </h3>
        <ul style={{ paddingLeft: 24, marginBottom: 16 }}>
          <li style={{ marginBottom: 4 }}>Live preview with <strong style={{ color: strongColor }}>real-time</strong> updates</li>
          <li style={{ marginBottom: 4 }}>Custom font and color settings</li>
          <li style={{ marginBottom: 4 }}>One-click PDF export</li>
        </ul>
        <div
          style={{
            height: 2,
            backgroundColor: hrColor,
            marginTop: 16,
            marginBottom: 16,
            border: 'none',
          }}
        />
        <p style={{ marginBottom: 12 }}>
          Code blocks render with syntax highlighting:
        </p>
        <pre
          style={{
            backgroundColor: styles.codeBackground,
            padding: '12px 16px',
            borderRadius: elementStyles?.code?.borderRadius ?? 6,
            fontSize: '0.875em',
            overflow: 'auto',
            borderWidth: elementStyles?.code?.borderWidth,
            borderColor: elementStyles?.code?.borderColor,
            borderStyle: elementStyles?.code?.borderStyle,
          }}
        >
          <code>{`function greet(name) {\n  return \`Hello, \${name}!\`;\n}`}</code>
        </pre>
        <p style={{ marginTop: 16 }}>
          Links appear as:{' '}
          <span style={{ color: styles.linkColor, textDecoration: 'underline' }}>
            printmd.app
          </span>
        </p>
      </div>
    </div>
  );
}

function ColorPalette({ theme, locale }: { theme: ThemePreset; locale: Locale }) {
  const styles = themePresets[theme];
  const elementStyles = themeElementStyles[theme];

  const tx = PAGE_TEXT[locale];

  const globalColors: { color: string; label: string }[] = [
    { color: styles.backgroundColor, label: tx.background },
    { color: styles.textColor, label: tx.textColor },
    { color: styles.linkColor, label: tx.linkColor },
    { color: styles.codeBackground, label: tx.codeBackground },
  ];

  const elementColors: { color: string; label: string }[] = [];

  if (elementStyles?.h1?.color) {
    elementColors.push({ color: elementStyles.h1.color, label: tx.h1Color });
  }
  if (elementStyles?.h1?.borderBottomColor && elementStyles.h1.borderBottomStyle !== 'none') {
    elementColors.push({ color: elementStyles.h1.borderBottomColor, label: tx.h1Border });
  }
  if (elementStyles?.strong?.color) {
    elementColors.push({ color: elementStyles.strong.color, label: tx.strongColor });
  }
  if (elementStyles?.hr?.backgroundColor) {
    elementColors.push({ color: elementStyles.hr.backgroundColor, label: tx.hrColor });
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        {tx.colorPalette}
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {globalColors.map(({ color, label }) => (
          <ColorSwatch key={label} color={color} label={label} />
        ))}
      </div>
      {elementColors.length > 0 && (
        <>
          <h4 className="text-sm font-medium text-gray-500 mb-4 mt-6">
            {tx.elementColors}
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {elementColors.map(({ color, label }) => (
              <ColorSwatch key={label} color={color} label={label} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ThemeDetails({ theme, locale }: { theme: ThemePreset; locale: Locale }) {
  const styles = themePresets[theme];
  const tx = PAGE_TEXT[locale];

  const details = [
    { label: tx.font, value: styles.fontFamily.split(',')[0].replace(/"/g, '') },
    { label: tx.fontSize, value: `${styles.fontSize}px` },
    { label: tx.lineHeight, value: `${styles.lineHeight}` },
    { label: tx.maxWidth, value: `${styles.maxWidth}px` },
    { label: tx.padding, value: `${styles.padding.top}px` },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {tx.themeDetails}
      </h3>
      <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {details.map(({ label, value }) => (
          <div key={label}>
            <dt className="text-sm text-gray-500">{label}</dt>
            <dd className="text-sm font-medium text-gray-900 mt-0.5">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default async function ThemePage({
  params,
}: {
  params: Promise<{ locale: string; theme: string }>;
}) {
  const { locale: localeParam, theme: themeParam } = await params;
  const locale = isValidLocale(localeParam) ? localeParam : 'en';
  const theme = isValidTheme(themeParam) ? themeParam : 'default';
  const dict = await getDictionary(locale);
  const t = dict.presets;

  const tx = PAGE_TEXT[locale];
  const themeName = THEME_NAMES[theme];
  const themeDesc = dict.stylePanel.themeDescriptions[theme];
  const longDesc = THEME_LONG_DESC[locale][theme];

  const themeIndex = presetKeys.indexOf(theme);
  const prevTheme = themeIndex > 0 ? presetKeys[themeIndex - 1] : null;
  const nextTheme = themeIndex < presetKeys.length - 1 ? presetKeys[themeIndex + 1] : null;

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `printmd ${themeName} Theme`,
    description: longDesc,
    url: `https://printmd.app/${locale}/presets/${theme}`,
    brand: {
      '@type': 'Brand',
      name: 'printmd',
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    category: 'Markdown PDF Theme',
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'printmd',
        item: `https://printmd.app/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t.title,
        item: `https://printmd.app/${locale}/presets`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: themeName,
        item: `https://printmd.app/${locale}/presets/${theme}`,
      },
    ],
  };

  return (
    <div className="h-screen overflow-y-auto bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([productJsonLd, breadcrumbJsonLd]) }}
      />

      <header className="border-b border-gray-200 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link
              href={`/${locale}`}
              className="text-blue-600 hover:text-blue-700"
            >
              printmd
            </Link>
            <span>/</span>
            <Link
              href={`/${locale}/presets`}
              className="text-blue-600 hover:text-blue-700"
            >
              {t.title}
            </Link>
            <span>/</span>
            <span className="text-gray-900">{themeName}</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            {themeName}
          </h1>
          <p className="mt-2 text-gray-600">{themeDesc}</p>
          <p className="mt-1 text-sm text-gray-500">{longDesc}</p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Theme Preview */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {tx.preview}
          </h2>
          <ThemePreview theme={theme} />
        </section>

        {/* Color Palette */}
        <section className="mb-12">
          <ColorPalette theme={theme} locale={locale} />
        </section>

        {/* Theme Details */}
        <section className="mb-12">
          <ThemeDetails theme={theme} locale={locale} />
        </section>

        {/* CTA */}
        <section className="mb-12 rounded-xl bg-gray-50 border border-gray-200 p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {tx.ctaTitle(themeName)}
          </h2>
          <p className="text-gray-600 mb-6">
            {tx.ctaSubtitle}
          </p>
          <Link
            href={`/${locale}`}
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            {t.ctaButton}
          </Link>
        </section>

        {/* Navigation between themes */}
        <nav className="flex items-center justify-between border-t border-gray-200 pt-8">
          {prevTheme ? (
            <Link
              href={`/${locale}/presets/${prevTheme}`}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              {tx.previous}: {THEME_NAMES[prevTheme]}
            </Link>
          ) : (
            <span />
          )}
          {nextTheme ? (
            <Link
              href={`/${locale}/presets/${nextTheme}`}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              {THEME_NAMES[nextTheme]} : {tx.next}
            </Link>
          ) : (
            <span />
          )}
        </nav>

        {/* All themes link */}
        <div className="mt-8 text-center">
          <Link
            href={`/${locale}/presets`}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            {tx.allThemes}
          </Link>
        </div>
      </main>
      <SiteFooter locale={locale} dict={dict.footer} />
    </div>
  );
}
