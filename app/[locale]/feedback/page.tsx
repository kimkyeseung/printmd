import type { Metadata } from 'next';
import Link from 'next/link';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { locales, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { SiteFooter } from '@/components/layout';
import { FeedbackForm } from '@/components/feedback/FeedbackForm';
import { FEEDBACK_STRINGS } from '@/lib/feedback/strings';

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
  const t = FEEDBACK_STRINGS[locale];

  return buildPageMetadata({
    locale,
    path: '/feedback',
    title: t.title,
    description: t.description,
  });
}

export default async function FeedbackPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = isValidLocale(localeParam) ? localeParam : 'en';
  const dict = await getDictionary(locale);
  const t = FEEDBACK_STRINGS[locale];

  return (
    <div className="h-screen overflow-y-auto bg-white">
      <header className="border-b border-gray-200 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <Link href={`/${locale}`} className="text-sm text-blue-600 hover:text-blue-700">
            {t.back}
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">{t.heading}</h1>
          <p className="mt-2 text-gray-600">{t.intro}</p>
        </div>
      </header>

      <main className="relative mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
        <FeedbackForm locale={locale} />
      </main>
      <SiteFooter locale={locale} dict={dict.footer} />
    </div>
  );
}
