import { useState, useEffect, useMemo } from 'react';
import { createDragDropHandler } from '@/lib/file';
import { useFileOpener } from './useFileOpener';

export function useDragDrop() {
  const [isDragging, setIsDragging] = useState(false);
  const { openFileInfo, reportFileError } = useFileOpener();

  const dragDropHandlers = useMemo(() => createDragDropHandler({
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    onDrop: openFileInfo,
    onError: reportFileError,
  }), [openFileInfo, reportFileError]);

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
