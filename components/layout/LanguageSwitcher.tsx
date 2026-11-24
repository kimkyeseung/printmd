'use client';

import { useParams, usePathname } from 'next/navigation';
import { defaultLocale, isLocale, LOCALE_COOKIE, localeNames, locales, type Locale } from '@/lib/i18n/config';

const LABEL: Record<Locale, string> = {
  en: 'Language',
  ko: '언어',
  zh: '语言',
  ja: '言語',
};

/** `/ko/guide` → `/ja/guide`. Paths without a locale prefix get one. */
export function switchLocalePath(pathname: string, locale: Locale): string {
  const rest = pathname.replace(new RegExp(`^/(${locales.join('|')})(?=/|$)`), '');
  return `/${locale}${rest === '/' ? '' : rest}`;
}

/**
 * Language picker: the same page in another locale. The choice is also kept in
 * a cookie so a later visit to `/` lands in that language (see proxy.ts).
 */
export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const params = useParams();
  const pathname = usePathname() ?? '/';
  const current: Locale = isLocale(params?.locale) ? params.locale : defaultLocale;

  function change(next: Locale) {
    if (next === current) return;
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    // Each locale has its own root layout (<html lang>), so this is a full
    // page load either way; keep the query and the #anchor.
    window.location.assign(switchLocalePath(pathname, next) + window.location.search + window.location.hash);
  }

  return (
    <label className={`inline-flex items-center gap-1.5 ${className}`}>
      <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3.6 9h16.8M3.6 15h16.8M12 3a15 15 0 010 18M12 3a15 15 0 000 18M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span className="sr-only">{LABEL[current]}</span>
      <select
        value={current}
        onChange={(e) => change(e.target.value as Locale)}
        className="cursor-pointer appearance-none bg-transparent py-1 pr-1 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        {locales.map((l) => (
          <option key={l} value={l} lang={l}>
            {localeNames[l]}
          </option>
        ))}
      </select>
    </label>
  );
}
