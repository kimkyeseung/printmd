import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/metadata';
import Link from 'next/link';
import { locales, type Locale } from '@/lib/i18n/config';
import { themePresets, themeElementStyles, presetKeys } from '@/lib/themes/presets';
import { THEME_NAMES } from '@/types/theme';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { SiteFooter } from '@/components/layout';

function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const t = {
  en: {
    title: 'Markdown Table Styles',
    subtitle:
      'Compare how tables look across 15 preset themes. Pick a style, customize colors, borders, and striped rows in printmd.',
    description:
      'Explore markdown table styles and customization options. Preview table header, cell, and striped row colors across 15 themes in printmd.',
    headerLabel: 'Header',
    sampleHeaders: ['Feature', 'Status', 'Note'],
    sampleRows: [
      ['Dark mode', 'Done', 'v1.2'],
      ['Export PDF', 'Done', 'v1.0'],
      ['Table style', 'New', 'v1.5'],
    ],
    ctaText: 'Ready to style your markdown tables?',
    ctaButton: 'Open the Editor',
    howToName: 'How to customize markdown table styles in printmd',
    howToDesc:
      'Step-by-step guide to customizing table header colors, cell borders, and striped row backgrounds in printmd.',
    steps: [
      { name: 'Open printmd editor', text: 'Go to printmd.app and open the markdown editor.' },
      { name: 'Write a markdown table', text: 'Use standard markdown pipe syntax to create a table.' },
      { name: 'Open the style panel', text: 'Click the style panel to access theme and element settings.' },
      { name: 'Pick a preset theme', text: 'Choose from 15 built-in themes to instantly change the table look.' },
      { name: 'Customize table styles', text: 'Adjust tableHeader background, tableCell borders, and tableEvenRow striping.' },
      { name: 'Preview and export', text: 'Preview the styled table in real time and export to PDF or print.' },
    ],
  },
  ko: {
    title: '마크다운 테이블 스타일',
    subtitle:
      '15가지 프리셋 테마별로 테이블이 어떻게 보이는지 비교해 보세요. printmd에서 색상, 테두리, 줄무늬 행을 자유롭게 커스터마이징할 수 있습니다.',
    description:
      '마크다운 테이블 스타일과 커스터마이징 옵션을 살펴보세요. printmd의 15가지 테마에서 테이블 헤더, 셀, 줄무늬 행 색상을 미리 확인할 수 있습니다.',
    headerLabel: '헤더',
    sampleHeaders: ['기능', '상태', '비고'],
    sampleRows: [
      ['다크 모드', '완료', 'v1.2'],
      ['PDF 내보내기', '완료', 'v1.0'],
      ['테이블 스타일', '신규', 'v1.5'],
    ],
    ctaText: '마크다운 테이블을 스타일링할 준비가 되셨나요?',
    ctaButton: '에디터 열기',
    howToName: 'printmd에서 마크다운 테이블 스타일을 커스터마이징하는 방법',
    howToDesc:
      'printmd에서 테이블 헤더 색상, 셀 테두리, 줄무늬 행 배경을 커스터마이징하는 단계별 가이드입니다.',
    steps: [
      { name: 'printmd 에디터 열기', text: 'printmd.app에 접속하여 마크다운 에디터를 엽니다.' },
      { name: '마크다운 테이블 작성', text: '표준 마크다운 파이프 문법으로 테이블을 작성합니다.' },
      { name: '스타일 패널 열기', text: '스타일 패널을 클릭하여 테마 및 요소 설정에 접근합니다.' },
      { name: '프리셋 테마 선택', text: '15가지 내장 테마 중 하나를 선택하여 테이블 모양을 즉시 변경합니다.' },
      { name: '테이블 스타일 커스터마이징', text: 'tableHeader 배경색, tableCell 테두리, tableEvenRow 줄무늬를 조절합니다.' },
      { name: '미리보기 및 내보내기', text: '스타일이 적용된 테이블을 실시간으로 미리보고 PDF로 내보내거나 인쇄합니다.' },
    ],
  },
  zh: {
    title: 'Markdown 表格样式',
    subtitle:
      '对比 15 种预设主题下表格的样子。在 printmd 中挑选风格，自由调整颜色、边框和斑马纹行。',
    description:
      '探索 Markdown 表格的样式与自定义选项。在 printmd 的 15 种主题中预览表头、单元格和斑马纹行的颜色。',
    headerLabel: '表头',
    sampleHeaders: ['功能', '状态', '备注'],
    sampleRows: [
      ['深色模式', '已完成', 'v1.2'],
      ['导出 PDF', '已完成', 'v1.0'],
      ['表格样式', '新增', 'v1.5'],
    ],
    ctaText: '准备好给你的 Markdown 表格换个样式了吗？',
    ctaButton: '打开编辑器',
    howToName: '如何在 printmd 中自定义 Markdown 表格样式',
    howToDesc:
      '分步讲解如何在 printmd 中自定义表头颜色、单元格边框和斑马纹行背景。',
    steps: [
      { name: '打开 printmd 编辑器', text: '访问 printmd.app，打开 Markdown 编辑器。' },
      { name: '写一个 Markdown 表格', text: '用标准的 Markdown 竖线语法创建表格。' },
      { name: '打开样式面板', text: '点击样式面板，进入主题和元素设置。' },
      { name: '选择预设主题', text: '从 15 种内置主题中选一个，表格外观立即改变。' },
      { name: '自定义表格样式', text: '调整 tableHeader 背景、tableCell 边框和 tableEvenRow 斑马纹。' },
      { name: '预览并导出', text: '实时预览排好样式的表格，再导出为 PDF 或打印。' },
    ],
  },
  ja: {
    title: 'Markdown の表スタイル',
    subtitle:
      '15 のプリセットテーマで表がどう見えるかを比べてみましょう。printmd では色、罫線、縞模様の行を自由にカスタマイズできます。',
    description:
      'Markdown の表スタイルとカスタマイズ方法を紹介します。printmd の 15 のテーマで、見出しセル、セル、縞模様の行の色をプレビューできます。',
    headerLabel: '見出し',
    sampleHeaders: ['機能', '状態', '備考'],
    sampleRows: [
      ['ダークモード', '完了', 'v1.2'],
      ['PDF 出力', '完了', 'v1.0'],
      ['表のスタイル', '新規', 'v1.5'],
    ],
    ctaText: 'Markdown の表をおしゃれにしてみませんか？',
    ctaButton: 'エディタを開く',
    howToName: 'printmd で Markdown の表スタイルをカスタマイズする方法',
    howToDesc:
      'printmd で見出しセルの色、セルの罫線、縞模様の行の背景をカスタマイズする手順を紹介します。',
    steps: [
      { name: 'printmd のエディタを開く', text: 'printmd.app にアクセスし、Markdown エディタを開きます。' },
      { name: 'Markdown で表を書く', text: '標準的な Markdown のパイプ記法で表を作ります。' },
      { name: 'スタイルパネルを開く', text: 'スタイルパネルを開き、テーマと要素の設定にアクセスします。' },
      { name: 'プリセットテーマを選ぶ', text: '15 の組み込みテーマから 1 つ選ぶと、表の見た目がすぐに変わります。' },
      { name: '表のスタイルをカスタマイズ', text: 'tableHeader の背景、tableCell の罫線、tableEvenRow の縞模様を調整します。' },
      { name: 'プレビューして書き出す', text: 'スタイルを当てた表をリアルタイムで確認し、PDF に書き出すか印刷します。' },
    ],
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const lang = isValidLocale(locale) ? locale : 'en';
  const strings = t[lang];

  return buildPageMetadata({
    locale: lang,
    path: '/themes/table-styling',
    title: strings.title,
    description: strings.description,
    keywords: [
      'markdown table styles',
      'markdown table customization',
      'markdown table theme',
      'printmd table',
      'markdown table colors',
      'striped table rows',
    ],
  });
}

function TablePreview({
  presetKey,
  locale,
}: {
  presetKey: (typeof presetKeys)[number];
  locale: Locale;
}) {
  const global = themePresets[presetKey];
  const elements = themeElementStyles[presetKey];
  const header = elements?.tableHeader ?? {};
  const cell = elements?.tableCell ?? {};
  const evenRow = elements?.tableEvenRow ?? {};
  const strings = t[locale];

  const headerStyle: React.CSSProperties = {
    padding: '6px 10px',
    textAlign: 'left' as const,
    fontWeight: 700,
    fontSize: 12,
    ...(header as React.CSSProperties),
  };

  const cellStyle: React.CSSProperties = {
    padding: '6px 10px',
    fontSize: 12,
    ...(cell as React.CSSProperties),
  };

  const evenCellStyle: React.CSSProperties = {
    ...cellStyle,
    ...(evenRow as React.CSSProperties),
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
      <div
        style={{
          backgroundColor: global.backgroundColor,
          color: global.textColor,
          fontFamily: global.fontFamily,
          padding: 16,
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {strings.sampleHeaders.map((h) => (
                <th key={h} style={headerStyle}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {strings.sampleRows.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {row.map((val, colIdx) => (
                  <td
                    key={colIdx}
                    style={rowIdx % 2 === 1 ? evenCellStyle : cellStyle}
                  >
                    {val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-gray-200 bg-white px-4 py-3">
        <span className="text-sm font-semibold text-gray-900">
          {THEME_NAMES[presetKey]}
        </span>
      </div>
    </div>
  );
}

export default async function TableStylingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = isValidLocale(localeParam) ? localeParam : 'en';
  const dict = await getDictionary(locale);
  const strings = t[locale];

  const howToJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: strings.howToName,
    description: strings.howToDesc,
    step: strings.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
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
        name: strings.title,
        item: `https://printmd.app/${locale}/themes/table-styling`,
      },
    ],
  };

  return (
    <div className="h-screen overflow-y-auto bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([howToJsonLd, breadcrumbJsonLd]),
        }}
      />

      <header className="border-b border-gray-200 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <Link
            href={`/${locale}`}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            &larr; printmd
          </Link>
          <h1 className="mt-4 text-4xl font-bold text-gray-900">
            {strings.title}
          </h1>
          <p className="mt-2 text-lg text-gray-600">{strings.subtitle}</p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {presetKeys.map((key) => (
            <TablePreview key={key} presetKey={key} locale={locale} />
          ))}
        </div>

        <section className="mt-16 text-center">
          <p className="mb-4 text-gray-600">{strings.ctaText}</p>
          <Link
            href={`/${locale}`}
            className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
          >
            {strings.ctaButton}
          </Link>
        </section>
      </main>
      <SiteFooter locale={locale} dict={dict.footer} />
    </div>
  );
}
