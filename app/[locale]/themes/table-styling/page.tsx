import type { Metadata } from 'next';
import Link from 'next/link';
import { locales, type Locale } from '@/lib/i18n/config';
import { themePresets, themeElementStyles, presetKeys } from '@/lib/themes/presets';
import { THEME_NAMES } from '@/types/theme';

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
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const lang = isValidLocale(locale) ? locale : 'en';
  const strings = t[lang];

  return {
    title: `${strings.title} - printmd`,
    description: strings.description,
    keywords: [
      'markdown table styles',
      'markdown table customization',
      'markdown table theme',
      'printmd table',
      'markdown table colors',
      'striped table rows',
    ],
    openGraph: {
      title: `${strings.title} | printmd`,
      description: strings.description,
      url: `https://printmd.app/${lang}/themes/table-styling`,
    },
    alternates: {
      canonical: `https://printmd.app/${lang}/themes/table-styling`,
      languages: {
        ko: 'https://printmd.app/ko/themes/table-styling',
        en: 'https://printmd.app/en/themes/table-styling',
      },
    },
  };
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

      <footer className="border-t border-gray-200 px-4 py-8 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} printmd. All rights reserved.</p>
        <a
          href="https://buymeacoffee.com/kimkyeseung"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-gray-400 hover:text-[#FFDD00] transition-colors"
        >
          ☕ Buy me a coffee
        </a>
      </footer>
    </div>
  );
}
