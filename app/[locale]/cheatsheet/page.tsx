import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/metadata';
import Link from 'next/link';
import { locales, localeTags, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { CheatsheetClient } from '@/components/cheatsheet/CheatsheetClient';
import { AdBanner } from '@/components/adsense/AdBanner';
import { AdSidebar } from '@/components/adsense/AdSidebar';
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
  const t = dict.cheatsheet;

  return buildPageMetadata({
    locale,
    path: '/cheatsheet',
    title: `${t.title} - ${t.subtitle}`,
    description: t.description,
    keywords: t.keywords.split(','),
  });
}

export default async function CheatsheetPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = isValidLocale(localeParam) ? localeParam : 'en';
  const dict = await getDictionary(locale);
  const t = dict.cheatsheet;

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${t.title} - ${t.subtitle}`,
    description: t.description,
    author: {
      '@type': 'Organization',
      name: 'printmd',
      url: 'https://printmd.app',
    },
    publisher: {
      '@type': 'Organization',
      name: 'printmd',
      url: 'https://printmd.app',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://printmd.app/${locale}/cheatsheet`,
    },
    articleSection: 'Reference',
    inLanguage: localeTags[locale],
    datePublished: '2026-03-26',
    dateModified: '2026-03-26',
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'printmd',
        item: 'https://printmd.app',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t.title,
        item: `https://printmd.app/${locale}/cheatsheet`,
      },
    ],
  };

  const tocItems = [
    { id: 'headings', label: ({ ko: '제목', en: 'Headings', zh: '标题', ja: '見出し' } as Record<Locale, string>)[locale] },
    { id: 'text-formatting', label: ({ ko: '텍스트 서식', en: 'Text Formatting', zh: '文字格式', ja: '文字の書式' } as Record<Locale, string>)[locale] },
    { id: 'links-images', label: ({ ko: '링크 & 이미지', en: 'Links & Images', zh: '链接与图片', ja: 'リンクと画像' } as Record<Locale, string>)[locale] },
    { id: 'lists', label: ({ ko: '목록', en: 'Lists', zh: '列表', ja: 'リスト' } as Record<Locale, string>)[locale] },
    { id: 'blockquotes', label: ({ ko: '인용문', en: 'Blockquotes', zh: '引用', ja: '引用' } as Record<Locale, string>)[locale] },
    { id: 'code', label: ({ ko: '코드', en: 'Code', zh: '代码', ja: 'コード' } as Record<Locale, string>)[locale] },
    { id: 'tables', label: ({ ko: '테이블', en: 'Tables', zh: '表格', ja: '表' } as Record<Locale, string>)[locale] },
    { id: 'horizontal-rules', label: ({ ko: '수평선', en: 'Horizontal Rules', zh: '分隔线', ja: '区切り線' } as Record<Locale, string>)[locale] },
    { id: 'other', label: ({ ko: '기타', en: 'Other', zh: '其他', ja: 'その他' } as Record<Locale, string>)[locale] },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="h-screen overflow-y-auto bg-white">
        {/* Header */}
        <header className="border-b border-gray-200 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <Link
              href={`/${locale}`}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              {t.backLink}
            </Link>
            <h1 className="mt-4 text-4xl font-bold text-gray-900">
              {t.heading}
            </h1>
            <p className="mt-2 text-gray-600">
              {t.subheading}
            </p>
          </div>
        </header>

        {/* Ad Banner - Top */}
        <div className="mx-auto max-w-4xl px-4 pt-6 sm:px-6 lg:px-8">
          <AdBanner
            className="h-[90px] w-full rounded-lg overflow-hidden"
            slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BANNER}
          />
        </div>

        {/* Content with Sidebar */}
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {/* Main Content */}
            <main className="flex-1 max-w-4xl">
              {/* Table of Contents */}
              <nav className="mb-12 rounded-xl bg-gray-50 p-6">
                <h2 className="font-semibold text-gray-900">{t.toc}</h2>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {tocItems.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className="text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Cheatsheet Content */}
              <CheatsheetClient
                locale={locale}
                labels={{
                  copy: t.copy,
                  tryInEditor: t.tryInEditor,
                  source: t.source,
                }}
              />

              {/* In-article Ad */}
              <div className="mt-8 lg:hidden">
                <AdBanner
                  className="h-[90px] w-full rounded-lg overflow-hidden"
                  slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE}
                />
              </div>

              {/* CTA */}
              <div className="mt-16 rounded-xl bg-blue-50 p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {t.ctaTitle}
                </h2>
                <p className="mt-2 text-gray-600">
                  {t.ctaSubtitle}
                </p>
                <Link
                  href={`/${locale}`}
                  className="mt-6 inline-block rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700"
                >
                  {t.ctaButton}
                </Link>
              </div>
            </main>

            {/* Sidebar - Desktop only */}
            <aside className="hidden lg:block w-[300px] flex-shrink-0">
              <div className="sticky top-8">
                <AdSidebar
                  className="h-[250px] w-[300px] rounded-lg overflow-hidden"
                  slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR}
                />
                <div className="mt-6">
                  <AdSidebar
                    className="h-[250px] w-[300px] rounded-lg overflow-hidden"
                    slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR}
                  />
                </div>
              </div>
            </aside>
          </div>
        </div>
        <SiteFooter locale={locale} dict={dict.footer} />
      </div>
    </>
  );
}
