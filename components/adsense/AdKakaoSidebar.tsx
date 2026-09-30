'use client';

import { useKakaoAd } from '@/hooks/useKakaoAd';

interface AdKakaoSidebarProps {
  className?: string;
  /** Called when no ad will show, so the caller can collapse the slot. */
  onNoFill?: () => void;
}

export function AdKakaoSidebar({ className = '', onNoFill }: AdKakaoSidebarProps) {
  const containerRef = useKakaoAd('DAN-0fmLNKGB3mREeDek', 160, 600, onNoFill);

  if (process.env.NODE_ENV === 'development') {
    return (
      <div className={`bg-gray-100 flex items-center justify-center text-gray-400 text-sm ${className}`}>
        <span>Kakao Ad Sidebar (160x600)</span>
      </div>
    );
  }

  return <div ref={containerRef} className={className} />;
}
