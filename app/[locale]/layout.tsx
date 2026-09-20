import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import { locales, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { Providers } from '@/components/Providers';
import { bodyClassName } from '../fonts';

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    return {};
  }
  const dict = await getDictionary(locale);

  return {
    title: {
      default: dict.meta.title,
      template: `%s | printmd`,
    },
    description: dict.meta.description,
    keywords: dict.meta.keywords.split(','),
    alternates: {
      canonical: `https://printmd.app/${locale}`,
      languages: {
        'ko': 'https://printmd.app/ko',
        'en': 'https://printmd.app/en',
        'x-default': 'https://printmd.app/en',
      },
    },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      locale: locale === 'ko' ? 'ko_KR' : 'en_US',
      alternateLocale: locale === 'ko' ? 'en_US' : 'ko_KR',
    },
  };
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'printmd',
  url: 'https://printmd.app',
  logo: 'https://printmd.app/icon-192.png',
  description:
    'Free online Markdown to PDF converter. Edit, style, and convert Markdown to PDF instantly in your browser.',
  sameAs: [
    'https://github.com/kimkyeseung/printmd',
    'https://chromewebstore.google.com/detail/printmd-markdown-to-pdf/aogiijhfmcpobikknoclgabgaeiamfjg',
  ],
};

const webSiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'printmd',
  url: 'https://printmd.app',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://printmd.app/en?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <head suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webSiteJsonLd),
          }}
        />
      </head>
      <body className={bodyClassName}>
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID && (
          <Script
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
            strategy="lazyOnload"
            crossOrigin="anonymous"
          />
        )}
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
