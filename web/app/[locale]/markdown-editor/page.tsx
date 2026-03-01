import type { Metadata } from 'next';
import Link from 'next/link';
import { locales, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';

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
  const t = dict.markdownEditor;

  return {
    title: `${t.title} - ${t.subtitle}`,
    description: t.hero.description,
    keywords: locale === 'ko'
      ? ['마크다운 편집기', '마크다운 에디터', 'markdown editor', '온라인 마크다운']
      : ['markdown editor', 'online markdown editor', 'md editor', 'free markdown editor'],
    openGraph: {
      title: `${t.title} - ${t.subtitle} | printmd`,
      description: t.hero.description,
      url: `https://printmd.app/${locale}/markdown-editor`,
    },
    alternates: {
      canonical: `https://printmd.app/${locale}/markdown-editor`,
      languages: {
        'ko': 'https://printmd.app/ko/markdown-editor',
        'en': 'https://printmd.app/en/markdown-editor',
      },
    },
  };
}

export default async function MarkdownEditorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = isValidLocale(localeParam) ? localeParam : 'ko';
  const dict = await getDictionary(locale);
  const t = dict.markdownEditor;

  const softwareJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'printmd - Markdown Editor',
    description: t.hero.description,
    url: `https://printmd.app/${locale}/markdown-editor`,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
        {/* Hero Section */}
        <header className="px-4 py-16 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            {t.hero.title1}
            <br />
            <span className="text-purple-600">{t.hero.title2}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            {t.hero.description}
          </p>
          <div className="mt-10">
            <Link
              href={`/${locale}`}
              className="rounded-lg bg-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-purple-700"
            >
              {t.hero.cta}
            </Link>
          </div>
        </header>

        {/* Editor Preview */}
        <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
            <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <div className="h-3 w-3 rounded-full bg-green-400" />
              <span className="ml-2 text-sm text-gray-500">printmd</span>
            </div>
            <div className="grid sm:grid-cols-2">
              <div className="border-r border-gray-200 bg-gray-900 p-4 font-mono text-sm text-gray-300">
                <div className="text-purple-400"># Hello printmd</div>
                <div className="mt-2">Markdown **live preview**</div>
                <div className="mt-2 text-gray-500">```javascript</div>
                <div className="text-green-400">const editor = &apos;awesome&apos;;</div>
                <div className="text-gray-500">```</div>
              </div>
              <div className="bg-white p-4">
                <h1 className="text-2xl font-bold">Hello printmd</h1>
                <p className="mt-2">
                  Markdown <strong>live preview</strong>
                </p>
                <pre className="mt-2 rounded bg-gray-100 p-2 text-sm">
                  <code className="text-purple-600">const</code>{' '}
                  <span className="text-blue-600">editor</span> ={' '}
                  <span className="text-green-600">&apos;awesome&apos;</span>;
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            {t.features.title}
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Feature icon="⚡" title={t.features.preview} description={t.features.previewDesc} />
            <Feature icon="🎨" title={t.features.themes} description={t.features.themesDesc} />
            <Feature icon="💡" title={t.features.syntax} description={t.features.syntaxDesc} />
            <Feature icon="📱" title={t.features.responsive} description={t.features.responsiveDesc} />
            <Feature icon="⌨️" title={t.features.shortcuts} description={t.features.shortcutsDesc} />
            <Feature icon="📂" title={t.features.dragDrop} description={t.features.dragDropDesc} />
          </div>
        </section>

        {/* Keyboard Shortcuts */}
        <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-3xl font-bold text-gray-900">
              {t.shortcuts.title}
            </h2>
            <div className="mt-12 overflow-hidden rounded-xl bg-white shadow-sm">
              <table className="w-full">
                <tbody className="divide-y divide-gray-200">
                  <Shortcut keys="Ctrl + S" action={t.shortcuts.save} />
                  <Shortcut keys="Ctrl + P" action={t.shortcuts.print} />
                  <Shortcut keys="Ctrl + ," action={t.shortcuts.style} />
                  <Shortcut keys="F11" action={t.shortcuts.fullscreen} />
                  <Shortcut keys="Esc" action={t.shortcuts.close} />
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-center text-sm text-gray-500">
              {t.shortcuts.macNote}
            </p>
          </div>
        </section>

        {/* Comparison */}
        <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            {t.compare.title}
          </h2>
          <div className="mt-12 overflow-hidden rounded-xl bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">
                    {t.compare.feature}
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-purple-600">
                    printmd
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-500">
                    {locale === 'ko' ? '기타' : 'Others'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <CompareRow feature={t.compare.install} printmd="❌" others="✅" />
                <CompareRow feature={t.compare.signup} printmd="❌" others="✅" />
                <CompareRow feature={t.compare.preview} printmd="✅" others="✅" />
                <CompareRow feature={t.compare.pdf} printmd="✅" others="💰" />
                <CompareRow feature={t.compare.customTheme} printmd="✅" others="💰" />
                <CompareRow feature={t.compare.offline} printmd="✅" others="❌" />
                <CompareRow feature={t.compare.privacy} printmd="✅" others="❓" />
              </tbody>
            </table>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">{t.cta.title}</h2>
          <p className="mt-4 text-lg text-gray-600">{t.cta.subtitle}</p>
          <Link
            href={`/${locale}`}
            className="mt-8 inline-block rounded-lg bg-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-purple-700"
          >
            {t.hero.cta}
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
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="text-3xl">{icon}</div>
      <h3 className="mt-3 font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-600">{description}</p>
    </div>
  );
}

function Shortcut({ keys, action }: { keys: string; action: string }) {
  return (
    <tr>
      <td className="px-6 py-3">
        <kbd className="rounded bg-gray-100 px-2 py-1 font-mono text-sm">
          {keys}
        </kbd>
      </td>
      <td className="px-6 py-3 text-gray-600">{action}</td>
    </tr>
  );
}

function CompareRow({
  feature,
  printmd,
  others,
}: {
  feature: string;
  printmd: string;
  others: string;
}) {
  return (
    <tr>
      <td className="px-4 py-3 text-gray-700">{feature}</td>
      <td className="px-4 py-3 text-center">{printmd}</td>
      <td className="px-4 py-3 text-center">{others}</td>
    </tr>
  );
}
