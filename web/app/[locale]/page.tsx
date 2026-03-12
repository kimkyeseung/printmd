import type { Metadata } from 'next';
import { locales, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import HomeClient from '@/components/home/HomeClient';

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

  const title = dict.meta.title;
  const description = dict.meta.description;

  return {
    title,
    description,
    keywords: dict.meta.keywords.split(','),
    openGraph: {
      title,
      description,
      url: `https://printmd.app/${locale}`,
      type: 'website',
    },
    alternates: {
      canonical: `https://printmd.app/${locale}`,
      languages: {
        'ko': 'https://printmd.app/ko',
        'en': 'https://printmd.app/en',
      },
    },
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = isValidLocale(localeParam) ? localeParam : 'en';
  const dict = await getDictionary(locale);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'printmd',
    description: dict.meta.description,
    url: `https://printmd.app/${locale}`,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'Markdown to PDF conversion',
      'Real-time preview',
      '5 theme presets',
      'Custom styling',
      'GitHub integration',
      'Chrome extension',
    ],
    softwareHelp: {
      '@type': 'CreativeWork',
      url: `https://printmd.app/${locale}/guide`,
    },
    keywords: 'markdown to pdf, md to pdf, markdown converter, markdown editor, print markdown, markdown pdf converter',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* SEO text - visible to crawlers, visually hidden */}
      <h1 className="sr-only">{dict.meta.title}</h1>
      <p className="sr-only">{dict.meta.description}</p>
      {/* Client-side editor UI */}
      <HomeClient />
    </>
  );
}
