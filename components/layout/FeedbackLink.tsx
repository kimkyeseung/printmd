'use client';

import { useAppStrings } from '@/lib/i18n/appStrings';
import { currentEnvironment, feedbackMailto } from '@/lib/feedback/mailto';

/**
 * A mail link to the feedback address. The page and browser details are only
 * known in the browser, so they are added to the link when it is clicked;
 * the rendered href carries just the subject and matches the server's.
 */
export function FeedbackLink(props: Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>) {
  const t = useAppStrings().shell;
  const strings = { subject: t.feedbackSubject, bodyIntro: t.feedbackBodyIntro, envHeading: t.feedbackEnvHeading };
  return (
    <a
      {...props}
      href={feedbackMailto(strings)}
      onClick={(e) => {
        e.currentTarget.href = feedbackMailto(strings, currentEnvironment());
        props.onClick?.(e);
      }}
    />
  );
}
