/** Bounds of `GlobalStyles.maxWidth`, shared by the preview ruler and the style panel sliders. */
export const PREVIEW_WIDTH_MIN = 500;
export const PREVIEW_WIDTH_MAX = 2400;

/** Used when leaving full width and no earlier width is known (e.g. after a reload). */
export const PREVIEW_WIDTH_FALLBACK = 800;

const SNAP_PX = 10;

export type RulerSide = 'left' | 'right';

/**
 * The width that gives the preview's text the same column as the printed page.
 *
 * `maxWidth` includes the preview's padding, while the printed column has none,
 * so the padding is added back. Deliberately not clamped: on small paper a
 * value below the drag minimum is still the right answer.
 */
export function printMatchedWidth(
  printContentWidthPx: number,
  padding: { left: number; right: number },
): number {
  return Math.round(printContentWidthPx + padding.left + padding.right);
}

export function clampPreviewWidth(width: number): number {
  return Math.min(Math.max(width, PREVIEW_WIDTH_MIN), PREVIEW_WIDTH_MAX);
}

/**
 * The width a ruler drag asks for.
 *
 * The content is centred, so moving one edge by N pixels has to grow the column
 * by 2N for that edge to stay under the pointer. Reaching the panel's edge means
 * "as wide as possible" and stores the maximum rather than the panel's current
 * width, so the content keeps filling the panel when it later grows.
 */
export function widthFromDrag({
  startWidth,
  deltaX,
  side,
  containerWidth,
}: {
  startWidth: number;
  deltaX: number;
  side: RulerSide;
  containerWidth: number;
}): number {
  const width = startWidth + (side === 'right' ? deltaX : -deltaX) * 2;
  if (width >= containerWidth) return PREVIEW_WIDTH_MAX;
  return clampPreviewWidth(Math.round(width / SNAP_PX) * SNAP_PX);
}
