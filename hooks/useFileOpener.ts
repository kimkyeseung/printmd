import { useCallback } from 'react';
import { toast } from 'sonner';
import { format, useAppStrings, type AppStrings } from '@/lib/i18n/appStrings';
import { fileTitle, readFile, UnsupportedFileError, type FileInfo } from '@/lib/file';
import type { HwpErrorCode } from '@/lib/import';
import { useTabsStore } from '@/stores';

/** What to tell the user when a file can't be opened. */
function errorMessage(error: Error, text: AppStrings): string {
  if (error instanceof UnsupportedFileError) return text.toast.unsupportedFile;
  // Checked by name: importing the error classes would pull the lazily
  // loaded converters into this chunk.
  if (error.name === 'HwpxError') return text.toast.hwpxFailed;
  if (error.name === 'HwpError') {
    const code = (error as Error & { code: HwpErrorCode }).code;
    if (code === 'encrypted') return text.toast.hwpEncrypted;
    if (code === 'distribution') return text.toast.hwpDistribution;
    if (code === 'old-version') return text.toast.hwpOldVersion;
    return text.toast.hwpFailed;
  }
  return text.toast.fileOpenFailed;
}

/**
 * Open files from the picker or a drop in a new tab, with the toasts that
 * explain conversions and failures.
 */
export function useFileOpener() {
  const addTab = useTabsStore((state) => state.addTab);
  const text = useAppStrings();

  const openFileInfo = useCallback((file: FileInfo) => {
    addTab({ content: file.content, title: fileTitle(file.name) });
    if (file.convertedFrom) {
      if (file.skippedImages) {
        toast.success(format(text.toast.hangulConvertedSkippedImages, { count: String(file.skippedImages) }));
      } else {
        toast.success(text.toast.hangulConverted);
      }
    }
  }, [addTab, text]);

  const reportFileError = useCallback((error: Error) => {
    console.error('File open error:', error);
    toast.error(errorMessage(error, text));
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
