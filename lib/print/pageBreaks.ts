/**
 * Smart page-break utilities for PDF generation.
 *
 * Prevents orphaned table headers and headings separated from their content
 * by adjusting page-break positions to avoid "keep-together" zones.
 */

/** A vertical range (in pixels) that should not be split across pages. */
export interface KeepTogetherZone {
  top: number;
  bottom: number;
}

/**
 * Scan a container DOM element for zones that should stay together:
 *  - Table header (thead) + first body row
 *  - Headings (h1-h6) + next sibling element
 *
 * Returns zones in DOM-pixel coordinates relative to the container top.
 */
export function findKeepTogetherZones(
  container: HTMLElement,
  maxZoneHeight: number
): KeepTogetherZone[] {
  const contentEl = container.querySelector('.preview-content');
  if (!contentEl) return [];

  const containerTop = container.getBoundingClientRect().top;
  const zones: KeepTogetherZone[] = [];

  // Tables: keep thead + first body row together
  contentEl.querySelectorAll('table').forEach((table) => {
    const thead = table.querySelector('thead');
    const firstRow =
      table.querySelector('tbody tr:first-child') ??
      table.querySelector('tr:nth-child(2)');
    if (thead && firstRow) {
      const top = thead.getBoundingClientRect().top - containerTop;
      const bottom = firstRow.getBoundingClientRect().bottom - containerTop;
      if (bottom - top <= maxZoneHeight) {
        zones.push({ top, bottom });
      }
    }
  });

  // Headings: keep with next sibling
  contentEl.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((heading) => {
    const next = heading.nextElementSibling;
    if (next) {
      const top = heading.getBoundingClientRect().top - containerTop;
      const nextBottom = next.getBoundingClientRect().bottom - containerTop;
      const bottom = Math.min(nextBottom, top + maxZoneHeight);
      zones.push({ top, bottom });
    }
  });

  return zones;
}

/**
 * Compute adjusted page-break Y positions that avoid splitting keep-together zones.
 *
 * @param totalHeight  Total content height (px)
 * @param pageHeight   Ideal page content height (px)
 * @param zones        Keep-together zones (px)
 * @returns Array of Y offsets (px) where each page starts. First element is always 0.
 */
export function computePageBreaks(
  totalHeight: number,
  pageHeight: number,
  zones: KeepTogetherZone[]
): number[] {
  if (totalHeight <= pageHeight) return [0];

  const breaks: number[] = [0];
  let idealNext = pageHeight;

  // Maximum we can shift a break backwards (25% of page height)
  const maxShift = pageHeight * 0.25;

  while (idealNext < totalHeight) {
    let breakAt = idealNext;

    // Check if the break falls inside a keep-together zone
    for (const zone of zones) {
      if (zone.top < breakAt && zone.bottom > breakAt) {
        // Move break to just before this zone, but not too far back
        const shifted = zone.top - 1;
        if (idealNext - shifted <= maxShift && shifted > breaks[breaks.length - 1]) {
          breakAt = shifted;
        }
        break;
      }
    }

    breaks.push(breakAt);
    idealNext = breakAt + pageHeight;
  }

  return breaks;
}
