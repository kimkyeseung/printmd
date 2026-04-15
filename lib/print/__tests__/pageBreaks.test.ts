import { describe, it, expect } from 'vitest';
import { computePageBreaks, type KeepTogetherZone } from '../pageBreaks';

describe('computePageBreaks', () => {
  it('returns [0] when content fits in one page', () => {
    expect(computePageBreaks(500, 1000, [])).toEqual([0]);
  });

  it('returns [0] when content equals page height', () => {
    expect(computePageBreaks(1000, 1000, [])).toEqual([0]);
  });

  it('splits evenly when there are no keep-together zones', () => {
    const breaks = computePageBreaks(2500, 1000, []);
    expect(breaks).toEqual([0, 1000, 2000]);
  });

  it('adjusts break to avoid splitting a keep-together zone', () => {
    // Zone from 950 to 1050 — the default break at 1000 falls inside it
    const zones: KeepTogetherZone[] = [{ top: 950, bottom: 1050 }];
    const breaks = computePageBreaks(2500, 1000, zones);

    // First break should be moved before the zone (949)
    expect(breaks[0]).toBe(0);
    expect(breaks[1]).toBeLessThan(950);
    expect(breaks[1]).toBeGreaterThan(750); // within 25% shift limit
  });

  it('does not shift break beyond 25% of page height', () => {
    // Zone starts very early — shifting would exceed 25% limit
    const zones: KeepTogetherZone[] = [{ top: 600, bottom: 1100 }];
    const breaks = computePageBreaks(2500, 1000, zones);

    // Should not shift to 599 (that's 401px shift = 40% > 25%)
    // Break stays at 1000
    expect(breaks[1]).toBe(1000);
  });

  it('handles zone at the very start of a page (no conflict)', () => {
    // Zone from 1000 to 1100 — break at 1000 is at zone.top, not inside
    const zones: KeepTogetherZone[] = [{ top: 1000, bottom: 1100 }];
    const breaks = computePageBreaks(2500, 1000, zones);
    expect(breaks[1]).toBe(1000); // No adjustment needed
  });

  it('handles multiple zones across pages', () => {
    const zones: KeepTogetherZone[] = [
      { top: 950, bottom: 1050 },  // near first break
      { top: 1900, bottom: 2000 }, // near second break
    ];
    const breaks = computePageBreaks(3000, 1000, zones);

    expect(breaks[0]).toBe(0);
    // First break adjusted before zone 1
    expect(breaks[1]).toBeLessThan(950);
    // Second break depends on first, so we just verify it exists
    expect(breaks.length).toBeGreaterThanOrEqual(3);
  });

  it('does not create duplicate or regressive breaks', () => {
    const zones: KeepTogetherZone[] = [{ top: 980, bottom: 1020 }];
    const breaks = computePageBreaks(3000, 1000, zones);

    for (let i = 1; i < breaks.length; i++) {
      expect(breaks[i]).toBeGreaterThan(breaks[i - 1]);
    }
  });

  it('handles empty zones array', () => {
    const breaks = computePageBreaks(3000, 1000, []);
    expect(breaks).toEqual([0, 1000, 2000]);
  });
});
