'use client';

import { useKakaoAd } from '@/hooks/useKakaoAd';

interface AdKakaoBannerProps {
  className?: string;
  /** Called when no ad will show, so the caller can collapse the slot. */
  onNoFill?: () => void;
}

export function AdKakaoBanner({ className = '', onNoFill }: AdKakaoBannerProps) {
  const containerRef = useKakaoAd('DAN-NSUrBUs7hoz03eCb', 728, 90, onNoFill);

  if (process.env.NODE_ENV === 'development') {
    return (
      <div className={`bg-gray-100 flex items-center justify-center text-gray-400 text-sm ${className}`}>
        <span>Kakao Ad Banner (728x90)</span>
      </div>
    );
  }

  return <div ref={containerRef} className={className} />;
}
