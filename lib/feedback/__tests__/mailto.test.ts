import { describe, it, expect } from 'vitest';
import { feedbackMailto, FEEDBACK_EMAIL } from '../mailto';

const strings = { subject: '[printmd] Feedback', bodyIntro: 'Write here:', envHeading: '--- info ---' };

describe('feedbackMailto', () => {
  it('links to the feedback address with only a subject by default', () => {
    expect(feedbackMailto(strings)).toBe(`mailto:${FEEDBACK_EMAIL}?subject=%5Bprintmd%5D%20Feedback`);
  });

  it('adds the environment to the body', () => {
    const href = feedbackMailto(strings, {
      page: 'https://printmd.app/en',
      browser: 'TestBrowser/1.0',
      language: 'en-US',
      screen: '1400×900 @2x',
    });
    const body = decodeURIComponent(new URL(href).searchParams.get('body') ?? '');
    expect(body.startsWith('Write here:')).toBe(true);
    expect(body).toContain('--- info ---');
    expect(body).toContain('Page: https://printmd.app/en');
    expect(body).toContain('Browser: TestBrowser/1.0');
    expect(body).toContain('Screen: 1400×900 @2x');
  });
});
