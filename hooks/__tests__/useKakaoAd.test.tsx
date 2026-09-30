import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import { useKakaoAd } from '../useKakaoAd';

function Slot({ onNoFill }: { onNoFill: () => void }) {
  const ref = useKakaoAd('DAN-test', 728, 90, onNoFill);
  return <div ref={ref} data-testid="slot" />;
}

const callbackName = '__printmdAdNoFill_DAN_test';

describe('useKakaoAd', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('reports no fill when AdFit calls its onfail callback', () => {
    const onNoFill = vi.fn();
    const { getByTestId } = render(<Slot onNoFill={onNoFill} />);

    const ins = getByTestId('slot').querySelector('ins')!;
    expect(ins.dataset.adOnfail).toBe(callbackName);

    (window as unknown as Record<string, () => void>)[callbackName]();
    expect(onNoFill).toHaveBeenCalledTimes(1);
  });

  it('reports no fill when the script fails to load', () => {
    const onNoFill = vi.fn();
    const { getByTestId } = render(<Slot onNoFill={onNoFill} />);

    getByTestId('slot').querySelector('script')!.dispatchEvent(new Event('error'));
    expect(onNoFill).toHaveBeenCalledTimes(1);
  });

  it('reports no fill when the slot is still empty after the grace period', () => {
    const onNoFill = vi.fn();
    render(<Slot onNoFill={onNoFill} />);

    vi.advanceTimersByTime(6000);
    expect(onNoFill).toHaveBeenCalledTimes(1);
  });

  it('does not report a slot that was filled', () => {
    const onNoFill = vi.fn();
    const { getByTestId } = render(<Slot onNoFill={onNoFill} />);

    const ins = getByTestId('slot').querySelector('ins')!;
    ins.appendChild(document.createElement('iframe'));
    ins.style.display = 'block';

    vi.advanceTimersByTime(6000);
    expect(onNoFill).not.toHaveBeenCalled();
  });

  it('removes its global callback on unmount', () => {
    const { unmount } = render(<Slot onNoFill={vi.fn()} />);
    unmount();
    expect(callbackName in window).toBe(false);
  });
});
