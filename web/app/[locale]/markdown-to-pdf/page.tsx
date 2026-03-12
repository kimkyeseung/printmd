import type { Metadata } from 'next';
import Link from 'next/link';
import { locales, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { AdBanner } from '@/components/adsense/AdBanner';

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
  const t = dict.markdownToPdf;

  return {
    title: `${t.title} - ${t.subtitle}`,
    description: t.hero.description,
    keywords: locale === 'ko'
      ? ['마크다운 PDF 변환', '마크다운 to PDF', 'markdown to pdf', 'md to pdf', '마크다운 변환기', '마크다운 PDF 변환기', '마크다운 PDF 저장', 'md 변환', 'md 파일 PDF', '마크다운 PDF 출력', '마크다운 PDF 내보내기', '무료 마크다운 변환', '온라인 마크다운 변환', '마크다운 PDF 무료', 'README PDF 변환']
      : ['markdown to pdf', 'md to pdf', 'markdown converter', 'pdf converter', 'convert markdown to pdf', 'markdown to pdf online', 'markdown to pdf free', 'markdown pdf converter', 'markdown export pdf', 'md to pdf converter', 'md to pdf online', 'markdown file to pdf', 'markdown save as pdf', 'free markdown converter', 'markdown to pdf converter online', 'readme to pdf', 'text to pdf'],
    openGraph: {
      title: `${t.title} - ${t.subtitle} | printmd`,
      description: t.hero.description,
      url: `https://printmd.app/${locale}/markdown-to-pdf`,
    },
    alternates: {
      canonical: `https://printmd.app/${locale}/markdown-to-pdf`,
      languages: {
        'ko': 'https://printmd.app/ko/markdown-to-pdf',
        'en': 'https://printmd.app/en/markdown-to-pdf',
      },
    },
  };
}

export default async function MarkdownToPdfPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = isValidLocale(localeParam) ? localeParam : 'en';
  const dict = await getDictionary(locale);
  const t = dict.markdownToPdf;

  const softwareJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'printmd - Markdown to PDF',
    description: t.hero.description,
    url: `https://printmd.app/${locale}/markdown-to-pdf`,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: t.faq.q1, acceptedAnswer: { '@type': 'Answer', text: t.faq.a1 } },
      { '@type': 'Question', name: t.faq.q2, acceptedAnswer: { '@type': 'Answer', text: t.faq.a2 } },
      { '@type': 'Question', name: t.faq.q3, acceptedAnswer: { '@type': 'Answer', text: t.faq.a3 } },
      { '@type': 'Question', name: t.faq.q4, acceptedAnswer: { '@type': 'Answer', text: t.faq.a4 } },
      { '@type': 'Question', name: t.faq.q5, acceptedAnswer: { '@type': 'Answer', text: t.faq.a5 } },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Hero Section */}
        <header className="px-4 py-16 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            {t.hero.title1}
            <br />
            <span className="text-blue-600">{t.hero.title2}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            {t.hero.description}
          </p>
          <div className="mt-10">
            <Link
              href={`/${locale}`}
              className="rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-blue-700"
            >
              {t.hero.cta}
            </Link>
          </div>
        </header>

        {/* Ad Banner */}
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <AdBanner
            className="h-[90px] w-full rounded-lg overflow-hidden"
            slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BANNER}
          />
        </div>

        {/* Features Grid */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            {t.why.title}
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Feature icon="⚡" title={t.why.fast} description={t.why.fastDesc} />
            <Feature icon="🔒" title={t.why.privacy} description={t.why.privacyDesc} />
            <Feature icon="🎨" title={t.why.themes} description={t.why.themesDesc} />
            <Feature icon="📱" title={t.why.responsive} description={t.why.responsiveDesc} />
          </div>
        </section>

        {/* Supported Features */}
        <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-center text-3xl font-bold text-gray-900">
              {t.supported.title}
            </h2>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <SupportedFeature>{t.supported.headings}</SupportedFeature>
              <SupportedFeature>{t.supported.formatting}</SupportedFeature>
              <SupportedFeature>{t.supported.lists}</SupportedFeature>
              <SupportedFeature>{t.supported.code}</SupportedFeature>
              <SupportedFeature>{t.supported.blockquote}</SupportedFeature>
              <SupportedFeature>{t.supported.table}</SupportedFeature>
              <SupportedFeature>{t.supported.links}</SupportedFeature>
              <SupportedFeature>{t.supported.hr}</SupportedFeature>
              <SupportedFeature>{t.supported.inlineCode}</SupportedFeature>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-3xl font-bold text-gray-900">
              {t.faq.title}
            </h2>
            <div className="mt-12 space-y-4">
              <FaqItem question={t.faq.q1} answer={t.faq.a1} />
              <FaqItem question={t.faq.q2} answer={t.faq.a2} />
              <FaqItem question={t.faq.q3} answer={t.faq.a3} />
              <FaqItem question={t.faq.q4} answer={t.faq.a4} />
              <FaqItem question={t.faq.q5} answer={t.faq.a5} />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">{t.cta.title}</h2>
          <p className="mt-4 text-lg text-gray-600">{t.cta.subtitle}</p>
          <Link
            href={`/${locale}`}
            className="mt-8 inline-block rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-blue-700"
          >
            {dict.common.tryNow}
          </Link>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-200 px-4 py-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} printmd. {dict.common.copyright}</p>
        </footer>
      </div>
    </>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl bg-white p-6 text-center shadow-sm">
      <div className="text-3xl">{icon}</div>
      <h3 className="mt-3 font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-600">{description}</p>
    </div>
  );
}

function SupportedFeature({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-3 shadow-sm">
      <span className="text-green-500">✓</span>
      <span className="text-gray-700">{children}</span>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group rounded-xl bg-white shadow-sm">
      <summary className="flex cursor-pointer items-center justify-between px-6 py-4 font-semibold text-gray-900">
        {question}
        <span className="ml-2 text-blue-500 transition-transform group-open:rotate-45">+</span>
      </summary>
      <div className="px-6 pb-4 text-sm text-gray-600">
        {answer}
      </div>
    </details>
  );
}
