import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createDragDropHandler } from '../dragDrop';

// Helper: create a synthetic DragEvent-like object
function makeEvent(types: string[] = []): DragEvent {
  const e = {
    preventDefault: vi.fn(),
    stopPropagation: vi.fn(),
    dataTransfer: {
      types,
      dropEffect: '',
      files: [] as File[],
    },
  };
  return e as unknown as DragEvent;
}

describe('createDragDropHandler — drag state tracking', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('fires onDragEnter once when drag enters the document', () => {
    const onDragEnter = vi.fn();
    const h = createDragDropHandler({ onDragEnter });
    h.handleDragEnter(makeEvent());
    h.handleDragEnter(makeEvent()); // nested child
    expect(onDragEnter).toHaveBeenCalledTimes(1);
  });

  it('fires onDragLeave when counter reaches 0 via leave events', () => {
    const onDragEnter = vi.fn();
    const onDragLeave = vi.fn();
    const h = createDragDropHandler({ onDragEnter, onDragLeave });

    h.handleDragEnter(makeEvent());
    h.handleDragEnter(makeEvent());
    h.handleDragLeave(makeEvent());
    expect(onDragLeave).not.toHaveBeenCalled();
    h.handleDragLeave(makeEvent());
    expect(onDragLeave).toHaveBeenCalledTimes(1);
  });

  it('fires onDragLeave via idle timeout when no dragover events occur (window exit)', () => {
    const onDragEnter = vi.fn();
    const onDragLeave = vi.fn();
    const h = createDragDropHandler({ onDragEnter, onDragLeave, idleTimeoutMs: 200 });

    h.handleDragEnter(makeEvent());
    expect(onDragEnter).toHaveBeenCalled();
    expect(onDragLeave).not.toHaveBeenCalled();

    // Simulate: drag exits the window — no more dragover events
    vi.advanceTimersByTime(250);
    expect(onDragLeave).toHaveBeenCalledTimes(1);
  });

  it('does not trigger idle timeout while dragover keeps firing', () => {
    const onDragLeave = vi.fn();
    const h = createDragDropHandler({ onDragLeave, idleTimeoutMs: 200 });

    h.handleDragEnter(makeEvent());
    vi.advanceTimersByTime(150);
    h.handleDragOver(makeEvent());
    vi.advanceTimersByTime(150);
    h.handleDragOver(makeEvent());
    vi.advanceTimersByTime(150);
    // Total 450ms but dragover fired within 200ms windows — should not timeout
    expect(onDragLeave).not.toHaveBeenCalled();
  });

  it('does not fire onDragLeave twice when already inactive', () => {
    const onDragLeave = vi.fn();
    const h = createDragDropHandler({ onDragLeave, idleTimeoutMs: 100 });

    h.handleDragEnter(makeEvent());
    vi.advanceTimersByTime(200);
    h.handleDragLeave(makeEvent()); // additional stray leave
    vi.advanceTimersByTime(200);
    expect(onDragLeave).toHaveBeenCalledTimes(1);
  });

  it('clamps counter at 0 (prevents negative drift)', () => {
    const onDragEnter = vi.fn();
    const onDragLeave = vi.fn();
    const h = createDragDropHandler({ onDragEnter, onDragLeave });

    // Leave without matching enter — should not error or produce weird state
    h.handleDragLeave(makeEvent());
    h.handleDragLeave(makeEvent());
    h.handleDragEnter(makeEvent());
    expect(onDragEnter).toHaveBeenCalledTimes(1);
  });

  it('ignores internal (sidebar) drags', () => {
    const onDragEnter = vi.fn();
    const h = createDragDropHandler({ onDragEnter });
    h.handleDragEnter(makeEvent(['application/x-doc-id']));
    expect(onDragEnter).not.toHaveBeenCalled();
  });

  it('sets dropEffect to copy on dragover for file drags', () => {
    const h = createDragDropHandler({});
    const e = makeEvent();
    h.handleDragOver(e);
    expect(e.dataTransfer!.dropEffect).toBe('copy');
  });

  it('resets state after drop', async () => {
    const onDragLeave = vi.fn();
    const onError = vi.fn();
    const h = createDragDropHandler({ onDragLeave, onError, idleTimeoutMs: 100 });

    h.handleDragEnter(makeEvent());
    await h.handleDrop(makeEvent());
    expect(onDragLeave).toHaveBeenCalled();

    // No stale timer — advancing time should not re-trigger
    onDragLeave.mockClear();
    vi.advanceTimersByTime(300);
    expect(onDragLeave).not.toHaveBeenCalled();
  });
});
