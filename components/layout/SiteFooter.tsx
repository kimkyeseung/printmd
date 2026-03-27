import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';

interface FooterDict {
  privacy: string;
  terms: string;
  about: string;
  contact: string;
  allRights: string;
}

export function SiteFooter({
  locale,
  dict,
}: {
  locale: Locale;
  dict: FooterDict;
}) {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 px-4 py-8">
      <div className="mx-auto max-w-4xl flex flex-col items-center gap-4">
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          <Link
            href={`/${locale}/about`}
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            {dict.about}
          </Link>
          <Link
            href={`/${locale}/privacy`}
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            {dict.privacy}
          </Link>
          <Link
            href={`/${locale}/terms`}
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            {dict.terms}
          </Link>
          <a
            href="mailto:contact@printmd.app"
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            {dict.contact}
          </a>
        </nav>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} printmd. {dict.allRights}</p>
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
    </footer>
  );
}
