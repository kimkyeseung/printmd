'use client';

import { useCallback, useRef, useState, useEffect } from 'react';

interface SplitPaneProps {
  left: React.ReactNode;
  right: React.ReactNode;
  defaultLeftWidth?: number; // percentage
  minLeftWidth?: number; // percentage
  maxLeftWidth?: number; // percentage
  onWidthChange?: (width: number) => void;
}

export function SplitPane({
  left,
  right,
  defaultLeftWidth = 50,
  minLeftWidth = 20,
  maxLeftWidth = 80,
  onWidthChange,
}: SplitPaneProps) {
  const [leftWidth, setLeftWidth] = useState(defaultLeftWidth);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      const clampedWidth = Math.min(Math.max(newWidth, minLeftWidth), maxLeftWidth);

      setLeftWidth(clampedWidth);
      onWidthChange?.(clampedWidth);
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [minLeftWidth, maxLeftWidth, onWidthChange]);

  return (
    <div ref={containerRef} className="flex h-full w-full">
      {/* Left panel */}
      <div
        className="h-full min-h-0 overflow-hidden"
        style={{ width: `${leftWidth}%` }}
      >
        {left}
      </div>

      {/* Divider */}
      <div
        className="group relative h-full w-1 cursor-col-resize bg-[var(--ui-border)] hover:bg-[var(--printmd-link-color)] active:bg-[var(--printmd-link-color)]"
        onMouseDown={handleMouseDown}
      >
        <div className="absolute inset-y-0 -left-1 -right-1" />
      </div>

      {/* Right panel */}
      <div
        className="h-full min-h-0 flex-1 overflow-hidden"
        style={{ width: `${100 - leftWidth}%` }}
      >
        {right}
      </div>
    </div>
  );
}

export default SplitPane;
