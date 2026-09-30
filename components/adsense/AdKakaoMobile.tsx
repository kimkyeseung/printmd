'use client';

import { useKakaoAd } from '@/hooks/useKakaoAd';

interface AdKakaoMobileProps {
  className?: string;
  /** Called when no ad will show, so the caller can collapse the slot. */
  onNoFill?: () => void;
}

export function AdKakaoMobile({ className = '', onNoFill }: AdKakaoMobileProps) {
  const containerRef = useKakaoAd('DAN-BRzfhtHBdDeIxS6J', 320, 50, onNoFill);

  if (process.env.NODE_ENV === 'development') {
    return (
      <div className={`bg-gray-100 flex items-center justify-center text-gray-400 text-sm ${className}`}>
        <span>Kakao Ad Mobile (320x50)</span>
      </div>
    );
  }

  return <div ref={containerRef} className={className} />;
}
