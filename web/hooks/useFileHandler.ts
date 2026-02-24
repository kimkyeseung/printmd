import { useCallback, useEffect, useRef, useState } from 'react';
import { createDragDropHandler, type FileInfo } from '@/lib/file';
import { useEditorStore } from '@/stores';

interface UseFileHandlerOptions {
  onFileLoad?: (file: FileInfo) => void;
  onError?: (error: Error) => void;
}

interface UseFileHandlerReturn {
  isDragging: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  openFilePicker: () => void;
  handleFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  dragDropHandlers: {
    handleDragEnter: (e: DragEvent) => void;
    handleDragLeave: (e: DragEvent) => void;
    handleDragOver: (e: DragEvent) => void;
    handleDrop: (e: DragEvent) => Promise<void>;
  };
}

export function useFileHandler(options: UseFileHandlerOptions = {}): UseFileHandlerReturn {
  const { onFileLoad, onError } = options;
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const setContent = useEditorStore((state) => state.setContent);

  const handleFileDrop = useCallback((file: FileInfo) => {
    setContent(file.content);
    onFileLoad?.(file);
  }, [setContent, onFileLoad]);

  const handleError = useCallback((error: Error) => {
    console.error('File handling error:', error);
    onError?.(error);
  }, [onError]);

  const dragDropHandlers = createDragDropHandler({
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    onDrop: handleFileDrop,
    onError: handleError,
  });

  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        const fileInfo: FileInfo = {
          name: file.name,
          content,
          size: file.size,
          lastModified: file.lastModified,
        };
        handleFileDrop(fileInfo);
      }
    };
    reader.onerror = () => {
      handleError(new Error('Failed to read file'));
    };
    reader.readAsText(file);

    // Reset input for re-selecting same file
    e.target.value = '';
  }, [handleFileDrop, handleError]);

  return {
    isDragging,
    fileInputRef,
    openFilePicker,
    handleFileInputChange,
    dragDropHandlers,
  };
}

// Hook to setup drag-drop on an element
export function useDragDropZone(
  elementRef: React.RefObject<HTMLElement | null>,
  options: UseFileHandlerOptions = {}
) {
  const { isDragging, dragDropHandlers } = useFileHandler(options);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleDragEnter = (e: Event) => dragDropHandlers.handleDragEnter(e as DragEvent);
    const handleDragLeave = (e: Event) => dragDropHandlers.handleDragLeave(e as DragEvent);
    const handleDragOver = (e: Event) => dragDropHandlers.handleDragOver(e as DragEvent);
    const handleDrop = (e: Event) => dragDropHandlers.handleDrop(e as DragEvent);

    element.addEventListener('dragenter', handleDragEnter);
    element.addEventListener('dragleave', handleDragLeave);
    element.addEventListener('dragover', handleDragOver);
    element.addEventListener('drop', handleDrop);

    return () => {
      element.removeEventListener('dragenter', handleDragEnter);
      element.removeEventListener('dragleave', handleDragLeave);
      element.removeEventListener('dragover', handleDragOver);
      element.removeEventListener('drop', handleDrop);
    };
  }, [elementRef, dragDropHandlers]);

  return { isDragging };
}
