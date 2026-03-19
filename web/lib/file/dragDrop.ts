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

    if (dragCounter === 1) {
      onDragEnter?.();
    }
  };

  const handleDragLeave = (e: DragEvent) => {
    if (isInternalDrag(e)) return;
    e.preventDefault();
    e.stopPropagation();
    dragCounter--;

    if (dragCounter === 0) {
      onDragLeave?.();
    }
  };

  const handleDragOver = (e: DragEvent) => {
    if (isInternalDrag(e)) return;
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'copy';
    }
  };

  const handleDrop = async (e: DragEvent) => {
    if (isInternalDrag(e)) return;
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

