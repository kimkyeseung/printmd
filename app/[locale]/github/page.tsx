import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/metadata';
import Link from 'next/link';
import { locales, localeTags, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { SiteFooter } from '@/components/layout';

function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);
  const t = dict.github;

  return buildPageMetadata({
    locale,
    path: '/github',
    title: t.title,
    description: t.description,
    keywords: t.keywords.split(','),
  });
}

type GitHubPageText = {
  howToName: string;
  howToDescription: string;
  heroLine1: string;
  heroHighlight: string;
  heroAfter: string;
  heroDescription: string;
  start: string;
  extension: string;
  featuresTitle: string;
  features: { icon: string; title: string; description: string }[];
  stepsTitle: string;
  steps: { title: string; description: string }[];
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButton: string;
};

const TEXT: Record<Locale, GitHubPageText> = {
  ko: {
    howToName: 'GitHub README를 PDF로 변환하는 방법',
    howToDescription: 'GitHub README.md 파일을 printmd로 예쁘게 PDF로 변환하는 방법',
    heroLine1: 'GitHub README를',
    heroHighlight: 'PDF로 변환',
    heroAfter: '하세요',
    heroDescription: 'GitHub의 README.md 파일을 예쁘게 스타일링하고 PDF로 저장하세요. Chrome 확장프로그램으로 원클릭 변환이 가능합니다.',
    start: '지금 시작하기',
    extension: 'Chrome 확장프로그램',
    featuresTitle: '주요 기능',
    features: [
      { icon: '🔗', title: '원클릭 변환', description: 'GitHub 페이지에서 버튼 클릭 한 번으로 printmd에서 열기' },
      { icon: '🎨', title: '15가지 테마', description: 'Default, Dark, Document, Blog, Minimal 등 15가지 프리셋 제공' },
      { icon: '✏️', title: '커스텀 스타일링', description: '폰트, 색상, 여백 등 세부 스타일 조절 가능' },
      { icon: '📄', title: 'PDF 저장', description: 'A4, Letter, A3 용지 크기 지원, 머리글/바닥글 설정' },
      { icon: '👀', title: '실시간 미리보기', description: '변경사항을 즉시 확인하며 편집' },
      { icon: '💾', title: '자동 저장', description: '작업 내용이 브라우저에 자동 저장' },
    ],
    stepsTitle: '사용 방법',
    steps: [
      { title: 'Chrome 확장프로그램 설치', description: 'Chrome 웹스토어에서 printmd 확장프로그램을 설치하세요.' },
      { title: 'GitHub에서 README 열기', description: '변환하고 싶은 README.md 파일이 있는 GitHub 저장소를 방문하세요.' },
      { title: "'Open in printmd' 클릭", description: 'README 옆에 나타나는 버튼을 클릭하면 printmd에서 열립니다.' },
      { title: '스타일 선택 후 PDF 저장', description: '원하는 테마를 선택하고 PDF로 저장하거나 바로 인쇄하세요.' },
    ],
    ctaTitle: '지금 바로 시작하세요',
    ctaSubtitle: '무료로 사용할 수 있습니다. 가입이 필요 없습니다.',
    ctaButton: 'printmd 열기',
  },
  en: {
    howToName: 'How to convert GitHub README to PDF',
    howToDescription: 'How to convert GitHub README.md files to beautiful PDFs with printmd',
    heroLine1: 'Turn your GitHub README',
    heroHighlight: 'into a PDF',
    heroAfter: '',
    heroDescription: 'Style your GitHub README.md beautifully and save it as a PDF. The Chrome extension makes it a one-click conversion.',
    start: 'Get started',
    extension: 'Chrome extension',
    featuresTitle: 'Features',
    features: [
      { icon: '🔗', title: 'One-click conversion', description: 'Open a README in printmd with a single button on GitHub' },
      { icon: '🎨', title: '15 themes', description: '15 presets including Default, Dark, Document, Blog and Minimal' },
      { icon: '✏️', title: 'Custom styling', description: 'Fine-tune fonts, colors, spacing and more' },
      { icon: '📄', title: 'Save as PDF', description: 'A4, Letter and A3 paper, with headers and footers' },
      { icon: '👀', title: 'Live preview', description: 'See every change as you edit' },
      { icon: '💾', title: 'Autosave', description: 'Your work is saved in your browser automatically' },
    ],
    stepsTitle: 'How it works',
    steps: [
      { title: 'Install the Chrome extension', description: 'Install the printmd extension from the Chrome Web Store.' },
      { title: 'Open a README on GitHub', description: 'Visit the GitHub repository with the README.md file you want to convert.' },
      { title: "Click 'Open in printmd'", description: 'Click the button next to the README to open it in printmd.' },
      { title: 'Choose a style and save as PDF', description: 'Select your preferred theme and save as PDF or print directly.' },
    ],
    ctaTitle: 'Get started now',
    ctaSubtitle: 'Free to use. No signup required.',
    ctaButton: 'Open printmd',
  },
  zh: {
    howToName: '如何把 GitHub README 转换成 PDF',
    howToDescription: '用 printmd 把 GitHub 的 README.md 文件转换成精美 PDF 的方法',
    heroLine1: '把 GitHub README',
    heroHighlight: '转换成 PDF',
    heroAfter: '',
    heroDescription: '为 GitHub 上的 README.md 文件排出漂亮的样式，并保存为 PDF。借助 Chrome 扩展，一键即可转换。',
    start: '立即开始',
    extension: 'Chrome 扩展',
    featuresTitle: '主要功能',
    features: [
      { icon: '🔗', title: '一键转换', description: '在 GitHub 页面上点一下按钮，就能在 printmd 中打开' },
      { icon: '🎨', title: '15 种主题', description: '提供默认、深色、文档、博客、极简等 15 种预设' },
      { icon: '✏️', title: '自定义样式', description: '细调字体、颜色、间距等样式' },
      { icon: '📄', title: '保存为 PDF', description: '支持 A4、Letter、A3 纸张，可设置页眉/页脚' },
      { icon: '👀', title: '实时预览', description: '边编辑边即时查看修改效果' },
      { icon: '💾', title: '自动保存', description: '编辑内容会自动保存在浏览器中' },
    ],
    stepsTitle: '使用方法',
    steps: [
      { title: '安装 Chrome 扩展', description: '从 Chrome 网上应用店安装 printmd 扩展。' },
      { title: '在 GitHub 上打开 README', description: '访问包含你想转换的 README.md 文件的 GitHub 仓库。' },
      { title: '点击“Open in printmd”', description: '点击 README 旁边出现的按钮，就会在 printmd 中打开。' },
      { title: '选择样式并保存为 PDF', description: '选择喜欢的主题，保存为 PDF 或直接打印。' },
    ],
    ctaTitle: '现在就开始吧',
    ctaSubtitle: '免费使用，无需注册。',
    ctaButton: '打开 printmd',
  },
  ja: {
    howToName: 'GitHub README を PDF に変換する方法',
    howToDescription: 'printmd で GitHub の README.md ファイルをきれいな PDF に変換する方法',
    heroLine1: 'GitHub の README を',
    heroHighlight: 'PDF に変換',
    heroAfter: 'しよう',
    heroDescription: 'GitHub の README.md ファイルをきれいに整えて、PDF として保存できます。Chrome 拡張機能を使えばワンクリックで変換できます。',
    start: '今すぐはじめる',
    extension: 'Chrome 拡張機能',
    featuresTitle: '主な機能',
    features: [
      { icon: '🔗', title: 'ワンクリック変換', description: 'GitHub のページでボタンを押すだけで printmd で開けます' },
      { icon: '🎨', title: '15 のテーマ', description: 'デフォルト、ダーク、ドキュメント、ブログ、ミニマルなど 15 のプリセット' },
      { icon: '✏️', title: 'カスタムスタイル', description: 'フォント、色、余白などを細かく調整できます' },
      { icon: '📄', title: 'PDF 保存', description: 'A4、Letter、A3 の用紙に対応し、ヘッダー・フッターも設定可能' },
      { icon: '👀', title: 'リアルタイムプレビュー', description: '変更をすぐに確認しながら編集できます' },
      { icon: '💾', title: '自動保存', description: '作業内容はブラウザに自動で保存されます' },
    ],
    stepsTitle: '使い方',
    steps: [
      { title: 'Chrome 拡張機能をインストール', description: 'Chrome ウェブストアから printmd の拡張機能をインストールします。' },
      { title: 'GitHub で README を開く', description: '変換したい README.md ファイルがある GitHub リポジトリにアクセスします。' },
      { title: '「Open in printmd」をクリック', description: 'README の横に表示されるボタンをクリックすると、printmd で開きます。' },
      { title: 'スタイルを選んで PDF に保存', description: '好きなテーマを選び、PDF として保存するか、そのまま印刷します。' },
    ],
    ctaTitle: 'さっそくはじめましょう',
    ctaSubtitle: '無料で使えます。登録は不要です。',
    ctaButton: 'printmd を開く',
  },
};

export default async function GitHubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = isValidLocale(localeParam) ? localeParam : 'en';
  const dict = await getDictionary(locale);
  const t = TEXT[locale];

  const howToJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: t.howToName,
    description: t.howToDescription,
    totalTime: 'PT2M',
    inLanguage: localeTags[locale],
    tool: [
      {
        '@type': 'HowToTool',
        name: 'printmd Chrome Extension',
      },
    ],
    step: t.steps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: step.title,
      text: step.description,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <div className="h-screen overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
        <main>
          {/* Hero Section */}
          <header className="px-4 py-16 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            {t.heroLine1}
            <br />
            <span className="text-blue-600">{t.heroHighlight}</span>{t.heroAfter}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            {t.heroDescription}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={`/${locale}`}
              className="rounded-lg bg-blue-600 px-8 py-3 text-lg font-semibold text-white shadow-lg transition hover:bg-blue-700"
            >
              {t.start}
            </Link>
            <a
              href="https://chrome.google.com/webstore"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-gray-300 bg-white px-8 py-3 text-lg font-semibold text-gray-700 shadow transition hover:bg-gray-50"
            >
              {t.extension}
            </a>
          </div>
        </header>

        {/* Features Section */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            {t.featuresTitle}
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {t.features.map((feature) => (
              <FeatureCard key={feature.icon} {...feature} />
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-center text-3xl font-bold text-gray-900">
              {t.stepsTitle}
            </h2>
            <div className="mt-12 space-y-8">
              {t.steps.map((step, i) => (
                <Step key={i} number={i + 1} title={step.title} description={step.description} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">
            {t.ctaTitle}
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            {t.ctaSubtitle}
          </p>
          <Link
            href={`/${locale}`}
            className="mt-8 inline-block rounded-lg bg-blue-600 px-8 py-3 text-lg font-semibold text-white shadow-lg transition hover:bg-blue-700"
          >
            {t.ctaButton}
          </Link>
        </section>
        </main>
        <SiteFooter locale={locale} dict={dict.footer} />
      </div>
    </>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="text-3xl">{icon}</div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-gray-600">{description}</p>
    </div>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
        {number}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="mt-1 text-gray-600">{description}</p>
      </div>
    </div>
  );
}
