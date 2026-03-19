'use client';

import { useState, useCallback } from 'react';
import { FolderTree } from '@/components/save/FolderTree';
import { useDocumentsStore } from '@/stores/documentsStore';
import { useEditorStore } from '@/stores/editorStore';
import { useUIStore } from '@/stores/uiStore';
import { toast } from 'sonner';
import type { Document } from '@/stores/documentsStore';

export function DocumentSidebar() {
  const isSidebarOpen = useUIStore((s) => s.isSidebarOpen);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  const folders = useDocumentsStore((s) => s.folders);
  const documents = useDocumentsStore((s) => s.documents);
  const createFolder = useDocumentsStore((s) => s.createFolder);

  const setContent = useEditorStore((s) => s.setContent);
  const currentDocumentId = useEditorStore((s) => s.currentDocumentId);
  const setCurrentDocumentId = useEditorStore((s) => s.setCurrentDocumentId);

  const [selectedFolderId, setSelectedFolderId] = useState('root');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const handleDocumentSelect = useCallback(
    (doc: Document) => {
      setContent(doc.content);
      setCurrentDocumentId(doc.id);
      try {
        localStorage.setItem('printmd-content', doc.content);
      } catch {
        // ignore
      }
      toast.success('문서를 불러왔습니다');
    },
    [setContent, setCurrentDocumentId],
  );

  const handleCreateFolder = useCallback(() => {
    if (newFolderName.trim()) {
      const parentId = selectedFolderId === 'root' ? null : selectedFolderId;
      createFolder(newFolderName.trim(), parentId);
      setNewFolderName('');
      setIsCreatingFolder(false);
    }
  }, [newFolderName, selectedFolderId, createFolder]);

  const isEmpty = documents.length === 0 && folders.length === 0;

  // Collapsed state: thin toggle strip
  if (!isSidebarOpen) {
    return (
      <div className="hidden md:flex h-full shrink-0 border-r border-[var(--ui-border)]">
        <button
          onClick={toggleSidebar}
          className="flex w-8 items-center justify-center hover:bg-[var(--ui-bg-hover)] transition-colors"
          title="Open sidebar"
        >
          <svg className="h-4 w-4 text-[var(--ui-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
        </button>
      </div>
    );
  }

  // Expanded state: full sidebar
  return (
    <aside className="hidden md:flex h-full w-60 shrink-0 flex-col border-r border-[var(--ui-border)] bg-[var(--background)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--ui-border)] px-3 py-2">
        <span className="text-sm font-medium">Documents</span>
        <div className="flex items-center gap-0.5">
          {/* New Folder */}
          <button
            onClick={() => setIsCreatingFolder(true)}
            className="rounded p-1 hover:bg-[var(--ui-bg-hover)] text-[var(--ui-text-muted)] hover:text-[var(--foreground)]"
            title="New Folder"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
          </button>
          {/* Close */}
          <button
            onClick={toggleSidebar}
            className="rounded p-1 hover:bg-[var(--ui-bg-hover)] text-[var(--ui-text-muted)] hover:text-[var(--foreground)]"
            title="Close sidebar"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* New folder input */}
      {isCreatingFolder && (
        <div className="flex gap-1 border-b border-[var(--ui-border)] px-3 py-2">
          <input
            autoFocus
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreateFolder();
              if (e.key === 'Escape') {
                setIsCreatingFolder(false);
                setNewFolderName('');
              }
            }}
            placeholder="Folder name"
            className="flex-1 min-w-0 rounded border border-[var(--ui-border)] bg-transparent px-2 py-1 text-sm"
          />
          <button
            onClick={handleCreateFolder}
            disabled={!newFolderName.trim()}
            className="shrink-0 rounded bg-[var(--foreground)] px-2 py-1 text-xs text-[var(--background)] disabled:opacity-30"
          >
            OK
          </button>
        </div>
      )}

      {/* Tree */}
      <div className="flex-1 overflow-y-auto p-1">
        {isEmpty ? (
          <div className="flex flex-col items-center gap-2 py-12 text-[var(--ui-text-muted)]">
            <svg className="h-10 w-10 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-xs">No saved documents</p>
          </div>
        ) : (
          <FolderTree
            folders={folders}
            documents={documents}
            selectedFolderId={selectedFolderId}
            onFolderSelect={setSelectedFolderId}
            onDocumentSelect={handleDocumentSelect}
            currentDocumentId={currentDocumentId}
            showDocuments
          />
        )}
      </div>
    </aside>
  );
}
