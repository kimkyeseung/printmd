import { readFile, isMarkdownFile, type FileInfo } from './fileHandler';

export interface DragDropOptions {
  onDragEnter?: () => void;
  onDragLeave?: () => void;
  onDrop?: (file: FileInfo) => void;
  onError?: (error: Error) => void;
  /** Override the no-activity timeout (ms). Defaults to 300ms. */
  idleTimeoutMs?: number;
}

/**
 * Duration (ms) with no `dragover` event before the drag is considered
 * "left the window". Browsers fire `dragover` continuously while the pointer
 * is over the document; if this stream stops, the drag has escaped (e.g.
 * to another app or the browser chrome) and we can safely hide the overlay.
 */
const DEFAULT_IDLE_TIMEOUT_MS = 300;

export function createDragDropHandler(options: DragDropOptions) {
  const { onDragEnter, onDragLeave, onDrop, onError } = options;
  const idleTimeoutMs = options.idleTimeoutMs ?? DEFAULT_IDLE_TIMEOUT_MS;

  let dragCounter = 0;
  let idleTimer: ReturnType<typeof setTimeout> | null = null;
  let active = false;

  const clearIdleTimer = () => {
    if (idleTimer !== null) {
      clearTimeout(idleTimer);
      idleTimer = null;
    }
  };

  const resetState = () => {
    dragCounter = 0;
    clearIdleTimer();
    if (active) {
      active = false;
      onDragLeave?.();
    }
  };

  const scheduleIdleCleanup = () => {
    clearIdleTimer();
    idleTimer = setTimeout(resetState, idleTimeoutMs);
  };

  // Ignore internal sidebar drag operations (folder/document reordering)
  const isInternalDrag = (e: DragEvent): boolean => {
    if (!e.dataTransfer) return false;
    const types = Array.from(e.dataTransfer.types);
    return types.includes('application/x-doc-id') || types.includes('application/x-folder-id');
  };

  const handleDragEnter = (e: DragEvent) => {
    if (isInternalDrag(e)) return;
    e.preventDefault();
    e.stopPropagation();
    dragCounter++;

    if (!active) {
      active = true;
      onDragEnter?.();
    }
    scheduleIdleCleanup();
  };

  const handleDragLeave = (e: DragEvent) => {
    if (isInternalDrag(e)) return;
    e.preventDefault();
    e.stopPropagation();
    dragCounter = Math.max(0, dragCounter - 1);

    if (dragCounter === 0) {
      resetState();
    }
  };

  const handleDragOver = (e: DragEvent) => {
    if (isInternalDrag(e)) return;
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'copy';
    }
    // Continuous dragover events mean drag is still inside the window.
    // Reset the idle timer on each one.
    scheduleIdleCleanup();
  };

  const handleDrop = async (e: DragEvent) => {
    if (isInternalDrag(e)) return;
    e.preventDefault();
    e.stopPropagation();
    resetState();

    const files = e.dataTransfer?.files;
    if (!files || files.length === 0) {
      onError?.(new Error('No files dropped'));
      return;
    }

    const file = files[0];

    if (!isMarkdownFile(file)) {
      onError?.(new Error('Please drop a markdown file (.md, .markdown, .txt)'));
      return;
    }

    try {
      const fileInfo = await readFile(file);
      onDrop?.(fileInfo);
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error('Failed to read file'));
    }
  };

  return {
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
  };
}

