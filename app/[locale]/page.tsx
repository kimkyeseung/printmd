import type { Metadata } from 'next';
import Link from 'next/link';
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
      '5 theme presets',
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
    <div className="flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* SSR SEO content — first in DOM for crawlers, visually after editor */}
      <section className="order-2 mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {seo.heading}
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          {seo.description}
        </p>

        {/* Features */}
        <h2 className="mt-16 text-2xl font-semibold">{seo.featuresTitle}</h2>
        <dl className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {([1, 2, 3, 4, 5, 6] as const).map((n) => (
            <div key={n}>
              <dt className="font-medium">
                {seo[`feature${n}` as keyof typeof seo]}
              </dt>
              <dd className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {seo[`feature${n}Desc` as keyof typeof seo]}
              </dd>
            </div>
          ))}
        </dl>

        {/* How to */}
        <h2 className="mt-16 text-2xl font-semibold">{seo.howToTitle}</h2>
        <ol className="mt-6 space-y-6">
          {([1, 2, 3] as const).map((n) => (
            <li key={n}>
              <h3 className="font-medium">
                {seo[`howToStep${n}Title` as keyof typeof seo]}
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {seo[`howToStep${n}Desc` as keyof typeof seo]}
              </p>
            </li>
          ))}
        </ol>

        {/* FAQ */}
        <h2 className="mt-16 text-2xl font-semibold">{seo.faqTitle}</h2>
        <dl className="mt-6 space-y-6">
          {([1, 2, 3, 4, 5] as const).map((n) => (
            <div key={n}>
              <dt className="font-medium">
                {seo[`faq${n}Q` as keyof typeof seo]}
              </dt>
              <dd className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {seo[`faq${n}A` as keyof typeof seo]}
              </dd>
            </div>
          ))}
        </dl>

        {/* Internal link to /markdown-to-pdf */}
        <p className="mt-16 text-center">
          <span className="text-gray-600 dark:text-gray-400">
            {seo.ctaText}
          </span>{' '}
          <Link
            href={`/${locale}/markdown-to-pdf`}
            className="font-medium text-blue-600 underline hover:text-blue-800 dark:text-blue-400"
          >
            {seo.ctaLink}
          </Link>
        </p>
      </section>

      {/* Client-side editor UI — visually first */}
      <div className="order-1">
        <HomeClient />
      </div>
    </div>
  );
}
