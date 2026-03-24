'use client';

import { useState, useCallback } from 'react';
import { FolderTree } from '@/components/save/FolderTree';
import { useDocumentsStore } from '@/stores/documentsStore';
import { useTabsStore } from '@/stores/tabsStore';
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
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen(!open)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(!open); } }}
        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--ui-text-muted)] hover:text-[var(--foreground)] hover:bg-[var(--ui-bg-hover)] cursor-pointer select-none"
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
      </div>
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

  const tabsList = useTabsStore((s) => s.tabs);
  const addTab = useTabsStore((s) => s.addTab);
  const setActiveTab = useTabsStore((s) => s.setActiveTab);
  const removeTab = useTabsStore((s) => s.removeTab);
  const activeTab = useTabsStore((s) => s.getActiveTab());
  const currentDocumentId = activeTab?.documentId ?? null;

  const [selectedFolderId, setSelectedFolderId] = useState('root');
  const [isCreatingRootFolder, setIsCreatingRootFolder] = useState(false);

  const handleDocumentSelect = useCallback(
    (doc: Document) => {
      // Check if this document is already open in a tab
      const existingTab = tabsList.find((t) => t.documentId === doc.id);
      if (existingTab) {
        setActiveTab(existingTab.id);
        return;
      }
      addTab({ documentId: doc.id, content: doc.content, title: doc.name });
      toast.success('문서를 불러왔습니다');
    },
    [tabsList, setActiveTab, addTab],
  );

  const handleCreateFolder = useCallback(
    (name: string, parentId: string | null) => {
      createFolder(name, parentId);
      toast.success('폴더가 생성되었습니다');
    },
    [createFolder],
  );

  const deleteDocument = useDocumentsStore((s) => s.deleteDocument);
  const deleteFolder = useDocumentsStore((s) => s.deleteFolder);
  const renameDocument = useDocumentsStore((s) => s.renameDocument);
  const renameFolder = useDocumentsStore((s) => s.renameFolder);
  const moveDocument = useDocumentsStore((s) => s.moveDocument);
  const moveFolder = useDocumentsStore((s) => s.moveFolder);

  const handleDeleteDocument = useCallback(
    (id: string) => {
      const doc = documents.find((d) => d.id === id);
      if (!doc) return;
      if (!window.confirm(`"${doc.name}" 문서를 삭제하시겠습니까?`)) return;
      deleteDocument(id);
      // Close any tabs that have this document open
      const tabWithDoc = tabsList.find((t) => t.documentId === id);
      if (tabWithDoc) {
        removeTab(tabWithDoc.id);
      }
      toast.success('문서가 삭제되었습니다');
    },
    [documents, deleteDocument, tabsList, removeTab],
  );

  const handleDeleteFolder = useCallback(
    (id: string) => {
      const folder = folders.find((f) => f.id === id);
      if (!folder) return;
      if (!window.confirm(`"${folder.name}" 폴더를 삭제하시겠습니까?`)) return;
      const success = deleteFolder(id);
      if (!success) {
        toast.error('폴더 안에 문서나 하위 폴더가 있어 삭제할 수 없습니다');
      } else {
        toast.success('폴더가 삭제되었습니다');
      }
    },
    [folders, deleteFolder],
  );

  const handleRenameDocument = useCallback(
    (id: string, newName: string) => {
      renameDocument(id, newName);
      // Sync tab title if this document is open
      const tab = tabsList.find((t) => t.documentId === id);
      if (tab) {
        useTabsStore.getState().updateTabTitle(tab.id, newName);
      }
      toast.success('문서 이름이 변경되었습니다');
    },
    [renameDocument, tabsList],
  );

  const handleRenameFolder = useCallback(
    (id: string, newName: string) => {
      renameFolder(id, newName);
      toast.success('폴더 이름이 변경되었습니다');
    },
    [renameFolder],
  );

  const handleMoveDocument = useCallback(
    (id: string, newFolderId: string) => {
      const doc = documents.find((d) => d.id === id);
      if (!doc || doc.folderId === newFolderId) return;
      moveDocument(id, newFolderId);
      toast.success('문서를 이동했습니다');
    },
    [documents, moveDocument],
  );

  const handleMoveFolder = useCallback(
    (id: string, newParentId: string | null) => {
      const success = moveFolder(id, newParentId);
      if (!success) {
        toast.error('해당 위치로 이동할 수 없습니다');
      } else {
        toast.success('폴더를 이동했습니다');
      }
    },
    [moveFolder],
  );

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
              onClick={() => setIsCreatingRootFolder(true)}
              className="rounded p-0.5 hover:bg-[var(--ui-bg-hover)] text-[var(--ui-text-muted)] hover:text-[var(--foreground)]"
              title="New Folder"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          }
        >
          {/* Root-level new folder input */}
          {isCreatingRootFolder && (
            <div className="flex items-center gap-1 px-3 py-1.5">
              <svg className="w-4 h-4 text-yellow-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
              </svg>
              <input
                autoFocus
                placeholder="Folder name"
                className="flex-1 min-w-0 rounded border border-[var(--ui-border)] bg-transparent px-1 py-0 text-xs"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const value = (e.target as HTMLInputElement).value.trim();
                    if (value) {
                      handleCreateFolder(value, null);
                      setIsCreatingRootFolder(false);
                    }
                  }
                  if (e.key === 'Escape') setIsCreatingRootFolder(false);
                }}
                onBlur={(e) => {
                  const value = e.target.value.trim();
                  if (value) {
                    handleCreateFolder(value, null);
                  }
                  setIsCreatingRootFolder(false);
                }}
              />
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
              onDeleteDocument={handleDeleteDocument}
              onDeleteFolder={handleDeleteFolder}
              onRenameDocument={handleRenameDocument}
              onRenameFolder={handleRenameFolder}
              onMoveDocument={handleMoveDocument}
              onMoveFolder={handleMoveFolder}
              onCreateFolder={handleCreateFolder}
              showDocuments
            />
          )}
        </SidebarSection>
      </div>
    </aside>
  );
}
