'use client';

import { useParams } from 'next/navigation';
import type { Locale } from '@/lib/i18n/config';

import en from '@/lib/i18n/dictionaries/en.json';
import ko from '@/lib/i18n/dictionaries/ko.json';

const dictionaries: Record<Locale, typeof en> = { en, ko };

export function useClientLocale() {
  const params = useParams();
  const locale = ((params.locale as string) || 'en') as Locale;
  return locale;
}

export function useClientDictionary() {
  const locale = useClientLocale();
  return dictionaries[locale];
}
