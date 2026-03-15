'use client';

import { useEffect, useRef } from 'react';

interface AdKakaoSidebarProps {
  className?: string;
}

export function AdKakaoSidebar({ className = '' }: AdKakaoSidebarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (scriptLoaded.current) return;
    if (!containerRef.current) return;

    scriptLoaded.current = true;

    const ins = document.createElement('ins');
    ins.className = 'kakao_ad_area';
    ins.style.display = 'none';
    ins.setAttribute('data-ad-unit', 'DAN-0fmLNKGB3mREeDek');
    ins.setAttribute('data-ad-width', '160');
    ins.setAttribute('data-ad-height', '600');
    containerRef.current.appendChild(ins);

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//t1.daumcdn.net/kas/static/ba.min.js';
    script.async = true;
    containerRef.current.appendChild(script);
  }, []);

  if (process.env.NODE_ENV === 'development') {
    return (
      <div className={`bg-gray-100 flex items-center justify-center text-gray-400 text-sm ${className}`}>
        <span>Kakao Ad Sidebar (160x600)</span>
      </div>
    );
  }

  return <div ref={containerRef} className={className} />;
}
