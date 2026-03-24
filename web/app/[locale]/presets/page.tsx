import type { Metadata } from 'next';
import Link from 'next/link';
import { locales, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { themePresets, presetKeys } from '@/lib/themes/presets';
import { THEME_NAMES, THEME_DESCRIPTIONS } from '@/types/theme';

function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = await getDictionary(locale);
  const t = dict.presets;

  return {
    title: `${t.title} - printmd`,
    description: t.description,
    openGraph: {
      title: `${t.title} | printmd`,
      description: t.description,
      url: `https://printmd.app/${locale}/presets`,
    },
    alternates: {
      canonical: `https://printmd.app/${locale}/presets`,
      languages: {
        ko: 'https://printmd.app/ko/presets',
        en: 'https://printmd.app/en/presets',
      },
    },
  };
}

function PresetCard({
  name,
  description,
  styles,
}: {
  name: string;
  description: string;
  styles: typeof themePresets.default;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
      {/* Preview */}
      <div
        className="p-6"
        style={{
          backgroundColor: styles.backgroundColor,
          color: styles.textColor,
          fontFamily: styles.fontFamily,
          fontSize: `${Math.min(styles.fontSize, 14)}px`,
          lineHeight: styles.lineHeight,
        }}
      >
        <div style={{ maxWidth: 400 }}>
          <h3 style={{ fontSize: '1.25em', fontWeight: 700, marginBottom: 8 }}>
            Heading 1
          </h3>
          <p style={{ marginBottom: 8 }}>
            Lorem ipsum dolor sit amet, <strong>bold text</strong> and{' '}
            <em>italic</em>.
          </p>
          <ul style={{ paddingLeft: 20, marginBottom: 8 }}>
            <li>List item one</li>
            <li>List item two</li>
          </ul>
          <code
            style={{
              backgroundColor: styles.codeBackground,
              padding: '2px 6px',
              borderRadius: 4,
              fontSize: '0.875em',
            }}
          >
            code snippet
          </code>
          <p style={{ marginTop: 8 }}>
            <span style={{ color: styles.linkColor, textDecoration: 'underline' }}>
              Link example
            </span>
          </p>
        </div>
      </div>
      {/* Info */}
      <div className="border-t border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">{name}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
          <div className="flex gap-1.5">
            {[styles.backgroundColor, styles.textColor, styles.linkColor].map(
              (color, i) => (
                <span
                  key={i}
                  className="h-5 w-5 rounded-full border border-gray-300"
                  style={{ backgroundColor: color }}
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function PresetsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = isValidLocale(localeParam) ? localeParam : 'en';
  const dict = await getDictionary(locale);
  const t = dict.presets;

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: t.title,
      description: t.description,
      url: `https://printmd.app/${locale}/presets`,
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: presetKeys.map((key, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: THEME_NAMES[key],
          description: THEME_DESCRIPTIONS[key],
        })),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'printmd', item: `https://printmd.app/${locale}` },
        { '@type': 'ListItem', position: 2, name: t.title, item: `https://printmd.app/${locale}/presets` },
      ],
    },
  ];

  return (
    <div className="h-screen overflow-y-auto bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="border-b border-gray-200 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Link
            href={`/${locale}`}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            ← printmd
          </Link>
          <h1 className="mt-4 text-4xl font-bold text-gray-900">{t.title}</h1>
          <p className="mt-2 text-gray-600">{t.subtitle}</p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2">
          {presetKeys.map((key) => (
            <PresetCard
              key={key}
              name={THEME_NAMES[key]}
              description={THEME_DESCRIPTIONS[key]}
              styles={themePresets[key]}
            />
          ))}
        </div>

        {/* CTA */}
        <section className="mt-16 text-center">
          <p className="text-gray-600 mb-4">{t.cta}</p>
          <Link
            href={`/${locale}`}
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            {t.ctaButton}
          </Link>
        </section>
      </main>

      <footer className="border-t border-gray-200 px-4 py-8 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} printmd. All rights reserved.</p>
      </footer>
    </div>
  );
}
