import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';

export interface FooterDict {
  privacy: string;
  terms: string;
  about: string;
  contact: string;
  allRights: string;
  toolsHeading: string;
  learnHeading: string;
  siteHeading: string;
  markdownToPdf: string;
  markdownPrint: string;
  markdownEditor: string;
  github: string;
  presets: string;
  themeColors: string;
  themeTables: string;
  guide: string;
  cheatsheet: string;
  blog: string;
}

export function SiteFooter({
  locale,
  dict,
}: {
  locale: Locale;
  dict: FooterDict;
}) {
  const columns = [
    {
      heading: dict.toolsHeading,
      links: [
        { href: `/${locale}/markdown-to-pdf`, label: dict.markdownToPdf },
        { href: `/${locale}/markdown-print`, label: dict.markdownPrint },
        { href: `/${locale}/markdown-editor`, label: dict.markdownEditor },
        { href: `/${locale}/github`, label: dict.github },
      ],
    },
    {
      heading: dict.learnHeading,
      links: [
        { href: `/${locale}/guide`, label: dict.guide },
        { href: `/${locale}/cheatsheet`, label: dict.cheatsheet },
        { href: `/${locale}/blog`, label: dict.blog },
      ],
    },
    {
      heading: dict.presets,
      links: [
        { href: `/${locale}/presets`, label: dict.presets },
        { href: `/${locale}/themes/colors`, label: dict.themeColors },
        { href: `/${locale}/themes/table-styling`, label: dict.themeTables },
      ],
    },
    {
      heading: dict.siteHeading,
      links: [
        { href: `/${locale}/about`, label: dict.about },
        { href: `/${locale}/privacy`, label: dict.privacy },
        { href: `/${locale}/terms`, label: dict.terms },
      ],
    },
  ];

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <nav className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
          {columns.map((column) => (
            <div key={column.heading}>
              <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {column.heading}
              </h2>
              <ul className="mt-3 space-y-2 text-sm">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="mt-10 flex flex-col items-center gap-3 border-t border-gray-200 dark:border-gray-800 pt-6 text-xs text-gray-500 sm:flex-row sm:justify-between">
          <p>&copy; {new Date().getFullYear()} printmd. {dict.allRights}</p>
          <div className="flex items-center gap-4">
            <a
              href="mailto:contact@printmd.app"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              {dict.contact}
            </a>
            <a
              href="https://buymeacoffee.com/kimkyeseung"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-gray-400 hover:text-[#FFDD00] transition-colors"
            >
              ☕ Buy me a coffee
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
