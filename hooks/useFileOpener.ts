import { useCallback } from 'react';
import { toast } from 'sonner';
import { format, useAppStrings } from '@/lib/i18n/appStrings';
import { fileTitle, readFile, UnsupportedFileError, type FileInfo } from '@/lib/file';
import { useTabsStore } from '@/stores';

/**
 * Open files from the picker or a drop in a new tab, with the toasts that
 * explain conversions and failures.
 */
export function useFileOpener() {
  const addTab = useTabsStore((state) => state.addTab);
  const text = useAppStrings();

  const openFileInfo = useCallback((file: FileInfo) => {
    addTab({ content: file.content, title: fileTitle(file.name) });
    if (file.convertedFrom === 'hwpx') {
      if (file.skippedImages) {
        toast.success(format(text.toast.hwpxConvertedSkippedImages, { count: String(file.skippedImages) }));
      } else {
        toast.success(text.toast.hwpxConverted);
      }
    }
  }, [addTab, text]);

  const reportFileError = useCallback((error: Error) => {
    console.error('File open error:', error);
    if (error instanceof UnsupportedFileError) {
      const isHwp = error.fileName.toLowerCase().endsWith('.hwp');
      toast.error(isHwp ? text.toast.hwpNotSupported : text.toast.unsupportedFile);
    } else if (error.name === 'HwpxError') {
      // Checked by name: importing the class would pull the lazily loaded
      // converter into this chunk.
      toast.error(text.toast.hwpxFailed);
    } else {
      toast.error(text.toast.fileOpenFailed);
    }
  }, [text]);

  const openFile = useCallback(async (file: File) => {
    try {
      openFileInfo(await readFile(file));
    } catch (error) {
      reportFileError(error instanceof Error ? error : new Error(String(error)));
    }
  }, [openFileInfo, reportFileError]);

  return { openFile, openFileInfo, reportFileError };
}
