'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FolderTree } from '@/components/save/FolderTree';
import { useDocumentsStore } from '@/stores/documentsStore';
import { useTabsStore } from '@/stores/tabsStore';
import { useUIStore } from '@/stores/uiStore';
import { toast } from 'sonner';
import { useAppStrings, format } from '@/lib/i18n/appStrings';
import type { Document } from '@/stores/documentsStore';

function HamburgerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

/** Line icons for the site links, 24×24 stroke paths. */
const LINK_ICONS = {
  guide: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  cheatsheet: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
  presets: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01',
  blog: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z',
} as const;

/**
 * Links to the rest of the site. The home page is the editor alone, so this
 * is where it links out to the guides and presets — for visitors, and for
 * crawlers, which is why the collapsed rail (the default, and what the
 * server renders) carries the main ones as icon links too.
 */
function SiteLinks({ collapsed }: { collapsed: boolean }) {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const t = useAppStrings().sidebar;
  const main = [
    { key: 'guide', href: `/${locale}/guide` },
    { key: 'cheatsheet', href: `/${locale}/cheatsheet` },
    { key: 'presets', href: `/${locale}/presets` },
    { key: 'blog', href: `/${locale}/blog` },
  ] as const;

  if (collapsed) {
    return (
      <nav aria-label={t.linksHeading} className="mt-auto flex flex-col items-center gap-1 pb-2">
        {main.map(({ key, href }) => (
          <Link
            key={key}
            href={href}
            title={t[key]}
            aria-label={t[key]}
            className="flex h-8 w-8 items-center justify-center rounded text-[var(--ui-text-muted)] hover:bg-[var(--ui-bg-hover)] hover:text-[var(--foreground)]"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={LINK_ICONS[key]} />
            </svg>
          </Link>
        ))}
      </nav>
    );
  }

  const secondary = [
    { key: 'about', href: `/${locale}/about` },
    { key: 'privacy', href: `/${locale}/privacy` },
    { key: 'terms', href: `/${locale}/terms` },
  ] as const;

  return (
    <nav aria-label={t.linksHeading} className="border-t border-[var(--ui-border)] px-3 py-3 text-xs">
      <ul>
        {[...main, { key: 'github', href: `/${locale}/github` } as const].map(({ key, href }) => (
          <li key={key}>
            <Link href={href} className="inline-block py-1 text-[var(--ui-text-muted)] hover:text-[var(--foreground)] hover:underline">
              {t[key]}
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-2 flex flex-wrap items-center gap-x-2 text-[11px] text-[var(--ui-text-muted)]">
        {secondary.map(({ key, href }, i) => (
          <span key={key} className="flex gap-2">
            {i > 0 && <span aria-hidden="true">·</span>}
            <Link href={href} className="inline-block py-1 hover:text-[var(--foreground)] hover:underline">
              {t[key]}
            </Link>
          </span>
        ))}
      </p>
    </nav>
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
  const text = useAppStrings();
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
      toast.success(text.toast.documentLoaded);
    },
    [tabsList, setActiveTab, addTab, text],
  );

  const handleCreateFolder = useCallback(
    (name: string, parentId: string | null) => {
      createFolder(name, parentId);
      toast.success(text.toast.folderCreated);
    },
    [createFolder, text],
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
      if (!window.confirm(format(text.sidebar.confirmDeleteDocument, { name: doc.name }))) return;
      deleteDocument(id);
      // Close any tabs that have this document open
      const tabWithDoc = tabsList.find((t) => t.documentId === id);
      if (tabWithDoc) {
        removeTab(tabWithDoc.id);
      }
      toast.success(text.toast.documentDeleted);
    },
    [documents, deleteDocument, tabsList, removeTab, text],
  );

  const handleDeleteFolder = useCallback(
    (id: string) => {
      const folder = folders.find((f) => f.id === id);
      if (!folder) return;
      if (!window.confirm(format(text.sidebar.confirmDeleteFolder, { name: folder.name }))) return;
      const success = deleteFolder(id);
      if (!success) {
        toast.error(text.toast.folderNotEmpty);
      } else {
        toast.success(text.toast.folderDeleted);
      }
    },
    [folders, deleteFolder, text],
  );

  const handleRenameDocument = useCallback(
    (id: string, newName: string) => {
      renameDocument(id, newName);
      // Sync tab title if this document is open
      const tab = tabsList.find((t) => t.documentId === id);
      if (tab) {
        useTabsStore.getState().updateTabTitle(tab.id, newName);
      }
      toast.success(text.toast.documentRenamed);
    },
    [renameDocument, tabsList, text],
  );

  const handleRenameFolder = useCallback(
    (id: string, newName: string) => {
      renameFolder(id, newName);
      toast.success(text.toast.folderRenamed);
    },
    [renameFolder, text],
  );

  const handleMoveDocument = useCallback(
    (id: string, newFolderId: string) => {
      const doc = documents.find((d) => d.id === id);
      if (!doc || doc.folderId === newFolderId) return;
      moveDocument(id, newFolderId);
      toast.success(text.toast.documentMoved);
    },
    [documents, moveDocument, text],
  );

  const handleMoveFolder = useCallback(
    (id: string, newParentId: string | null) => {
      const success = moveFolder(id, newParentId);
      if (!success) {
        toast.error(text.toast.cannotMoveThere);
      } else {
        toast.success(text.toast.folderMoved);
      }
    },
    [moveFolder, text],
  );

  const isEmpty = documents.length === 0 && folders.length === 0;

  // Collapsed: narrow rail. It takes up its own width so the button never
  // overlaps the editor toolbar next to it.
  if (!isSidebarOpen) {
    return (
      <div className="hidden md:flex h-full w-9 shrink-0 flex-col items-center border-r border-[var(--ui-border)] bg-[var(--background)] pt-1">
        <button
          onClick={toggleSidebar}
          className="flex h-8 w-8 items-center justify-center rounded hover:bg-[var(--ui-bg-hover)]"
          title={text.sidebar.open}
          aria-label={text.sidebar.open}
        >
          <HamburgerIcon className="h-4 w-4 text-[var(--ui-text-muted)]" />
        </button>
        <SiteLinks collapsed />
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
          title={text.sidebar.close}
          aria-label={text.sidebar.close}
        >
          <HamburgerIcon className="h-4 w-4" />
        </button>
        <span className="text-sm font-medium">{text.sidebar.menu}</span>
      </div>

      {/* Scrollable sections */}
      <div className="flex-1 overflow-y-auto">
        {/* Documents section */}
        <SidebarSection
          title={text.sidebar.documents}
          icon={
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          }
          actions={
            <button
              onClick={() => setIsCreatingRootFolder(true)}
              className="flex h-6 w-6 items-center justify-center rounded hover:bg-[var(--ui-bg-hover)] text-[var(--ui-text-muted)] hover:text-[var(--foreground)]"
              title={text.common.newFolder}
              aria-label={text.common.newFolder}
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
                placeholder={text.common.folderName}
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
              {text.common.noSavedDocuments}
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

      <SiteLinks collapsed={false} />
    </aside>
  );
}
