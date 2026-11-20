import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { buildPageMetadata, localeUrl } from '@/lib/seo/metadata';
import { locales, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { SiteFooter } from '@/components/layout';
import { CHANGELOG, CHANGELOG_PAGE, changelogImageSrc, type ChangeKind } from '@/lib/changelog';

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
  const t = CHANGELOG_PAGE[locale];

  return buildPageMetadata({
    locale,
    path: '/changelog',
    title: t.title,
    description: t.description,
    keywords: t.keywords,
  });
}

const KIND_STYLE: Record<ChangeKind, string> = {
  new: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  improved: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  fixed: 'bg-amber-50 text-amber-800 ring-amber-600/20',
};

const KIND_ORDER: ChangeKind[] = ['new', 'improved', 'fixed'];

function formatDate(date: string, locale: Locale): string {
  const [y, m, d] = date.split('-').map(Number);
  // Dates are calendar days, so format them in UTC to avoid shifting a day.
  return new Intl.DateTimeFormat(locale === 'ko' ? 'ko-KR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(y, m - 1, d)));
}

export default async function ChangelogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = isValidLocale(localeParam) ? localeParam : 'en';
  const dict = await getDictionary(locale);
  const t = CHANGELOG_PAGE[locale];
  const pageUrl = localeUrl(locale, '/changelog');

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: t.heading,
      description: t.description,
      url: pageUrl,
      inLanguage: locale,
      keywords: t.keywords.join(', '),
      hasPart: CHANGELOG.map((entry) => ({
        '@type': 'BlogPosting',
        headline: entry.title[locale],
        description: entry.summary[locale],
        datePublished: entry.date,
        url: `${pageUrl}#${entry.date}`,
        image: entry.images?.map((image) => `https://printmd.app${changelogImageSrc(entry, image, locale)}`),
        author: { '@type': 'Organization', name: 'printmd' },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'printmd', item: localeUrl(locale, '') },
        { '@type': 'ListItem', position: 2, name: t.title, item: pageUrl },
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
          <Link href={`/${locale}`} className="text-sm text-blue-600 hover:text-blue-700">
            ← printmd
          </Link>
          <h1 className="mt-4 text-4xl font-bold text-gray-900">{t.heading}</h1>
          <p className="mt-2 text-gray-600">{t.description}</p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Jump list: one line per release, newest first. */}
        <nav aria-label={t.title} className="mb-12 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <ol className="flex flex-col gap-1.5 text-sm">
            {CHANGELOG.map((entry) => (
              <li key={entry.date} className="flex gap-3">
                <time dateTime={entry.date} className="w-24 shrink-0 tabular-nums text-gray-500">
                  {entry.date.replaceAll('-', '.')}
                </time>
                <a href={`#${entry.date}`} className="text-gray-800 hover:text-blue-700 hover:underline">
                  {entry.title[locale]}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <ol className="flex flex-col gap-14">
          {CHANGELOG.map((entry) => (
            <li key={entry.date}>
              <article id={entry.date} className="scroll-mt-6">
                <time dateTime={entry.date} className="text-sm font-medium text-gray-500">
                  {formatDate(entry.date, locale)}
                </time>
                <h2 className="mt-1 text-2xl font-bold text-gray-900">
                  <a href={`#${entry.date}`} className="hover:underline">
                    {entry.title[locale]}
                  </a>
                </h2>
                <p className="mt-3 leading-relaxed text-gray-600">{entry.summary[locale]}</p>

                {entry.images?.map((image, i) => (
                  <figure key={image.name} className="mt-6">
                    {/* Wide captures shrink a lot; clicking opens the full size. */}
                    <a href={changelogImageSrc(entry, image, locale)} target="_blank" rel="noopener" className="block">
                    <Image
                      src={changelogImageSrc(entry, image, locale)}
                      alt={image.alt[locale]}
                      width={image.size[locale][0]}
                      height={image.size[locale][1]}
                      sizes="(max-width: 768px) 100vw, 768px"
                      // Only the first shot is likely above the fold.
                      priority={i === 0}
                      className="h-auto w-full rounded-lg border border-gray-200 shadow-sm transition-shadow hover:shadow-md"
                    />
                    </a>
                    <figcaption className="mt-2 text-center text-sm text-gray-500">
                      {image.caption[locale]}
                    </figcaption>
                  </figure>
                ))}

                {KIND_ORDER.map((kind) => {
                  const items = entry.changes.filter((c) => c.kind === kind);
                  if (items.length === 0) return null;
                  return (
                    <section key={kind} className="mt-6">
                      <h3>
                        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${KIND_STYLE[kind]}`}>
                          {t.kinds[kind]}
                        </span>
                      </h3>
                      <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-gray-700 marker:text-gray-300">
                        {items.map((item) => (
                          <li key={item.text.en} className="leading-relaxed">{item.text[locale]}</li>
                        ))}
                      </ul>
                    </section>
                  );
                })}
              </article>
            </li>
          ))}
        </ol>

        <section className="mt-16 border-t border-gray-200 py-8 text-center">
          <p className="mb-4 text-gray-600">{t.cta}</p>
          <Link
            href={`/${locale}`}
            className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
          >
            {t.ctaButton}
          </Link>
        </section>
      </main>
      <SiteFooter locale={locale} dict={dict.footer} />
    </div>
  );
}
