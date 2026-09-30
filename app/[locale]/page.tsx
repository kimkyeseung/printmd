import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo/metadata';
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

  return buildPageMetadata({
    locale,
    path: '',
    title,
    description,
    keywords: dict.meta.keywords.split(','),
    absoluteTitle: true,
  });
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
    browserRequirements: 'Requires a modern web browser (Chrome, Firefox, Safari, Edge)',
    softwareVersion: '1.0',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'Markdown to PDF conversion',
      'Real-time preview',
      '15 customizable presets',
      'Custom styling',
      'GitHub integration',
      'Chrome extension',
    ],
    softwareHelp: {
      '@type': 'CreativeWork',
      url: `https://printmd.app/${locale}/guide`,
    },
    sameAs: [
      'https://github.com/kimkyeseung/printmd',
      'https://chromewebstore.google.com/detail/printmd-markdown-to-pdf/aogiijhfmcpobikknoclgabgaeiamfjg',
    ],
    keywords: 'markdown to pdf, md to pdf, markdown converter, markdown editor, print markdown, markdown pdf converter',
  };

  const seo = dict.home.seo;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/*
        The home page is the editor and nothing else — no scrolling past it.
        The page still needs a top-level heading for screen readers and
        crawlers; it describes the app on screen, so it is visually hidden
        rather than duplicated as a visible banner. Long-form copy lives on
        the landing pages (/markdown-to-pdf, /guide), not hidden here.
      */}
      <h1 className="sr-only">{seo.heading}</h1>
      <p className="sr-only">{seo.description}</p>
      <HomeClient />
    </>
  );
}
