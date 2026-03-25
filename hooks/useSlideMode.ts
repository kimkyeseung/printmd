import { useState, useCallback, useMemo, useEffect, useRef } from 'react';

export interface SlideMode {
  isSlideMode: boolean;
  currentSlide: number;
  totalSlides: number;
  slides: string[];
  nextSlide: () => void;
  prevSlide: () => void;
  goToSlide: (n: number) => void;
  toggleSlideMode: () => void;
  exitSlideMode: () => void;
  hasSlides: boolean;
}

/**
 * Hook for slide/presentation mode.
 * Splits markdown content by `\n---\n` (horizontal rules) into individual slides.
 * Registers keyboard listeners for ArrowLeft/ArrowRight navigation and Escape to exit.
 */
export function useSlideMode(content: string): SlideMode {
  const [isSlideMode, setIsSlideMode] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const slides = useMemo(() => {
    // Split by horizontal rule patterns: a line that is just `---` (or more dashes)
    // We match lines that are exactly `---`, `----`, etc., possibly with surrounding whitespace
    return content.split(/\n(?:---+)\n/).map((s) => s.trim()).filter((s) => s.length > 0);
  }, [content]);

  const totalSlides = slides.length;
  const hasSlides = totalSlides > 1;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1));
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToSlide = useCallback(
    (n: number) => {
      setCurrentSlide(Math.max(0, Math.min(n, totalSlides - 1)));
    },
    [totalSlides],
  );

  const exitSlideMode = useCallback(() => {
    setIsSlideMode(false);
    setCurrentSlide(0);
  }, []);

  const toggleSlideMode = useCallback(() => {
    if (isSlideMode) {
      exitSlideMode();
    } else {
      setCurrentSlide(0);
      setIsSlideMode(true);
    }
  }, [isSlideMode, exitSlideMode]);

  // Keyboard navigation
  useEffect(() => {
    if (!isSlideMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
          e.preventDefault();
          nextSlide();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          prevSlide();
          break;
        case 'Escape':
          e.preventDefault();
          e.stopPropagation();
          exitSlideMode();
          break;
        case 'Home':
          e.preventDefault();
          goToSlide(0);
          break;
        case 'End':
          e.preventDefault();
          goToSlide(totalSlides - 1);
          break;
      }
    };

    // Use capture phase so we intercept Escape before the global handler
    document.addEventListener('keydown', handleKeyDown, true);
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [isSlideMode, nextSlide, prevSlide, exitSlideMode, goToSlide, totalSlides]);

  // Touch swipe support
  useEffect(() => {
    if (!isSlideMode) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) return;
      const touch = e.changedTouches[0];
      const dx = touch.clientX - touchStartRef.current.x;
      const dy = touch.clientY - touchStartRef.current.y;
      touchStartRef.current = null;

      // Only trigger if horizontal swipe is dominant and large enough
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        if (dx < 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isSlideMode, nextSlide, prevSlide]);

  return {
    isSlideMode,
    currentSlide,
    totalSlides,
    slides,
    nextSlide,
    prevSlide,
    goToSlide,
    toggleSlideMode,
    exitSlideMode,
    hasSlides,
  };
}
