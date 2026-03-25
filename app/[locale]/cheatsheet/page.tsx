import type { Metadata } from 'next';
import Link from 'next/link';
import { locales, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { CheatsheetClient } from '@/components/cheatsheet/CheatsheetClient';
import { AdBanner } from '@/components/adsense/AdBanner';
import { AdSidebar } from '@/components/adsense/AdSidebar';

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

  return {
    title: `${t.title} - ${t.subtitle}`,
    description: t.description,
    keywords: t.keywords.split(','),
    openGraph: {
      title: `${t.title} - ${t.subtitle} | printmd`,
      description: t.description,
      url: `https://printmd.app/${locale}/cheatsheet`,
    },
    alternates: {
      canonical: `https://printmd.app/${locale}/cheatsheet`,
      languages: {
        ko: 'https://printmd.app/ko/cheatsheet',
        en: 'https://printmd.app/en/cheatsheet',
      },
    },
  };
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
    inLanguage: locale === 'ko' ? 'ko-KR' : 'en-US',
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
    { id: 'headings', label: locale === 'ko' ? '제목' : 'Headings' },
    { id: 'text-formatting', label: locale === 'ko' ? '텍스트 서식' : 'Text Formatting' },
    { id: 'links-images', label: locale === 'ko' ? '링크 & 이미지' : 'Links & Images' },
    { id: 'lists', label: locale === 'ko' ? '목록' : 'Lists' },
    { id: 'blockquotes', label: locale === 'ko' ? '인용문' : 'Blockquotes' },
    { id: 'code', label: locale === 'ko' ? '코드' : 'Code' },
    { id: 'tables', label: locale === 'ko' ? '테이블' : 'Tables' },
    { id: 'horizontal-rules', label: locale === 'ko' ? '수평선' : 'Horizontal Rules' },
    { id: 'other', label: locale === 'ko' ? '기타' : 'Other' },
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

        {/* Footer */}
        <footer className="border-t border-gray-200 px-4 py-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} printmd. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}
