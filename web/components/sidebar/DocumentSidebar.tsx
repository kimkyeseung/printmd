'use client';

import { useState, useCallback } from 'react';
import { FolderTree } from '@/components/save/FolderTree';
import { useDocumentsStore } from '@/stores/documentsStore';
import { useEditorStore } from '@/stores/editorStore';
import { useUIStore } from '@/stores/uiStore';
import { toast } from 'sonner';
import type { Document } from '@/stores/documentsStore';

function HamburgerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

/** Collapsible sidebar section */
function SidebarSection({
  title,
  icon,
  defaultOpen = true,
  actions,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  defaultOpen?: boolean;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--ui-text-muted)] hover:text-[var(--foreground)] hover:bg-[var(--ui-bg-hover)]"
      >
        <svg
          className={`h-3 w-3 shrink-0 transition-transform ${open ? 'rotate-90' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="flex items-center gap-1.5">
          {icon}
          {title}
        </span>
        {actions && (
          <span className="ml-auto flex items-center" onClick={(e) => e.stopPropagation()}>
            {actions}
          </span>
        )}
      </button>
      {open && <div className="pb-1">{children}</div>}
    </div>
  );
}

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

  // Collapsed: protruding hamburger tab
  if (!isSidebarOpen) {
    return (
      <div className="relative hidden md:block h-full shrink-0 w-0">
        <button
          onClick={toggleSidebar}
          className="absolute left-0 top-3 z-10 flex h-8 w-7 items-center justify-center rounded-r-lg border border-l-0 border-[var(--ui-border)] bg-[var(--background)] shadow-sm hover:w-9 hover:bg-[var(--ui-bg-hover)] hover:shadow-md transition-all duration-150"
          title="Open sidebar"
        >
          <HamburgerIcon className="h-4 w-4 text-[var(--ui-text-muted)]" />
        </button>
      </div>
    );
  }

  // Expanded: full sidebar
  return (
    <aside className="hidden md:flex h-full w-60 shrink-0 flex-col border-r border-[var(--ui-border)] bg-[var(--background)]">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-[var(--ui-border)] px-3 py-2">
        <button
          onClick={toggleSidebar}
          className="rounded p-1 hover:bg-[var(--ui-bg-hover)] text-[var(--ui-text-muted)] hover:text-[var(--foreground)]"
          title="Close sidebar"
        >
          <HamburgerIcon className="h-4 w-4" />
        </button>
        <span className="text-sm font-medium">Menu</span>
      </div>

      {/* Scrollable sections */}
      <div className="flex-1 overflow-y-auto">
        {/* Documents section */}
        <SidebarSection
          title="Documents"
          icon={
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          }
          actions={
            <button
              onClick={() => setIsCreatingFolder(true)}
              className="rounded p-0.5 hover:bg-[var(--ui-bg-hover)] text-[var(--ui-text-muted)] hover:text-[var(--foreground)]"
              title="New Folder"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          }
        >
          {/* New folder input */}
          {isCreatingFolder && (
            <div className="flex gap-1 px-3 py-1.5">
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
                className="flex-1 min-w-0 rounded border border-[var(--ui-border)] bg-transparent px-2 py-1 text-xs"
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

          {isEmpty ? (
            <div className="px-3 py-6 text-center text-xs text-[var(--ui-text-muted)]">
              No saved documents
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
        </SidebarSection>
      </div>
    </aside>
  );
}
