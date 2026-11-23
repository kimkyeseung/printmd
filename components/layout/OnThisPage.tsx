'use client';

import { useEffect, useRef, useState } from 'react';

export interface TocItem {
  id: string;
  text: string;
  /** 2 for top-level sections, 3 for sub-sections. */
  level: number;
}

interface OnThisPageProps {
  items: TocItem[];
  title: string;
  className?: string;
  /** Height cap for the list; it scrolls on its own beyond this. */
  listClassName?: string;
}

/** A section counts as "current" once its heading passes this line (px below the scroller's top). */
const ACTIVE_OFFSET = 96;

function findScroller(el: HTMLElement | null): HTMLElement | Window {
  for (let node = el?.parentElement; node; node = node.parentElement) {
    const { overflowY } = getComputedStyle(node);
    // Pages here scroll inside an `h-screen overflow-y-auto` wrapper, not the window.
    if (overflowY === 'auto' || overflowY === 'scroll') {
      return node;
    }
  }
  return window;
}

/**
 * Sticky "on this page" outline for a right-hand aside. Highlights the section
 * currently in view as the page scrolls (scroll-spy).
 */
export function OnThisPage({
  items,
  title,
  className = '',
  listClassName = 'max-h-[calc(100vh-8rem)]',
}: OnThisPageProps) {
  const navRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    if (items.length === 0) return;
    const scroller = findScroller(navRef.current);
    const isWindow = scroller === window;

    let frame = 0;
    const update = () => {
      frame = 0;
      const top = isWindow ? 0 : (scroller as HTMLElement).getBoundingClientRect().top;
      const line = top + ACTIVE_OFFSET;

      let current = items[0].id;
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= line) current = item.id;
        else break;
      }

      // At the very bottom the last sections may never reach the line; pick the last one.
      const atBottom = isWindow
        ? window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
        : (() => {
            const s = scroller as HTMLElement;
            return s.scrollTop + s.clientHeight >= s.scrollHeight - 2;
          })();
      if (atBottom) current = items[items.length - 1].id;

      setActiveId(current);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    scroller.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      scroller.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [items]);

  // Keep the highlighted entry visible when the outline itself is taller than the screen.
  useEffect(() => {
    const list = listRef.current;
    const link = activeId ? list?.querySelector<HTMLElement>(`[data-toc-id="${CSS.escape(activeId)}"]`) : null;
    if (!list || !link) return;
    const { offsetTop, offsetHeight } = link;
    if (offsetTop < list.scrollTop) list.scrollTop = offsetTop - 8;
    else if (offsetTop + offsetHeight > list.scrollTop + list.clientHeight) {
      list.scrollTop = offsetTop + offsetHeight - list.clientHeight + 8;
    }
  }, [activeId]);

  if (items.length === 0) return null;

  return (
    <nav ref={navRef} aria-labelledby="on-this-page-title" className={className}>
      <p id="on-this-page-title" className="mb-3 text-sm font-semibold text-gray-900">
        {title}
      </p>
      <ul
        ref={listRef}
        // `relative` so each link's offsetTop is measured from this list.
        className={`relative overflow-y-auto border-l border-gray-200 text-sm ${listClassName}`}
      >
        {items.map((item) => {
          const active = item.id === activeId;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                data-toc-id={item.id}
                aria-current={active ? 'location' : undefined}
                onClick={() => setActiveId(item.id)}
                className={`-ml-px block border-l-2 py-1.5 pr-2 leading-snug transition-colors ${
                  item.level >= 3 ? 'pl-6' : 'pl-3'
                } ${
                  active
                    ? 'border-blue-600 font-medium text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-800'
                }`}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
