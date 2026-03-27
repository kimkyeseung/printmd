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
  const t = dict.markdownPrint;

  return {
    title: `${t.title} - ${t.subtitle}`,
    description: t.hero.description,
    keywords: locale === 'ko'
      ? ['마크다운 프린트', '마크다운 인쇄', 'markdown print', 'md 인쇄', '마크다운 출력', '마크다운 프린터', '마크다운 인쇄 도구', 'README 인쇄', '마크다운 문서 인쇄', '마크다운 깔끔하게 인쇄', 'md 파일 인쇄', '무료 마크다운 인쇄']
      : ['print markdown', 'markdown print', 'print md file', 'markdown printer', 'print markdown online', 'markdown print tool', 'print md document', 'print readme', 'markdown to printer', 'print markdown free', 'markdown print format', 'print markdown beautifully'],
    openGraph: {
      title: `${t.title} - ${t.subtitle} | printmd`,
      description: t.hero.description,
      url: `https://printmd.app/${locale}/markdown-print`,
    },
    alternates: {
      canonical: `https://printmd.app/${locale}/markdown-print`,
      languages: {
        'ko': 'https://printmd.app/ko/markdown-print',
        'en': 'https://printmd.app/en/markdown-print',
      },
    },
  };
}

export default async function MarkdownPrintPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = isValidLocale(localeParam) ? localeParam : 'en';
  const dict = await getDictionary(locale);
  const t = dict.markdownPrint;

  const softwareJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'printmd - Print Markdown',
    description: t.hero.description,
    url: `https://printmd.app/${locale}/markdown-print`,
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
      <div className="h-screen overflow-y-auto bg-gradient-to-b from-green-50 to-white">
        {/* Hero Section */}
        <header className="px-4 py-16 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            {t.hero.title1}
            <br />
            <span className="text-green-600">{t.hero.title2}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            {t.hero.description}
          </p>
          <div className="mt-10">
            <Link
              href={`/${locale}`}
              className="rounded-lg bg-green-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-green-700"
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

        {/* Steps */}
        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            {t.steps.title}
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            <Step number={1} title={t.steps.step1} description={t.steps.step1Desc} />
            <Step number={2} title={t.steps.step2} description={t.steps.step2Desc} />
            <Step number={3} title={t.steps.step3} description={t.steps.step3Desc} />
          </div>
        </section>

        {/* Why */}
        <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-center text-3xl font-bold text-gray-900">
              {t.why.title}
            </h2>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Feature icon="🎨" title={t.why.syntax} description={t.why.syntaxDesc} />
              <Feature icon="📊" title={t.why.table} description={t.why.tableDesc} />
              <Feature icon="🖼️" title={t.why.image} description={t.why.imageDesc} />
              <Feature icon="📄" title={t.why.pageBreak} description={t.why.pageBreakDesc} />
              <Feature icon="🔢" title={t.why.pageNumber} description={t.why.pageNumberDesc} />
              <Feature icon="🖨️" title={t.why.optimized} description={t.why.optimizedDesc} />
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            {t.useCases.title}
          </h2>
          <div className="mt-12 space-y-6">
            <UseCase emoji="👨‍💻" title={t.useCases.developer} description={t.useCases.developerDesc} />
            <UseCase emoji="📚" title={t.useCases.student} description={t.useCases.studentDesc} />
            <UseCase emoji="✍️" title={t.useCases.writer} description={t.useCases.writerDesc} />
            <UseCase emoji="👔" title={t.useCases.worker} description={t.useCases.workerDesc} />
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
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
            className="mt-8 inline-block rounded-lg bg-green-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-green-700"
          >
            {dict.common.tryNow}
          </Link>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-200 px-4 py-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} printmd. {dict.common.copyright}</p>
          <a
            href="https://buymeacoffee.com/kimkyeseung"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-gray-400 hover:text-[#FFDD00] transition-colors"
          >
            ☕ Buy me a coffee
          </a>
        </footer>
      </div>
    </>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-xl font-bold text-green-600">
        {number}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-gray-600">{description}</p>
    </div>
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
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="text-3xl">{icon}</div>
      <h3 className="mt-3 font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-600">{description}</p>
    </div>
  );
}

function UseCase({
  emoji,
  title,
  description,
}: {
  emoji: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-xl bg-white p-6 shadow-sm">
      <span className="text-3xl">{emoji}</span>
      <div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="mt-1 text-gray-600">{description}</p>
      </div>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group rounded-xl bg-gray-50 shadow-sm">
      <summary className="flex cursor-pointer items-center justify-between px-6 py-4 font-semibold text-gray-900">
        {question}
        <span className="ml-2 text-green-500 transition-transform group-open:rotate-45">+</span>
      </summary>
      <div className="px-6 pb-4 text-sm text-gray-600">
        {answer}
      </div>
    </details>
  );
}
