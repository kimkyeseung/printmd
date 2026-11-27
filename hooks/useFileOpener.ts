import { useCallback } from 'react';
import { toast } from 'sonner';
import { format, useAppStrings, type AppStrings } from '@/lib/i18n/appStrings';
import { fileTitle, importDroppedTree, readFile, UnsupportedFileError, type DroppedTree, type FileInfo } from '@/lib/file';
import type { HwpErrorCode } from '@/lib/import';
import { useDocumentsStore, useTabsStore, useUIStore } from '@/stores';

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

  /** Open a file in a new tab; resolves to whether it opened. */
  const openFile = useCallback(async (file: File): Promise<boolean> => {
    try {
      openFileInfo(await readFile(file));
      return true;
    } catch (error) {
      reportFileError(error instanceof Error ? error : new Error(String(error)));
      return false;
    }
  }, [openFileInfo, reportFileError]);

  /**
   * Add dropped folders to the document sidebar with their structure, then
   * open the sidebar so the new folders can be seen.
   */
  const importFolders = useCallback(async (tree: Promise<DroppedTree>) => {
    try {
      const { createFolder, saveDocument } = useDocumentsStore.getState();
      const result = await importDroppedTree(await tree, { createFolder, saveDocument }, readFile);
      if (result.documents === 0) {
        if (result.failed > 0) {
          toast.error(format(text.toast.folderImportFailedFiles, { count: String(result.failed) }));
        } else {
          toast.error(text.toast.folderNoDocuments);
        }
        return;
      }
      let message = format(text.toast.folderImported, {
        folders: String(result.folders),
        documents: String(result.documents),
      });
      if (result.failed > 0) {
        message += ' ' + format(text.toast.folderImportFailedFiles, { count: String(result.failed) });
      }
      toast.success(message);
      useUIStore.getState().openSidebar();
    } catch (error) {
      console.error('Folder import error:', error);
      toast.error(text.toast.folderReadFailed);
    }
  }, [text]);

  return { openFile, openFileInfo, reportFileError, importFolders };
}
