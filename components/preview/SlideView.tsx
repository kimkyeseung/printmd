'use client';

import { memo, useMemo, useEffect, useRef, useCallback } from 'react';
import { parseMarkdown } from '@/lib/markdown/parser';
import { sanitizeHtml } from '@/lib/markdown/sanitizer';
import { generateElementStylesCss } from '@/lib/themes';
import { useStyleStore } from '@/stores';
import type { GlobalStyles } from '@/types/style';

interface SlideViewProps {
  slides: string[];
  currentSlide: number;
  totalSlides: number;
  styles: GlobalStyles;
  onNext: () => void;
  onPrev: () => void;
  onExit: () => void;
  onGoToSlide: (n: number) => void;
}

export const SlideView = memo(function SlideView({
  slides,
  currentSlide,
  totalSlides,
  styles,
  onNext,
  onPrev,
  onExit,
}: SlideViewProps) {
  const articleRef = useRef<HTMLElement>(null);
  const elementStyles = useStyleStore((state) => state.elementStyles);

  const elementStylesCss = useMemo(
    () => generateElementStylesCss(elementStyles),
    [elementStyles],
  );

  const html = useMemo(() => {
    const slideContent = slides[currentSlide] || '';
    const parsed = parseMarkdown(slideContent);
    return sanitizeHtml(parsed);
  }, [slides, currentSlide]);

  // Update article innerHTML when html changes
  useEffect(() => {
    if (articleRef.current) {
      articleRef.current.innerHTML = html;
    }
  }, [html]);

  // Prevent body scroll when slide mode is active
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      // Only close if clicking the backdrop itself, not the slide content
      if (e.target === e.currentTarget) {
        onExit();
      }
    },
    [onExit],
  );

  const cssVariables = useMemo(
    () =>
      ({
        '--preview-font-size': `${styles.fontSize}px`,
        '--preview-font-family': styles.fontFamily,
        '--preview-text-color': styles.textColor,
        '--preview-bg-color': styles.backgroundColor,
        '--preview-line-height': styles.lineHeight,
        '--preview-link-color': styles.linkColor,
        '--preview-code-bg': styles.codeBackground,
        '--preview-max-width': `${styles.maxWidth}px`,
        '--preview-padding-top': `${styles.padding.top}px`,
        '--preview-padding-right': `${styles.padding.right}px`,
        '--preview-padding-bottom': `${styles.padding.bottom}px`,
        '--preview-padding-left': `${styles.padding.left}px`,
      }) as React.CSSProperties,
    [
      styles.fontSize,
      styles.fontFamily,
      styles.textColor,
      styles.backgroundColor,
      styles.lineHeight,
      styles.linkColor,
      styles.codeBackground,
      styles.maxWidth,
      styles.padding.top,
      styles.padding.right,
      styles.padding.bottom,
      styles.padding.left,
    ],
  );

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
      onClick={handleBackdropClick}
    >
      {/* Exit button */}
      <button
        onClick={onExit}
        className="absolute top-4 right-4 z-10 rounded-full p-2 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        aria-label="Exit slide mode (Escape)"
        title="Exit (Esc)"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Left navigation arrow */}
      <button
        onClick={onPrev}
        disabled={currentSlide === 0}
        className="absolute left-2 sm:left-6 z-10 rounded-full p-2 sm:p-3 text-white/50 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-20 disabled:cursor-default"
        aria-label="Previous slide"
      >
        <svg className="h-6 w-6 sm:h-8 sm:w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Right navigation arrow */}
      <button
        onClick={onNext}
        disabled={currentSlide === totalSlides - 1}
        className="absolute right-2 sm:right-6 z-10 rounded-full p-2 sm:p-3 text-white/50 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-20 disabled:cursor-default"
        aria-label="Next slide"
      >
        <svg className="h-6 w-6 sm:h-8 sm:w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Slide content area */}
      <div
        className="relative w-full max-w-4xl mx-4 sm:mx-8 max-h-[85vh] overflow-auto rounded-lg shadow-2xl"
        style={{
          backgroundColor: styles.backgroundColor,
          ...cssVariables,
        }}
      >
        {elementStylesCss && (
          <style dangerouslySetInnerHTML={{ __html: elementStylesCss }} />
        )}
        <article
          ref={articleRef}
          className="preview-content"
          style={{
            maxWidth: styles.maxWidth,
            margin: '0 auto',
            padding: `${styles.padding.top}px ${styles.padding.right}px ${styles.padding.bottom}px ${styles.padding.left}px`,
            fontFamily: styles.fontFamily,
            fontSize: styles.fontSize,
            lineHeight: styles.lineHeight,
            color: styles.textColor,
            minHeight: '200px',
          }}
        />
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
        <span className="text-white/70 text-sm font-mono tabular-nums">
          {currentSlide + 1} / {totalSlides}
        </span>
      </div>
    </div>
  );
});

export default SlideView;
