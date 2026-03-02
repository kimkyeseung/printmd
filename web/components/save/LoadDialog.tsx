'use client';

import { useState, useCallback } from 'react';
import { FolderTree } from './FolderTree';
import { ConfirmDialog } from './ConfirmDialog';
import { useDocumentsStore, type Document, type Folder } from '@/stores/documentsStore';

interface LoadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLoad: (id: string, content: string) => void;
}

export function LoadDialog({ isOpen, onClose, onLoad }: LoadDialogProps) {
  const folders = useDocumentsStore((state) => state.folders);
  const documents = useDocumentsStore((state) => state.documents);
  const deleteDocument = useDocumentsStore((state) => state.deleteDocument);
  const deleteFolder = useDocumentsStore((state) => state.deleteFolder);
  const getDocumentsInFolder = useDocumentsStore((state) => state.getDocumentsInFolder);
  const getFoldersInFolder = useDocumentsStore((state) => state.getFoldersInFolder);

  const [selectedFolderId, setSelectedFolderId] = useState('root');
  const [confirmDelete, setConfirmDelete] = useState<{
    type: 'document' | 'folder';
    id: string;
    name: string;
    hasContent?: boolean;
  } | null>(null);

  const handleDocumentSelect = useCallback(
    (document: Document) => {
      onLoad(document.id, document.content);
      onClose();
    },
    [onLoad, onClose]
  );

  const handleDeleteDocument = useCallback((id: string) => {
    const doc = documents.find((d) => d.id === id);
    if (doc) {
      setConfirmDelete({
        type: 'document',
        id,
        name: doc.name,
      });
    }
  }, [documents]);

  const handleDeleteFolder = useCallback(
    (id: string) => {
      const folder = folders.find((f) => f.id === id);
      if (!folder) return;

      // Check if folder has documents or subfolders
      const folderDocs = getDocumentsInFolder(id);
      const subfolders = getFoldersInFolder(id);
      const hasContent = folderDocs.length > 0 || subfolders.length > 0;

      setConfirmDelete({
        type: 'folder',
        id,
        name: folder.name,
        hasContent,
      });
    },
    [folders, getDocumentsInFolder, getFoldersInFolder]
  );

  const handleConfirmDelete = useCallback(() => {
    if (!confirmDelete) return;

    if (confirmDelete.type === 'document') {
      deleteDocument(confirmDelete.id);
    } else {
      const success = deleteFolder(confirmDelete.id);
      if (!success) {
        // This shouldn't happen because we show warning, but just in case
        console.warn('Cannot delete folder with content');
      }
    }
    setConfirmDelete(null);
  }, [confirmDelete, deleteDocument, deleteFolder]);

  const isEmpty = documents.length === 0 && folders.length === 0;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        className="fixed left-1/2 top-1/2 z-50 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-[var(--ui-border)] bg-[var(--background)] shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="load-dialog-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--ui-border)] px-4 py-3">
          <h2 id="load-dialog-title" className="font-medium">
            Load Document
          </h2>
          <button
            onClick={onClose}
            className="rounded p-1 hover:bg-[var(--ui-bg-hover)]"
            aria-label="Close"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {isEmpty ? (
            <div className="py-8 text-center text-sm text-[var(--ui-text-muted)]">
              <svg
                className="mx-auto h-12 w-12 mb-3 opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p>No saved documents</p>
              <p className="mt-1 text-xs">Save a document to see it here</p>
            </div>
          ) : (
            <div className="border border-[var(--ui-border)] rounded-md max-h-72 overflow-y-auto">
              <FolderTree
                folders={folders}
                documents={documents}
                selectedFolderId={selectedFolderId}
                onFolderSelect={setSelectedFolderId}
                onDocumentSelect={handleDocumentSelect}
                onDeleteDocument={handleDeleteDocument}
                onDeleteFolder={handleDeleteFolder}
                showDocuments
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-[var(--ui-border)] p-4">
          <button
            onClick={onClose}
            className="rounded border border-[var(--ui-border)] px-4 py-2 text-sm hover:bg-[var(--ui-bg-hover)]"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!confirmDelete}
        title={
          confirmDelete?.type === 'document'
            ? 'Delete Document'
            : 'Delete Folder'
        }
        message={
          confirmDelete?.type === 'document'
            ? `Are you sure you want to delete "${confirmDelete?.name}"?`
            : confirmDelete?.hasContent
              ? `Folder "${confirmDelete?.name}" contains documents or subfolders. Please remove them first.`
              : `Are you sure you want to delete folder "${confirmDelete?.name}"?`
        }
        confirmLabel={confirmDelete?.hasContent ? 'OK' : 'Delete'}
        cancelLabel={confirmDelete?.hasContent ? 'Cancel' : 'Cancel'}
        onConfirm={
          confirmDelete?.hasContent
            ? () => setConfirmDelete(null)
            : handleConfirmDelete
        }
        onCancel={() => setConfirmDelete(null)}
      />
    </>
  );
}
