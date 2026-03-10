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
  const t = dict.terms;

  return {
    title: `${t.title} - printmd`,
    description: t.description,
    openGraph: {
      title: `${t.title} | printmd`,
      description: t.description,
      url: `https://printmd.app/${locale}/terms`,
    },
    alternates: {
      canonical: `https://printmd.app/${locale}/terms`,
      languages: {
        ko: 'https://printmd.app/ko/terms',
        en: 'https://printmd.app/en/terms',
      },
    },
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = isValidLocale(localeParam) ? localeParam : 'en';
  const dict = await getDictionary(locale);
  const t = dict.terms;

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Link
            href={`/${locale}`}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            ← printmd
          </Link>
          <h1 className="mt-4 text-4xl font-bold text-gray-900">{t.title}</h1>
          <p className="mt-2 text-gray-600">{t.lastUpdated}</p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="prose prose-gray max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.acceptanceTitle}</h2>
            <p className="text-gray-600 leading-relaxed">{t.acceptanceDesc}</p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.serviceTitle}</h2>
            <p className="text-gray-600 leading-relaxed">{t.serviceDesc}</p>
            <ul className="mt-4 space-y-2 text-gray-600 list-disc list-inside">
              <li>{t.service1}</li>
              <li>{t.service2}</li>
              <li>{t.service3}</li>
              <li>{t.service4}</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.useTitle}</h2>
            <p className="text-gray-600 leading-relaxed">{t.useDesc}</p>
            <ul className="mt-4 space-y-2 text-gray-600 list-disc list-inside">
              <li>{t.use1}</li>
              <li>{t.use2}</li>
              <li>{t.use3}</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.ipTitle}</h2>
            <p className="text-gray-600 leading-relaxed">{t.ipDesc}</p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.contentTitle}</h2>
            <p className="text-gray-600 leading-relaxed">{t.contentDesc}</p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.disclaimerTitle}</h2>
            <p className="text-gray-600 leading-relaxed">{t.disclaimerDesc}</p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.limitTitle}</h2>
            <p className="text-gray-600 leading-relaxed">{t.limitDesc}</p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.changesTitle}</h2>
            <p className="text-gray-600 leading-relaxed">{t.changesDesc}</p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.privacyTitle}</h2>
            <p className="text-gray-600 leading-relaxed">
              {t.privacyDesc}{' '}
              <Link
                href={`/${locale}/privacy`}
                className="text-blue-600 hover:underline"
              >
                {t.privacyLink}
              </Link>
            </p>
          </section>

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
        </div>
      </main>

      <footer className="border-t border-gray-200 px-4 py-8 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} printmd. All rights reserved.</p>
      </footer>
    </div>
  );
}
