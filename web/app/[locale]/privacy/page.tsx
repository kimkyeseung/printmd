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
  const t = dict.privacy;

  return {
    title: `${t.title} - printmd`,
    description: t.description,
    openGraph: {
      title: `${t.title} | printmd`,
      description: t.description,
      url: `https://printmd.app/${locale}/privacy`,
    },
    alternates: {
      canonical: `https://printmd.app/${locale}/privacy`,
      languages: {
        'ko': 'https://printmd.app/ko/privacy',
        'en': 'https://printmd.app/en/privacy',
      },
    },
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = isValidLocale(localeParam) ? localeParam : 'en';
  return (
    <div className="h-screen overflow-y-auto bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Link
            href={`/${locale}`}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            ← Back to printmd
          </Link>
          <h1 className="mt-4 text-4xl font-bold text-gray-900">
            Privacy Policy
          </h1>
          <p className="mt-2 text-gray-600">
            Last updated: March 2025
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="prose prose-gray max-w-none">

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
            <p className="text-gray-600 leading-relaxed">
              printmd (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, and safeguard your information
              when you use our web service (printmd.app) and Chrome extension.
            </p>
            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-800 font-medium">
                TL;DR: We don&apos;t collect your personal data. Everything happens in your browser.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Don&apos;t Collect</h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <span>We do <strong>not</strong> collect your markdown content or documents</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <span>We do <strong>not</strong> track your browsing history</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <span>We do <strong>not</strong> require account registration</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-1">✓</span>
                <span>We do <strong>not</strong> sell or share any user data</span>
              </li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h2>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Web Service (printmd.app)</h3>
            <ul className="space-y-2 text-gray-600 list-disc list-inside">
              <li>All markdown processing happens entirely in your browser</li>
              <li>Your content is stored only in your browser&apos;s LocalStorage</li>
              <li>No data is sent to our servers</li>
              <li>PDF generation uses your browser&apos;s built-in print functionality</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Chrome Extension</h3>
            <ul className="space-y-2 text-gray-600 list-disc list-inside">
              <li>The extension only activates on GitHub pages you visit</li>
              <li>Markdown content is fetched directly from GitHub&apos;s public raw URLs</li>
              <li>Content is transferred to printmd.app via URL parameters or browser storage</li>
              <li>Recent files list is stored locally in chrome.storage</li>
              <li>No data is sent to external servers other than GitHub (for raw content)</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Extension Permissions</h2>
            <p className="text-gray-600 mb-4">
              Our Chrome extension requests the following permissions:
            </p>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900">github.com access</h4>
                <p className="text-gray-600 text-sm mt-1">
                  Required to inject the &quot;Open in printmd&quot; button on GitHub markdown pages.
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900">raw.githubusercontent.com access</h4>
                <p className="text-gray-600 text-sm mt-1">
                  Required to fetch the raw markdown content from GitHub.
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900">storage</h4>
                <p className="text-gray-600 text-sm mt-1">
                  Required to save your recently opened files list locally.
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900">contextMenus</h4>
                <p className="text-gray-600 text-sm mt-1">
                  Required to add &quot;Open in printmd&quot; option to right-click menu.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Services</h2>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Google AdSense</h3>
            <p className="text-gray-600">
              We display advertisements through Google AdSense on the web service.
              Google may use cookies to serve ads based on your prior visits.
              You can opt out of personalized advertising by visiting{' '}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Google Ads Settings
              </a>.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Google Analytics</h3>
            <p className="text-gray-600">
              We use Google Analytics to understand how visitors use our website.
              This collects anonymous usage data such as pages visited and time spent.
              No personally identifiable information is collected.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Storage</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 pr-4 font-semibold text-gray-900">Data</th>
                    <th className="py-3 pr-4 font-semibold text-gray-900">Location</th>
                    <th className="py-3 font-semibold text-gray-900">Duration</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  <tr className="border-b border-gray-100">
                    <td className="py-3 pr-4">Markdown content</td>
                    <td className="py-3 pr-4">Browser LocalStorage</td>
                    <td className="py-3">Until you clear browser data</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 pr-4">Style settings</td>
                    <td className="py-3 pr-4">Browser LocalStorage</td>
                    <td className="py-3">Until you clear browser data</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 pr-4">Recent files (extension)</td>
                    <td className="py-3 pr-4">chrome.storage.local</td>
                    <td className="py-3">Until extension is removed</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
            <p className="text-gray-600">
              Since all your data is stored locally in your browser, you have full control:
            </p>
            <ul className="mt-4 space-y-2 text-gray-600 list-disc list-inside">
              <li>Clear your browser&apos;s LocalStorage to delete all saved content</li>
              <li>Remove the Chrome extension to delete all extension data</li>
              <li>Use browser privacy settings to control cookies and tracking</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact</h2>
            <p className="text-gray-600">
              If you have any questions about this Privacy Policy, please contact us at:{' '}
              <a
                href="mailto:privacy@printmd.app"
                className="text-blue-600 hover:underline"
              >
                privacy@printmd.app
              </a>
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
            <p className="text-gray-600">
              We may update this Privacy Policy from time to time. We will notify you of any
              changes by posting the new Privacy Policy on this page and updating the
              &quot;Last updated&quot; date.
            </p>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 px-4 py-8 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} printmd. All rights reserved.</p>
      </footer>
    </div>
  );
}
