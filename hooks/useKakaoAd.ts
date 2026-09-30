'use client';

import { useEffect, useRef } from 'react';

const NO_FILL_TIMEOUT_MS = 6000;

/**
 * Mount a Kakao AdFit unit into the returned container.
 *
 * `onNoFill` fires when no ad will show: AdFit reports it has nothing to
 * serve (its `data-ad-onfail` callback), the script itself fails to load
 * (what an ad blocker does), or the slot is still empty after a grace period.
 * Callers use it to collapse the space they
 * reserved for the ad instead of leaving an empty band.
 */
export function useKakaoAd(
  unit: string,
  width: number,
  height: number,
  onNoFill?: () => void
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onNoFillRef = useRef(onNoFill);

  useEffect(() => {
    onNoFillRef.current = onNoFill;
  }, [onNoFill]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const notify = () => onNoFillRef.current?.();
    // AdFit looks the callback up by name on window.
    const callbackName = `__printmdAdNoFill_${unit.replace(/\W/g, '_')}`;
    (window as unknown as Record<string, unknown>)[callbackName] = notify;

    const ins = document.createElement('ins');
    ins.className = 'kakao_ad_area';
    ins.style.display = 'none';
    ins.setAttribute('data-ad-unit', unit);
    ins.setAttribute('data-ad-width', String(width));
    ins.setAttribute('data-ad-height', String(height));
    ins.setAttribute('data-ad-onfail', callbackName);
    container.appendChild(ins);

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//t1.daumcdn.net/kas/static/ba.min.js';
    script.async = true;
    script.onerror = notify;
    container.appendChild(script);

    // AdFit doesn't always report failure: on a domain it doesn't serve it
    // leaves the slot untouched without calling onfail. A filled slot gets
    // its iframe and becomes visible, so anything else after a grace period
    // counts as unfilled.
    const fallback = setTimeout(() => {
      const filled = ins.childElementCount > 0 || ins.style.display !== 'none';
      if (!filled) notify();
    }, NO_FILL_TIMEOUT_MS);

    return () => {
      clearTimeout(fallback);
      delete (window as unknown as Record<string, unknown>)[callbackName];
      container.replaceChildren();
    };
  }, [unit, width, height]);

  return containerRef;
}
