'use client';

import { memo, useEffect, useRef, useState } from 'react';
import { useAppStrings } from '@/lib/i18n/appStrings';
import {
  clampPreviewWidth,
  widthFromDrag,
  PREVIEW_WIDTH_FALLBACK,
  PREVIEW_WIDTH_MAX,
  type RulerSide,
} from '@/lib/styles/previewWidth';

const KEYBOARD_STEP_PX = 50;

interface PreviewWidthRulerProps {
  /** The width the content is currently laid out with, including mid-drag. */
  width: number;
  /** Called on every pointer move, so the content can follow without saving. */
  onDrag: (width: number) => void;
  /** Called once per gesture with the width to keep. */
  onCommit: (width: number) => void;
  /** Called when a drag is interrupted and its width should be dropped. */
  onCancel: () => void;
}

interface DragState {
  startX: number;
  startWidth: number;
  containerWidth: number;
  latest: number | null;
}

/**
 * Excel-style ruler above the preview: the band sits directly over the content
 * column and its two edges drag to resize it.
 *
 * It lives inside the preview's scroll container so it shares the content's
 * centre line; outside, the scrollbar would shift the handles off the edges.
 */
export const PreviewWidthRuler = memo(function PreviewWidthRuler({
  width,
  onDrag,
  onCommit,
  onCancel,
}: PreviewWidthRulerProps) {
  const t = useAppStrings().previewPanel;
  const rulerRef = useRef<HTMLDivElement>(null);
  const bandRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const widthBeforeFullRef = useRef<number | null>(null);
  const [shownWidth, setShownWidth] = useState<number | null>(null);

  // What's on screen can be less than `width` when the panel is narrower.
  useEffect(() => {
    const band = bandRef.current;
    if (!band || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => setShownWidth(Math.round(band.offsetWidth)));
    observer.observe(band);
    return () => observer.disconnect();
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || !rulerRef.current || !bandRef.current) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      startX: e.clientX,
      startWidth: bandRef.current.offsetWidth,
      containerWidth: rulerRef.current.clientWidth,
      latest: null,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>, side: RulerSide) => {
    const drag = dragRef.current;
    if (!drag) return;
    const next = widthFromDrag({
      startWidth: drag.startWidth,
      deltaX: e.clientX - drag.startX,
      side,
      containerWidth: drag.containerWidth,
    });
    drag.latest = next;
    onDrag(next);
  };

  const handlePointerUp = () => {
    const drag = dragRef.current;
    dragRef.current = null;
    // A plain click never moved, and must not leave an undo entry behind.
    if (drag?.latest != null) onCommit(drag.latest);
  };

  const handlePointerCancel = () => {
    dragRef.current = null;
    onCancel();
  };

  const handleDoubleClick = () => {
    const ruler = rulerRef.current;
    const band = bandRef.current;
    if (!ruler || !band) return;
    if (band.offsetWidth >= ruler.clientWidth) {
      onCommit(widthBeforeFullRef.current ?? PREVIEW_WIDTH_FALLBACK);
    } else {
      widthBeforeFullRef.current = width;
      onCommit(PREVIEW_WIDTH_MAX);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, side: RulerSide) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const outward = side === 'right' ? 'ArrowRight' : 'ArrowLeft';
    const delta = e.key === outward ? KEYBOARD_STEP_PX : -KEYBOARD_STEP_PX;
    const current = bandRef.current?.offsetWidth ?? width;
    onCommit(clampPreviewWidth(current + delta));
  };

  const renderHandle = (side: RulerSide) => (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label={t.widthHandle}
      aria-valuenow={shownWidth ?? width}
      tabIndex={0}
      title={t.widthHandleHint}
      data-testid={`preview-width-handle-${side}`}
      className={`group absolute inset-y-0 ${side === 'left' ? 'left-0 justify-start' : 'right-0 justify-end'} flex w-3 cursor-col-resize touch-none outline-none`}
      onPointerDown={handlePointerDown}
      onPointerMove={(e) => handlePointerMove(e, side)}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onDoubleClick={handleDoubleClick}
      onKeyDown={(e) => handleKeyDown(e, side)}
    >
      <div className="h-full w-[3px] bg-[var(--ui-border-hover)] group-hover:bg-[var(--printmd-link-color)] group-focus-visible:bg-[var(--printmd-link-color)] group-active:bg-[var(--printmd-link-color)]" />
    </div>
  );

  return (
    <div
      ref={rulerRef}
      data-testid="preview-width-ruler"
      className="sticky left-0 top-0 z-10 hidden h-5 select-none border-b border-[var(--ui-border)] bg-[var(--ui-bg-hover)] md:block"
    >
      <div
        ref={bandRef}
        className="relative mx-auto flex h-full w-full items-center justify-center bg-[var(--ui-bg-secondary)]"
        style={{ maxWidth: width }}
      >
        <span className="font-mono text-[10px] text-[var(--ui-text-muted)]">
          {shownWidth ?? width}px
        </span>
        {renderHandle('left')}
        {renderHandle('right')}
      </div>
    </div>
  );
});
