'use client';

import { useState, useCallback, useEffect } from 'react';
import { FolderTree } from './FolderTree';
import { useDocumentsStore } from '@/stores/documentsStore';

interface SaveDialogProps {
  isOpen: boolean;
  content: string;
  onClose: () => void;
  onSave: (id: string) => void;
}

function extractDefaultName(content: string): string {
  // Try to extract first H1 heading
  const h1Match = content.match(/^#\s+(.+)$/m);
  if (h1Match) {
    return h1Match[1].trim();
  }

  // Try to extract first sentence
  const lines = content.split('\n').filter((line) => line.trim() && !line.startsWith('#'));
  if (lines.length > 0) {
    const firstLine = lines[0].trim();
    // Get first sentence (up to 50 chars)
    const sentence = firstLine.split(/[.!?]/)[0];
    if (sentence.length > 50) {
      return sentence.substring(0, 47) + '...';
    }
    return sentence || 'Untitled';
  }

  return 'Untitled';
}

export function SaveDialog({ isOpen, content, onClose, onSave }: SaveDialogProps) {
  const folders = useDocumentsStore((state) => state.folders);
  const saveDocument = useDocumentsStore((state) => state.saveDocument);
  const createFolder = useDocumentsStore((state) => state.createFolder);

  const [selectedFolderId, setSelectedFolderId] = useState('root');
  const [documentName, setDocumentName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setSelectedFolderId('root');
      setDocumentName(extractDefaultName(content));
      setIsCreatingFolder(false);
      setNewFolderName('');
    }
  }, [isOpen, content]);

  const handleSave = useCallback(() => {
    if (!documentName.trim()) return;
    const id = saveDocument(documentName.trim(), content, selectedFolderId);
    onSave(id);
    onClose();
  }, [documentName, content, selectedFolderId, saveDocument, onSave, onClose]);

  const handleCreateFolder = useCallback(() => {
    if (!newFolderName.trim()) return;
    const parentId = selectedFolderId === 'root' ? null : selectedFolderId;
    createFolder(newFolderName.trim(), parentId);
    setNewFolderName('');
    setIsCreatingFolder(false);
  }, [newFolderName, selectedFolderId, createFolder]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSave();
      } else if (e.key === 'Escape') {
        onClose();
      }
    },
    [handleSave, onClose]
  );

  const handleFolderKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleCreateFolder();
      } else if (e.key === 'Escape') {
        setIsCreatingFolder(false);
        setNewFolderName('');
      }
    },
    [handleCreateFolder]
  );

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
        aria-labelledby="save-dialog-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--ui-border)] px-4 py-3">
          <h2 id="save-dialog-title" className="font-medium">
            Save Document
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
        <div className="p-4 space-y-4">
          {/* Folder selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <div className="border border-[var(--ui-border)] rounded-md max-h-48 overflow-y-auto">
              <FolderTree
                folders={folders}
                selectedFolderId={selectedFolderId}
                onFolderSelect={setSelectedFolderId}
              />
            </div>
          </div>

          {/* New folder creation */}
          {isCreatingFolder ? (
            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={handleFolderKeyDown}
                placeholder="Folder name"
                className="min-w-0 flex-1 rounded border border-[var(--ui-border)] px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleCreateFolder}
                  disabled={!newFolderName.trim()}
                  className="rounded bg-blue-500 px-3 py-2 text-sm text-white hover:bg-blue-600 disabled:opacity-50"
                >
                  Create
                </button>
                <button
                  onClick={() => {
                    setIsCreatingFolder(false);
                    setNewFolderName('');
                  }}
                  className="rounded border border-[var(--ui-border)] px-3 py-2 text-sm hover:bg-[var(--ui-bg-hover)]"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsCreatingFolder(true)}
              className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Folder
            </button>
          )}

          {/* Document name input */}
          <div>
            <label htmlFor="document-name" className="block text-sm font-medium mb-2">
              Document Name
            </label>
            <input
              id="document-name"
              type="text"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter document name"
              className="w-full rounded border border-[var(--ui-border)] px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-[var(--ui-border)] p-4">
          <button
            onClick={onClose}
            className="rounded border border-[var(--ui-border)] px-4 py-2 text-sm hover:bg-[var(--ui-bg-hover)]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!documentName.trim()}
            className="rounded bg-[var(--foreground)] px-4 py-2 text-sm text-[var(--background)] hover:opacity-90 disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
}

export default SaveDialog;
