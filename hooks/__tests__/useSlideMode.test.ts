import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSlideMode } from '../useSlideMode';

describe('useSlideMode', () => {
  const threeSlides = 'Slide 1\n---\nSlide 2\n---\nSlide 3';
  const noSlides = 'Just a single block of content.';

  it('splits content into slides by ---', () => {
    const { result } = renderHook(() => useSlideMode(threeSlides));
    expect(result.current.slides).toHaveLength(3);
    expect(result.current.slides[0]).toBe('Slide 1');
    expect(result.current.slides[1]).toBe('Slide 2');
    expect(result.current.slides[2]).toBe('Slide 3');
  });

  it('hasSlides is true when multiple slides exist', () => {
    const { result } = renderHook(() => useSlideMode(threeSlides));
    expect(result.current.hasSlides).toBe(true);
  });

  it('hasSlides is false for single content', () => {
    const { result } = renderHook(() => useSlideMode(noSlides));
    expect(result.current.hasSlides).toBe(false);
  });

  it('starts not in slide mode', () => {
    const { result } = renderHook(() => useSlideMode(threeSlides));
    expect(result.current.isSlideMode).toBe(false);
    expect(result.current.currentSlide).toBe(0);
  });

  it('toggleSlideMode enters and exits', () => {
    const { result } = renderHook(() => useSlideMode(threeSlides));

    act(() => result.current.toggleSlideMode());
    expect(result.current.isSlideMode).toBe(true);

    act(() => result.current.toggleSlideMode());
    expect(result.current.isSlideMode).toBe(false);
  });

  it('nextSlide / prevSlide navigates within bounds', () => {
    const { result } = renderHook(() => useSlideMode(threeSlides));

    act(() => result.current.toggleSlideMode());
    expect(result.current.currentSlide).toBe(0);

    act(() => result.current.nextSlide());
    expect(result.current.currentSlide).toBe(1);

    act(() => result.current.nextSlide());
    expect(result.current.currentSlide).toBe(2);

    // Should not go past last slide
    act(() => result.current.nextSlide());
    expect(result.current.currentSlide).toBe(2);

    act(() => result.current.prevSlide());
    expect(result.current.currentSlide).toBe(1);

    // Should not go before first slide
    act(() => result.current.prevSlide());
    act(() => result.current.prevSlide());
    expect(result.current.currentSlide).toBe(0);
  });

  it('goToSlide clamps to valid range', () => {
    const { result } = renderHook(() => useSlideMode(threeSlides));

    act(() => result.current.goToSlide(2));
    expect(result.current.currentSlide).toBe(2);

    act(() => result.current.goToSlide(99));
    expect(result.current.currentSlide).toBe(2);

    act(() => result.current.goToSlide(-5));
    expect(result.current.currentSlide).toBe(0);
  });

  it('exitSlideMode resets to slide 0', () => {
    const { result } = renderHook(() => useSlideMode(threeSlides));

    act(() => result.current.toggleSlideMode());
    act(() => result.current.nextSlide());
    act(() => result.current.nextSlide());
    expect(result.current.currentSlide).toBe(2);

    act(() => result.current.exitSlideMode());
    expect(result.current.isSlideMode).toBe(false);
    expect(result.current.currentSlide).toBe(0);
  });

  it('handles content with extra dashes', () => {
    const content = 'A\n----\nB\n------\nC';
    const { result } = renderHook(() => useSlideMode(content));
    expect(result.current.slides).toHaveLength(3);
  });

  it('totalSlides reflects slide count', () => {
    const { result } = renderHook(() => useSlideMode(threeSlides));
    expect(result.current.totalSlides).toBe(3);
  });
});
