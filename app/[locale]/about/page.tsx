import type { Metadata } from 'next';
import Link from 'next/link';
import { locales, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';

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
  const t = dict.about;

  return {
    title: `${t.title} - printmd`,
    description: t.description,
    openGraph: {
      title: `${t.title} | printmd`,
      description: t.description,
      url: `https://printmd.app/${locale}/about`,
    },
    alternates: {
      canonical: `https://printmd.app/${locale}/about`,
      languages: {
        ko: 'https://printmd.app/ko/about',
        en: 'https://printmd.app/en/about',
      },
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = isValidLocale(localeParam) ? localeParam : 'en';
  const dict = await getDictionary(locale);
  const t = dict.about;

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: t.title,
      description: t.description,
      url: `https://printmd.app/${locale}/about`,
      mainEntity: {
        '@type': 'SoftwareApplication',
        name: 'printmd',
        applicationCategory: 'Utility',
        operatingSystem: 'Web',
        url: 'https://printmd.app',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'printmd', item: `https://printmd.app/${locale}` },
        { '@type': 'ListItem', position: 2, name: t.title, item: `https://printmd.app/${locale}/about` },
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
        <div className="mx-auto max-w-3xl">
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

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="prose prose-gray max-w-none">
          {/* Mission */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.missionTitle}</h2>
            <p className="text-gray-600 leading-relaxed">{t.missionDesc}</p>
          </section>

          {/* What is printmd */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.whatTitle}</h2>
            <p className="text-gray-600 leading-relaxed mb-4">{t.whatDesc}</p>
            <div className="grid gap-4 sm:grid-cols-2 mt-6">
              {[
                { icon: '✏️', title: t.featureEditor, desc: t.featureEditorDesc },
                { icon: '🎨', title: t.featureThemes, desc: t.featureThemesDesc },
                { icon: '📄', title: t.featurePdf, desc: t.featurePdfDesc },
                { icon: '🔒', title: t.featurePrivacy, desc: t.featurePrivacyDesc },
                { icon: '🌐', title: t.featureI18n, desc: t.featureI18nDesc },
                { icon: '🔌', title: t.featureExtension, desc: t.featureExtensionDesc },
              ].map((feature) => (
                <div key={feature.title} className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-2">{feature.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Who we are */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.whoTitle}</h2>
            <p className="text-gray-600 leading-relaxed">{t.whoDesc}</p>
          </section>

          {/* Open source & transparency */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.openTitle}</h2>
            <p className="text-gray-600 leading-relaxed">{t.openDesc}</p>
          </section>

          {/* Contact */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.contactTitle}</h2>
            <p className="text-gray-600 leading-relaxed">
              {t.contactDesc}{' '}
              <a
                href="mailto:contact@printmd.app"
                className="text-blue-600 hover:underline"
              >
                contact@printmd.app
              </a>
            </p>
          </section>

          {/* Support */}
          <section className="mb-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {locale === 'ko' ? '응원하기' : 'Support'}
            </h2>
            <p className="text-gray-600 mb-6">
              {locale === 'ko'
                ? 'printmd가 도움이 되셨다면, 커피 한 잔으로 응원해 주세요.'
                : 'If printmd has been helpful, consider buying me a coffee.'}
            </p>
            <a
              href="https://buymeacoffee.com/kimkyeseung"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-[#FFDD00] px-6 py-3 font-medium text-gray-900 shadow-sm transition-colors hover:bg-[#ffca00]"
            >
              <span className="text-xl">☕</span>
              Buy me a coffee
            </a>
          </section>

          {/* CTA */}
          <section className="text-center py-8 border-t border-gray-200">
            <p className="text-gray-600 mb-4">{t.ctaText}</p>
            <Link
              href={`/${locale}`}
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              {t.ctaButton}
            </Link>
          </section>
        </div>
      </main>

    </div>
  );
}
