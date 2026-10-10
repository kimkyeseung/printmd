import type { MetadataRoute } from 'next';
import { locales, defaultLocale } from '@/lib/i18n/config';
import { getAllPosts } from '@/lib/blog';
import { presetKeys } from '@/lib/themes/presets';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://printmd.app';
  // Fallback for blog posts without a date.
  const buildDate = new Date();

  /*
   * lastModified is the date the page's content last changed — bump it when
   * you edit a page. Stamping every URL with the build date would make Google
   * ignore lastmod for the whole site, and with it the hint about which pages
   * actually changed.
   */
  const pages = [
    { path: '', lastModified: '2026-10-10', priority: 1, changeFrequency: 'weekly' as const },
    { path: '/markdown-to-pdf', lastModified: '2026-09-30', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/markdown-print', lastModified: '2026-09-30', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/markdown-editor', lastModified: '2026-09-30', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/hwp-to-markdown', lastModified: '2026-10-10', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/blog', lastModified: '2026-09-30', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/guide', lastModified: '2026-09-30', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/about', lastModified: '2026-09-30', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/github', lastModified: '2026-09-30', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/presets', lastModified: '2026-09-30', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/cheatsheet', lastModified: '2026-09-30', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/themes/colors', lastModified: '2026-09-30', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/themes/table-styling', lastModified: '2026-09-30', priority: 0.7, changeFrequency: 'monthly' as const },
    // Per-theme preset detail pages
    ...presetKeys.map((theme) => ({
      path: `/presets/${theme}`,
      lastModified: '2026-09-30',
      priority: 0.6,
      changeFrequency: 'monthly' as const,
    })),
    { path: '/terms', lastModified: '2026-09-30', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/privacy', lastModified: '2026-09-30', priority: 0.3, changeFrequency: 'yearly' as const },
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const page of pages) {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${page.path}`,
        lastModified: new Date(page.lastModified),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: {
          languages: {
            ko: `${baseUrl}/ko${page.path}`,
            en: `${baseUrl}/en${page.path}`,
            'x-default': `${baseUrl}/en${page.path}`,
          },
        },
      });
    }
  }

  // Add blog post pages with actual publish dates
  const postsByLocale = Object.fromEntries(
    locales.map((locale) => [
      locale,
      new Map(getAllPosts(locale).map((p) => [p.slug, p.date])),
    ])
  );

  for (const locale of locales) {
    for (const [slug, date] of postsByLocale[locale]) {
      const languages: Record<string, string> = {};
      for (const altLocale of locales) {
        if (postsByLocale[altLocale].has(slug)) {
          languages[altLocale] = `${baseUrl}/${altLocale}/blog/${slug}`;
        }
      }
      // Fall back to the default locale for users whose language we don't serve.
      if (languages[defaultLocale]) {
        languages['x-default'] = languages[defaultLocale];
      }

      sitemapEntries.push({
        url: `${baseUrl}/${locale}/blog/${slug}`,
        lastModified: date ? new Date(date) : buildDate,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
        alternates: { languages },
      });
    }
  }

  return sitemapEntries;
}
