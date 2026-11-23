'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { defaultLocale, locales, type Locale } from '@/lib/i18n/config';

/** A link to the feedback page in the current locale. */
export function FeedbackLink(props: Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>) {
  const params = useParams();
  const param = params?.locale as string | undefined;
  const locale: Locale = locales.includes(param as Locale) ? (param as Locale) : defaultLocale;
  return <Link {...props} href={`/${locale}/feedback`} />;
}
