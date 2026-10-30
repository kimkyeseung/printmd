export const FEEDBACK_EMAIL = 'kimkyeseung@gmail.com';

export interface FeedbackEnvironment {
  page: string;
  browser: string;
  language: string;
  screen: string;
}

/** What the browser can tell about where the feedback comes from. */
export function currentEnvironment(): FeedbackEnvironment {
  return {
    page: window.location.href,
    browser: navigator.userAgent,
    language: navigator.language,
    screen: `${window.innerWidth}×${window.innerHeight} @${window.devicePixelRatio}x`,
  };
}

/**
 * A mailto: link to the feedback address. With `env`, the body starts with
 * room for the message and ends with the details a bug report needs, so they
 * don't have to be asked for afterwards.
 */
export function feedbackMailto(
  strings: { subject: string; bodyIntro: string; envHeading: string },
  env?: FeedbackEnvironment,
): string {
  const params = [`subject=${encodeURIComponent(strings.subject)}`];
  if (env) {
    const body = [
      strings.bodyIntro,
      '',
      '',
      '',
      strings.envHeading,
      `Page: ${env.page}`,
      `Browser: ${env.browser}`,
      `Language: ${env.language}`,
      `Screen: ${env.screen}`,
    ].join('\n');
    params.push(`body=${encodeURIComponent(body)}`);
  }
  return `mailto:${FEEDBACK_EMAIL}?${params.join('&')}`;
}
