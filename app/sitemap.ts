import type { MetadataRoute } from 'next';
import { locales } from '@/lib/i18n/config';
import { getAllPosts } from '@/lib/blog';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://printmd.app';
  const lastModified = new Date();

  const pages = [
    { path: '', priority: 1, changeFrequency: 'weekly' as const },
    { path: '/markdown-to-pdf', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/markdown-print', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/markdown-editor', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/blog', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/guide', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/about', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/github', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/presets', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/cheatsheet', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const page of pages) {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${page.path}`,
        lastModified,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: {
          languages: {
            ko: `${baseUrl}/ko${page.path}`,
            en: `${baseUrl}/en${page.path}`,
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

      sitemapEntries.push({
        url: `${baseUrl}/${locale}/blog/${slug}`,
        lastModified: date ? new Date(date) : lastModified,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
        alternates: { languages },
      });
    }
  }

  return sitemapEntries;
}
