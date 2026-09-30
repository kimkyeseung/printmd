'use client';

import { useParams } from 'next/navigation';
import { defaultLocale, locales, type Locale } from './config';

/*
 * UI strings for the client-side editor app.
 *
 * The page dictionaries in ./dictionaries are loaded on the server per page;
 * the editor is a client component tree, so its strings live here instead of
 * being threaded through props from the page. `en` defines the shape, so a
 * key missing from another locale is a type error.
 */
const en = {
  editor: {
    placeholder: 'Type or paste Markdown here, or drop a .md file.',
  },
};

export type AppStrings = typeof en;

const ko: AppStrings = {
  editor: {
    placeholder: '마크다운을 입력하거나 붙여넣으세요. .md 파일을 끌어다 놓아도 됩니다.',
  },
};

const strings: Record<Locale, AppStrings> = { en, ko };

export function getAppStrings(locale: string | undefined): AppStrings {
  return locales.includes(locale as Locale)
    ? strings[locale as Locale]
    : strings[defaultLocale];
}

export function useAppStrings(): AppStrings {
  const params = useParams();
  return getAppStrings(params?.locale as string | undefined);
}
