import { useState, useEffect, useMemo, useCallback } from 'react';
import { useEditorStore } from '@/stores';
import { createDragDropHandler, type FileInfo } from '@/lib/file';

export function useDragDrop() {
  const [isDragging, setIsDragging] = useState(false);
  const setContent = useEditorStore((state) => state.setContent);

  const handleFileDrop = useCallback((file: FileInfo) => {
    setContent(file.content);
  }, [setContent]);

  const dragDropHandlers = useMemo(() => createDragDropHandler({
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    onDrop: handleFileDrop,
    onError: (error) => console.error('Drop error:', error),
  }), [handleFileDrop]);

  useEffect(() => {
    const handleDragEnter = (e: DragEvent) => dragDropHandlers.handleDragEnter(e);
    const handleDragLeave = (e: DragEvent) => dragDropHandlers.handleDragLeave(e);
    const handleDragOver = (e: DragEvent) => dragDropHandlers.handleDragOver(e);
    const handleDrop = (e: DragEvent) => dragDropHandlers.handleDrop(e);

    document.addEventListener('dragenter', handleDragEnter);
    document.addEventListener('dragleave', handleDragLeave);
    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('drop', handleDrop);

    return () => {
      document.removeEventListener('dragenter', handleDragEnter);
      document.removeEventListener('dragleave', handleDragLeave);
      document.removeEventListener('dragover', handleDragOver);
      document.removeEventListener('drop', handleDrop);
    };
  }, [dragDropHandlers]);

  return { isDragging };
}
