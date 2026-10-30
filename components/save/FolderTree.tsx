'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { Folder, Document, DropPosition } from '@/stores/documentsStore';
import { useAppStrings, format } from '@/lib/i18n/appStrings';

interface FolderTreeProps {
  folders: Folder[];
  documents?: Document[];
  selectedFolderId: string;
  onFolderSelect: (folderId: string) => void;
  onDocumentSelect?: (document: Document) => void;
  onDeleteDocument?: (id: string) => void;
  onDeleteFolder?: (id: string) => void;
  onRenameDocument?: (id: string, newName: string) => void;
  onRenameFolder?: (id: string, newName: string) => void;
  onMoveDocument?: (id: string, newFolderId: string) => void;
  onMoveFolder?: (id: string, newParentId: string | null) => void;
  onCreateFolder?: (name: string, parentId: string | null) => void;
  /** Drop a document before/after another one; enables reordering by drag. */
  onReorderDocument?: (id: string, targetId: string, position: DropPosition) => void;
  /** Drop a folder before/after another one; enables reordering by drag. */
  onReorderFolder?: (id: string, targetId: string, position: DropPosition) => void;
  showDocuments?: boolean;
  currentDocumentId?: string | null;
  /** Documents open in a tab with unsaved edits; they get a dot. */
  dirtyDocumentIds?: ReadonlySet<string>;
}

type DragItem = { kind: 'doc' | 'folder'; id: string };
type DropTarget = { id: string; position: DropPosition | 'inside' };

/** Above or below the middle of the row under the pointer. */
function halfOf(e: React.DragEvent): DropPosition {
  const rect = e.currentTarget.getBoundingClientRect();
  return e.clientY < rect.top + rect.height / 2 ? 'before' : 'after';
}

/**
 * For a folder row: the top and bottom quarters drop next to the folder, the
 * middle drops into it.
 */
function zoneOf(e: React.DragEvent): DropPosition | 'inside' {
  const rect = e.currentTarget.getBoundingClientRect();
  const y = e.clientY - rect.top;
  if (y < rect.height / 4) return 'before';
  if (y > (rect.height * 3) / 4) return 'after';
  return 'inside';
}

const DROP_LINE: Record<DropPosition, string> = {
  before: 'shadow-[inset_0_2px_0_0_#60a5fa]',
  after: 'shadow-[inset_0_-2px_0_0_#60a5fa]',
};

function InlineRenameInput({
  defaultValue,
  onConfirm,
  onCancel,
}: {
  defaultValue: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.select();
  }, []);

  const handleConfirm = () => {
    const trimmed = value.trim();
    if (trimmed && trimmed !== defaultValue.trim()) {
      onConfirm(trimmed);
    } else {
      onCancel();
    }
  };

  return (
    <input
      ref={inputRef}
      autoFocus
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') handleConfirm();
        if (e.key === 'Escape') onCancel();
        e.stopPropagation();
      }}
      onBlur={handleConfirm}
      onClick={(e) => e.stopPropagation()}
      className="flex-1 min-w-0 rounded border border-[var(--ui-border)] bg-transparent px-1 py-0 text-sm"
    />
  );
}

export function FolderTree({
  folders,
  documents = [],
  selectedFolderId,
  onFolderSelect,
  onDocumentSelect,
  onDeleteDocument,
  onDeleteFolder,
  onRenameDocument,
  onRenameFolder,
  onMoveDocument,
  onMoveFolder,
  onCreateFolder,
  onReorderDocument,
  onReorderFolder,
  showDocuments = false,
  currentDocumentId,
  dirtyDocumentIds,
}: FolderTreeProps) {
  const text = useAppStrings().sidebar;
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(['root'])
  );
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<DropTarget | null>(null);
  // dataTransfer can't be read during dragover, so remember what is dragged.
  const dragItemRef = useRef<DragItem | null>(null);
  const [creatingInFolderId, setCreatingInFolderId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDragOverRoot, setIsDragOverRoot] = useState(false);

  const startDrag = (e: React.DragEvent, item: DragItem) => {
    e.dataTransfer.setData(item.kind === 'doc' ? 'application/x-doc-id' : 'application/x-folder-id', item.id);
    e.dataTransfer.effectAllowed = 'move';
    dragItemRef.current = item;
    setIsDragging(true);
  };

  const endDrag = () => {
    dragItemRef.current = null;
    setIsDragging(false);
    setIsDragOverRoot(false);
    setDropTarget(null);
  };

  const toggleExpand = useCallback((folderId: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  }, []);

  const getSubfolders = (parentId: string | null) => {
    return folders.filter((f) => f.parentId === parentId);
  };

  const getDocumentsInFolder = (folderId: string) => {
    return documents.filter((d) => d.folderId === folderId);
  };

  const renderDocument = (doc: Document, depth: number) => {
    const isRenaming = renamingId === `doc-${doc.id}`;

    return (
      <div
        key={doc.id}
        draggable={!isRenaming && !!onMoveDocument}
        onDragStart={(e) => startDrag(e, { kind: 'doc', id: doc.id })}
        onDragEnd={endDrag}
        onDragOver={(e) => {
          const item = dragItemRef.current;
          if (item?.kind !== 'doc' || !onReorderDocument) return;
          e.preventDefault();
          e.stopPropagation();
          e.dataTransfer.dropEffect = 'move';
          const position = item.id === doc.id ? null : halfOf(e);
          setDropTarget(position ? { id: doc.id, position } : null);
        }}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setDropTarget(null);
        }}
        onDrop={(e) => {
          const item = dragItemRef.current;
          if (item?.kind !== 'doc' || !onReorderDocument) return;
          e.preventDefault();
          e.stopPropagation();
          if (item.id !== doc.id) onReorderDocument(item.id, doc.id, halfOf(e));
          endDrag();
        }}
        className={`group flex items-center gap-1 rounded px-2 py-1.5 cursor-pointer hover:bg-[var(--ui-bg-hover)] ${
          currentDocumentId === doc.id ? 'bg-[var(--ui-bg-hover)] font-medium' : ''
        } ${dropTarget?.id === doc.id && dropTarget.position !== 'inside' ? DROP_LINE[dropTarget.position] : ''}`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => !isRenaming && onDocumentSelect?.(doc)}
      >
        <span className="w-3" />
        <svg
          className="w-4 h-4 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        {isRenaming ? (
          <InlineRenameInput
            defaultValue={doc.name}
            onConfirm={(newName) => {
              onRenameDocument?.(doc.id, newName);
              setRenamingId(null);
            }}
            onCancel={() => setRenamingId(null)}
          />
        ) : (
          <span
            className="flex-1 text-sm truncate"
            onDoubleClick={(e) => {
              if (onRenameDocument) {
                e.stopPropagation();
                setRenamingId(`doc-${doc.id}`);
              }
            }}
          >
            {doc.name}
          </span>
        )}
        {!isRenaming && dirtyDocumentIds?.has(doc.id) && (
          <span
            className="h-2 w-2 shrink-0 rounded-full bg-red-500"
            aria-label={text.unsaved}
            title={text.unsaved}
          />
        )}
        {!isRenaming && onDeleteDocument && (
          <button
            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 text-red-500"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteDocument(doc.id);
            }}
            aria-label={format(text.deleteItem, { name: doc.name })}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        )}
      </div>
    );
  };

  const renderFolder = (
    folder: { id: string; name: string; parentId: string | null },
    depth: number = 0
  ) => {
    const isExpanded = expandedFolders.has(folder.id);
    const isSelected = selectedFolderId === folder.id;
    const subfolders = getSubfolders(folder.id === 'root' ? null : folder.id);
    const folderDocuments = showDocuments ? getDocumentsInFolder(folder.id) : [];
    const hasChildren = subfolders.length > 0 || folderDocuments.length > 0;
    const isRenaming = renamingId === `folder-${folder.id}`;

    const folderDrop = dropTarget?.id === folder.id ? dropTarget.position : null;

    return (
      <div key={folder.id}>
        <div
          role="button"
          tabIndex={0}
          draggable={!isRenaming && folder.id !== 'root' && !!onMoveFolder}
          onDragStart={(e) => startDrag(e, { kind: 'folder', id: folder.id })}
          onDragEnd={endDrag}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.dataTransfer.dropEffect = 'move';
            const item = dragItemRef.current;
            if (item?.kind === 'folder' && item.id === folder.id) {
              setDropTarget(null);
              return;
            }
            const position = item?.kind === 'folder' && onReorderFolder && folder.id !== 'root' ? zoneOf(e) : 'inside';
            setDropTarget({ id: folder.id, position });
          }}
          onDragLeave={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              setDropTarget(null);
            }
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const docId = e.dataTransfer.getData('application/x-doc-id');
            const folderId = e.dataTransfer.getData('application/x-folder-id');
            const position = folderId && onReorderFolder && folder.id !== 'root' ? zoneOf(e) : 'inside';
            endDrag();
            if (docId && onMoveDocument) {
              onMoveDocument(docId, folder.id);
            } else if (folderId && folderId !== folder.id) {
              if (position !== 'inside') {
                onReorderFolder?.(folderId, folder.id, position);
              } else if (onMoveFolder) {
                onMoveFolder(folderId, folder.id === 'root' ? null : folder.id);
              }
            }
          }}
          className={`group flex items-center gap-1 rounded px-2 py-1.5 cursor-pointer hover:bg-[var(--ui-bg-hover)] ${
            isSelected ? 'bg-[var(--ui-bg-hover)]' : ''
          } ${folderDrop === 'inside' ? 'ring-2 ring-blue-400 bg-blue-50/30' : folderDrop ? DROP_LINE[folderDrop] : ''}`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => {
            if (!isRenaming) {
              onFolderSelect(folder.id);
              toggleExpand(folder.id);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onFolderSelect(folder.id);
              toggleExpand(folder.id);
            }
          }}
        >
          {hasChildren ? (
            <svg
              className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          ) : (
            <span className="w-3" />
          )}

          {/* Folder icon */}
          <svg
            className="w-4 h-4 text-yellow-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
          </svg>

          {/* Folder name */}
          {isRenaming ? (
            <InlineRenameInput
              defaultValue={folder.name}
              onConfirm={(newName) => {
                onRenameFolder?.(folder.id, newName);
                setRenamingId(null);
              }}
              onCancel={() => setRenamingId(null)}
            />
          ) : (
            <span
              className="flex-1 text-sm truncate"
              onDoubleClick={(e) => {
                if (folder.id !== 'root' && onRenameFolder) {
                  e.stopPropagation();
                  setRenamingId(`folder-${folder.id}`);
                }
              }}
            >
              {folder.name}
            </span>
          )}

          {/* Action buttons */}
          {!isRenaming && (
            <span className="flex items-center opacity-0 group-hover:opacity-100">
              {/* Add subfolder button */}
              {onCreateFolder && (
                <button
                  className="p-1 rounded hover:bg-[var(--ui-bg-hover)] text-[var(--ui-text-muted)] hover:text-[var(--foreground)]"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCreatingInFolderId(folder.id);
                    setExpandedFolders((prev) => new Set(prev).add(folder.id));
                  }}
                  aria-label={format(text.addSubfolder, { name: folder.name })}
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              )}
              {/* Delete button for non-root folders */}
              {folder.id !== 'root' && onDeleteFolder && (
                <button
                  className="p-1 rounded hover:bg-red-100 text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteFolder(folder.id);
                  }}
                  aria-label={format(text.deleteItem, { name: folder.name })}
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              )}
            </span>
          )}
        </div>

        {/* Children */}
        {isExpanded && (
          <div>
            {/* Inline new subfolder input */}
            {creatingInFolderId === folder.id && onCreateFolder && (
              <div
                className="flex items-center gap-1 px-2 py-1"
                style={{ paddingLeft: `${(depth + 1) * 16 + 8}px` }}
              >
                <svg className="w-4 h-4 text-yellow-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                </svg>
                <InlineRenameInput
                  defaultValue=""
                  onConfirm={(name) => {
                    onCreateFolder(name, folder.id === 'root' ? null : folder.id);
                    setCreatingInFolderId(null);
                  }}
                  onCancel={() => setCreatingInFolderId(null)}
                />
              </div>
            )}
            {subfolders.map((subfolder) => renderFolder(subfolder, depth + 1))}
            {showDocuments && folderDocuments.map((doc) => renderDocument(doc, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const rootSubfolders = getSubfolders(null);
  const rootDocuments = showDocuments ? getDocumentsInFolder('root') : [];

  const handleRootDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    endDrag();
    const docId = e.dataTransfer.getData('application/x-doc-id');
    const folderId = e.dataTransfer.getData('application/x-folder-id');
    if (docId && onMoveDocument) {
      onMoveDocument(docId, 'root');
    } else if (folderId && onMoveFolder) {
      onMoveFolder(folderId, null);
    }
  };

  return (
    <div
      className="text-sm"
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
      }}
      onDrop={handleRootDrop}
    >
      {rootSubfolders.map((subfolder) => renderFolder(subfolder, 0))}
      {rootDocuments.map((doc) => renderDocument(doc, 0))}

      {/* Visible root drop zone during drag */}
      {isDragging && (
        <div
          className={`mx-2 mt-1 flex items-center gap-1.5 rounded border border-dashed px-2 py-2 text-xs transition-colors ${
            isDragOverRoot
              ? 'border-blue-400 bg-blue-50/50 text-blue-600'
              : 'border-[var(--ui-border)] text-[var(--ui-text-muted)]'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.dataTransfer.dropEffect = 'move';
            setIsDragOverRoot(true);
          }}
          onDragLeave={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              setIsDragOverRoot(false);
            }
          }}
          onDrop={handleRootDrop}
        >
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" />
          </svg>
          {text.moveToRoot}
        </div>
      )}
    </div>
  );
}
