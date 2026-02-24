import { readFile, isMarkdownFile, type FileInfo } from './fileHandler';

export interface DragDropOptions {
  onDragEnter?: () => void;
  onDragLeave?: () => void;
  onDrop?: (file: FileInfo) => void;
  onError?: (error: Error) => void;
}

export function createDragDropHandler(options: DragDropOptions) {
  const { onDragEnter, onDragLeave, onDrop, onError } = options;

  let dragCounter = 0;

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter++;

    if (dragCounter === 1) {
      onDragEnter?.();
    }
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter--;

    if (dragCounter === 0) {
      onDragLeave?.();
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'copy';
    }
  };

  const handleDrop = async (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter = 0;
    onDragLeave?.();

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

export function setupDragDrop(element: HTMLElement, options: DragDropOptions): () => void {
  const handlers = createDragDropHandler(options);

  element.addEventListener('dragenter', handlers.handleDragEnter);
  element.addEventListener('dragleave', handlers.handleDragLeave);
  element.addEventListener('dragover', handlers.handleDragOver);
  element.addEventListener('drop', handlers.handleDrop);

  // Return cleanup function
  return () => {
    element.removeEventListener('dragenter', handlers.handleDragEnter);
    element.removeEventListener('dragleave', handlers.handleDragLeave);
    element.removeEventListener('dragover', handlers.handleDragOver);
    element.removeEventListener('drop', handlers.handleDrop);
  };
}
