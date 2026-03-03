'use client';

import { useEffect, useRef } from 'react';

interface AdMobileProps {
  className?: string;
  slot?: string;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export function AdMobile({ className = '', slot = '' }: AdMobileProps) {
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    const adElement = adRef.current;
    if (!adElement) return;

    // Check if ad is already loaded
    if (adElement.dataset.adsbygoogleStatus) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Ignore - ad already loaded
    }
  }, []);

  // Don't render in development
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className={`bg-gray-100 flex items-center justify-center text-gray-400 text-sm ${className}`}>
        <span>Ad Mobile (320x50)</span>
      </div>
    );
  }

  return (
    <div className={className}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
