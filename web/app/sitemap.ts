import type { MetadataRoute } from 'next';
import { locales } from '@/lib/i18n/config';
import { getPostSlugs } from '@/lib/blog';

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

  // Add blog post pages (only include alternates for slugs that exist in both locales)
  const slugsByLocale = Object.fromEntries(
    locales.map((locale) => [locale, new Set(getPostSlugs(locale))])
  );

  for (const locale of locales) {
    for (const slug of slugsByLocale[locale]) {
      const languages: Record<string, string> = {};
      for (const altLocale of locales) {
        if (slugsByLocale[altLocale].has(slug)) {
          languages[altLocale] = `${baseUrl}/${altLocale}/blog/${slug}`;
        }
      }

      sitemapEntries.push({
        url: `${baseUrl}/${locale}/blog/${slug}`,
        lastModified,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
        alternates: { languages },
      });
    }
  }

  return sitemapEntries;
}
