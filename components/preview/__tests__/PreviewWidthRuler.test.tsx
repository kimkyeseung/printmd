import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PreviewWidthRuler } from '../PreviewWidthRuler';
import {
  widthFromDrag,
  printMatchedWidth,
  PREVIEW_WIDTH_MAX,
  PREVIEW_WIDTH_MIN,
} from '@/lib/styles/previewWidth';

describe('printMatchedWidth', () => {
  it('adds the preview padding, which the printed column does not have', () => {
    expect(printMatchedWidth(642.5, { left: 40, right: 40 })).toBe(723);
  });

  it('is not held to the drag minimum on small paper', () => {
    expect(printMatchedWidth(300, { left: 20, right: 20 })).toBe(340);
  });
});

describe('widthFromDrag', () => {
  const base = { startWidth: 800, containerWidth: 1600 };

  it('grows by twice the distance, because the content is centred', () => {
    expect(widthFromDrag({ ...base, deltaX: 100, side: 'right' })).toBe(1000);
    expect(widthFromDrag({ ...base, deltaX: -100, side: 'left' })).toBe(1000);
  });

  it('shrinks when an edge moves inward', () => {
    expect(widthFromDrag({ ...base, deltaX: -100, side: 'right' })).toBe(600);
    expect(widthFromDrag({ ...base, deltaX: 100, side: 'left' })).toBe(600);
  });

  it('snaps to 10px', () => {
    expect(widthFromDrag({ ...base, deltaX: 12, side: 'right' })).toBe(820);
  });

  it('stops at the minimum', () => {
    expect(widthFromDrag({ ...base, deltaX: -500, side: 'right' })).toBe(PREVIEW_WIDTH_MIN);
  });

  it('becomes full width on reaching the panel edge', () => {
    expect(widthFromDrag({ ...base, deltaX: 400, side: 'right' })).toBe(PREVIEW_WIDTH_MAX);
  });
});

describe('PreviewWidthRuler', () => {
  const onDrag = vi.fn();
  const onCommit = vi.fn();
  const onCancel = vi.fn();

  /** jsdom has no layout, so give the band and the ruler their sizes by hand. */
  function setup({ bandWidth = 800, rulerWidth = 1600 } = {}) {
    render(<PreviewWidthRuler width={800} onDrag={onDrag} onCommit={onCommit} onCancel={onCancel} />);
    const ruler = screen.getByTestId('preview-width-ruler');
    Object.defineProperty(ruler, 'clientWidth', { value: rulerWidth });
    Object.defineProperty(ruler.firstElementChild, 'offsetWidth', { value: bandWidth });
    const handle = screen.getByTestId('preview-width-handle-right');
    handle.setPointerCapture = vi.fn();
    return handle;
  }

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('follows the pointer while dragging and commits once on release', () => {
    const handle = setup();
    fireEvent.pointerDown(handle, { button: 0, clientX: 1200, pointerId: 1 });
    fireEvent.pointerMove(handle, { clientX: 1250, pointerId: 1 });
    fireEvent.pointerMove(handle, { clientX: 1300, pointerId: 1 });
    expect(onDrag).toHaveBeenLastCalledWith(1000);
    expect(onCommit).not.toHaveBeenCalled();

    fireEvent.pointerUp(handle, { pointerId: 1 });
    expect(onCommit).toHaveBeenCalledTimes(1);
    expect(onCommit).toHaveBeenCalledWith(1000);
  });

  it('ignores moves without a press', () => {
    const handle = setup();
    fireEvent.pointerMove(handle, { clientX: 1300, pointerId: 1 });
    expect(onDrag).not.toHaveBeenCalled();
  });

  it('commits nothing for a click that never moved', () => {
    const handle = setup();
    fireEvent.pointerDown(handle, { button: 0, clientX: 1200, pointerId: 1 });
    fireEvent.pointerUp(handle, { pointerId: 1 });
    expect(onCommit).not.toHaveBeenCalled();
  });

  it('drops the width when the drag is cancelled', () => {
    const handle = setup();
    fireEvent.pointerDown(handle, { button: 0, clientX: 1200, pointerId: 1 });
    fireEvent.pointerMove(handle, { clientX: 1300, pointerId: 1 });
    fireEvent.pointerCancel(handle, { pointerId: 1 });
    expect(onCancel).toHaveBeenCalled();
    expect(onCommit).not.toHaveBeenCalled();
  });

  it('double-click goes to full width', () => {
    const handle = setup();
    fireEvent.doubleClick(handle);
    expect(onCommit).toHaveBeenCalledWith(PREVIEW_WIDTH_MAX);
  });

  it('double-click at full width returns to the fallback width', () => {
    const handle = setup({ bandWidth: 1600 });
    fireEvent.doubleClick(handle);
    expect(onCommit).toHaveBeenCalledWith(800);
  });

  it('arrow keys move the edge outward and inward', () => {
    const handle = setup();
    fireEvent.keyDown(handle, { key: 'ArrowRight' });
    expect(onCommit).toHaveBeenLastCalledWith(850);
    fireEvent.keyDown(handle, { key: 'ArrowLeft' });
    expect(onCommit).toHaveBeenLastCalledWith(750);
  });
});
