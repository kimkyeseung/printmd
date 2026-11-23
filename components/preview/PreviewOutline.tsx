'use client';

import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent, type RefObject } from 'react';
import { useUIStore } from '@/stores';

export const OUTLINE_SELECTOR = 'h1, h2, h3';

/** A heading counts as "current" once it passes this line (px below the preview's top). */
const ACTIVE_OFFSET = 80;
/** Breathing room above a heading after jumping to it. */
const JUMP_GAP = 16;
/** Closest the card may come to the preview's edges. */
const EDGE = 8;
/** Height of the card's header, kept on screen when dragged low. */
const HEADER_HEIGHT = 44;
/** An open card is kept at least this tall, moving up if it sits too low. */
const MIN_OPEN_HEIGHT = 220;

interface OutlineItem {
  text: string;
  level: number;
}

/** Headings in document order, read from the same HTML the preview renders. */
export function extractOutline(html: string): OutlineItem[] {
  if (typeof DOMParser === 'undefined') return [];
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return Array.from(doc.querySelectorAll(OUTLINE_SELECTOR))
    .map((el) => ({ text: el.textContent?.trim() ?? '', level: Number(el.tagName[1]) }))
    .filter((item) => item.text);
}

export interface PreviewOutlineStrings {
  outline: string;
  outlineEmpty: string;
  outlineCollapse: string;
  outlineExpand: string;
  outlineDrag: string;
}

interface PreviewOutlineProps {
  html: string;
  t: PreviewOutlineStrings;
  containerRef: RefObject<HTMLDivElement | null>;
  articleRef: RefObject<HTMLElement | null>;
}

type Position = { top: number; right: number };

/**
 * Floating outline over the preview: lists the document's headings and
 * highlights the one currently in view as the preview scrolls. Clicking a
 * heading jumps to it. Drag the header to move the card; fold it to its header.
 */
export function PreviewOutline({ html, t, containerRef, articleRef }: PreviewOutlineProps) {
  const items = useMemo(() => extractOutline(html), [html]);
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);
  const cardRef = useRef<HTMLElement>(null);

  const collapsed = useUIStore((s) => s.isOutlineCollapsed);
  const toggleCollapsed = useUIStore((s) => s.toggleOutlineCollapsed);
  const savedPosition = useUIStore((s) => s.outlinePosition);
  const setSavedPosition = useUIStore((s) => s.setOutlinePosition);

  // Held locally mid-drag so a drag is one store write.
  const [dragPosition, setDragPosition] = useState<Position | null>(null);
  const dragStart = useRef<{ x: number; y: number; from: Position } | null>(null);
  // Size of the area the card floats in, to keep it inside when the panel resizes.
  const [bounds, setBounds] = useState<{ width: number; height: number } | null>(null);
  const [cardWidth, setCardWidth] = useState(240);

  useEffect(() => {
    const card = cardRef.current;
    const area = card?.parentElement;
    if (!card || !area) return;
    const observer = new ResizeObserver(() => {
      setBounds({ width: area.clientWidth, height: area.clientHeight });
      setCardWidth(card.offsetWidth);
    });
    observer.observe(area);
    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  const clamp = (p: Position): Position => {
    if (!bounds) return p;
    const width = cardWidth;
    // Folded, only the header must fit; open, leave room for a useful stretch of the list.
    const minHeight = collapsed ? HEADER_HEIGHT : MIN_OPEN_HEIGHT;
    return {
      top: Math.round(Math.min(Math.max(p.top, EDGE), Math.max(EDGE, bounds.height - minHeight - EDGE))),
      right: Math.round(Math.min(Math.max(p.right, EDGE), Math.max(EDGE, bounds.width - width - EDGE))),
    };
  };
  const position = clamp(dragPosition ?? savedPosition);

  const onDragStart = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || (e.target as HTMLElement).closest('button')) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStart.current = { x: e.clientX, y: e.clientY, from: position };
  };
  const onDragMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const start = dragStart.current;
    if (!start) return;
    setDragPosition(
      clamp({ top: start.from.top + e.clientY - start.y, right: start.from.right - (e.clientX - start.x) }),
    );
  };
  const onDragEnd = () => {
    if (!dragStart.current) return;
    dragStart.current = null;
    if (dragPosition) setSavedPosition(dragPosition);
    setDragPosition(null);
  };

  // Heading elements in the rendered preview, matched to `items` by position.
  const headingEls = () =>
    Array.from(articleRef.current?.querySelectorAll<HTMLElement>(OUTLINE_SELECTOR) ?? []).filter((el) =>
      el.textContent?.trim(),
    );

  useEffect(() => {
    const container = containerRef.current;
    if (!container || items.length === 0) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const els = headingEls();
      if (els.length === 0) return;
      const line = container.getBoundingClientRect().top + ACTIVE_OFFSET;

      let current = 0;
      for (let i = 0; i < els.length; i++) {
        if (els[i].getBoundingClientRect().top <= line) current = i;
        else break;
      }
      // Short last sections never reach the line; at the bottom, the last heading wins.
      if (container.scrollTop + container.clientHeight >= container.scrollHeight - 2) {
        current = els.length - 1;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    // The preview writes its HTML in an effect; measure after that has landed.
    onScroll();
    container.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      container.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
    // headingEls reads refs only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, containerRef]);

  // Keep the highlighted entry visible when the outline is taller than the card.
  useEffect(() => {
    const list = listRef.current;
    const link = list?.children[active] as HTMLElement | undefined;
    if (!list || !link) return;
    if (link.offsetTop < list.scrollTop) list.scrollTop = link.offsetTop - 8;
    else if (link.offsetTop + link.offsetHeight > list.scrollTop + list.clientHeight) {
      list.scrollTop = link.offsetTop + link.offsetHeight - list.clientHeight + 8;
    }
  }, [active, collapsed]);

  const jumpTo = (index: number) => {
    const container = containerRef.current;
    const el = headingEls()[index];
    if (!container || !el) return;
    const top =
      el.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop - JUMP_GAP;
    container.scrollTo({ top, behavior: 'smooth' });
    setActive(index);
  };

  const minLevel = items.reduce((min, item) => Math.min(min, item.level), 3);
  const dragging = dragPosition !== null;

  return (
    // A card that floats over the page: soft shadow, hairline ring, frosted background.
    <nav
      ref={cardRef}
      aria-label={t.outline}
      style={{
        top: position.top,
        right: position.right,
        maxHeight: bounds ? bounds.height - position.top - EDGE : undefined,
      }}
      className={`absolute z-20 hidden flex-col overflow-hidden md:flex rounded-2xl bg-[color-mix(in_srgb,var(--background)_82%,transparent)] ring-1 ring-black/[0.06] backdrop-blur-xl transition-[box-shadow,width] duration-200 dark:ring-white/10 ${
        collapsed ? 'w-auto' : 'w-60'
      } ${
        dragging
          ? 'shadow-[0_2px_4px_rgba(0,0,0,0.06),0_20px_44px_-10px_rgba(0,0,0,0.25)] dark:shadow-[0_20px_44px_-10px_rgba(0,0,0,0.75)]'
          : 'shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-8px_rgba(0,0,0,0.14)] dark:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.6)]'
      }`}
    >
      {/* Header doubles as the drag handle; double-click folds the card. */}
      <div
        title={t.outlineDrag}
        onPointerDown={onDragStart}
        onPointerMove={onDragMove}
        onPointerUp={onDragEnd}
        onPointerCancel={onDragEnd}
        onDoubleClick={(e) => {
          if (!(e.target as HTMLElement).closest('button')) toggleCollapsed();
        }}
        className={`group flex shrink-0 touch-none select-none items-center gap-2 py-2.5 pl-3 pr-2 ${
          dragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        <svg aria-hidden viewBox="0 0 16 16" className="h-3.5 w-3.5 text-[var(--ui-text-muted)] opacity-60 transition-opacity group-hover:opacity-100" fill="currentColor">
          <circle cx="6" cy="4" r="1.2" /><circle cx="10" cy="4" r="1.2" />
          <circle cx="6" cy="8" r="1.2" /><circle cx="10" cy="8" r="1.2" />
          <circle cx="6" cy="12" r="1.2" /><circle cx="10" cy="12" r="1.2" />
        </svg>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ui-text-muted)]">{t.outline}</p>
        {items.length > 0 && (
          <span className="rounded-full bg-[var(--ui-bg-hover)] px-1.5 text-[10px] tabular-nums text-[var(--ui-text-muted)]">
            {items.length}
          </span>
        )}
        <button
          type="button"
          onClick={toggleCollapsed}
          aria-expanded={!collapsed}
          aria-label={collapsed ? t.outlineExpand : t.outlineCollapse}
          title={collapsed ? t.outlineExpand : t.outlineCollapse}
          className="ml-auto grid h-6 w-6 cursor-pointer place-items-center rounded-md text-[var(--ui-text-muted)] transition-colors hover:bg-[var(--ui-bg-hover)] hover:text-[var(--foreground)]"
        >
          <svg aria-hidden viewBox="0 0 16 16" className={`h-3.5 w-3.5 transition-transform duration-200 ${collapsed ? '-rotate-90' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 6l4 4 4-4" />
          </svg>
        </button>
      </div>

      {!collapsed &&
        (items.length === 0 ? (
          <p className="px-4 pb-4 text-xs leading-relaxed text-[var(--ui-text-muted)]">{t.outlineEmpty}</p>
        ) : (
          <ul ref={listRef} className="relative min-h-0 flex-1 overflow-y-auto px-2 pb-2 text-[13px] [scrollbar-width:thin]">
            {items.map((item, i) => {
              const isActive = i === active;
              const depth = item.level - minLevel;
              return (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => jumpTo(i)}
                    aria-current={isActive ? 'location' : undefined}
                    title={item.text}
                    style={{ paddingLeft: 10 + depth * 14 }}
                    className={`relative flex w-full items-center rounded-lg py-1.5 pr-2 text-left leading-snug transition-all duration-200 ${
                      isActive
                        ? 'bg-[color-mix(in_srgb,var(--printmd-link-color)_10%,transparent)] font-medium text-[var(--printmd-link-color)] dark:bg-[color-mix(in_srgb,var(--printmd-link-color)_22%,transparent)] dark:text-[color-mix(in_srgb,var(--printmd-link-color)_45%,white)]'
                        : `${depth === 0 ? 'text-[var(--foreground)]/80' : 'text-[var(--ui-text-muted)]'} hover:bg-[var(--ui-bg-hover)] hover:text-[var(--foreground)]`
                    }`}
                  >
                    {/* Accent bar on the current section. */}
                    <span
                      aria-hidden
                      className={`absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-full bg-[var(--printmd-link-color)] transition-opacity duration-200 dark:bg-[color-mix(in_srgb,var(--printmd-link-color)_45%,white)] ${
                        isActive ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                    <span className="truncate">{item.text}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        ))}
    </nav>
  );
}
