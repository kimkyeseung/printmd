'use client';

import { useState, useCallback } from 'react';
import type { Folder, Document } from '@/stores/documentsStore';

interface FolderTreeProps {
  folders: Folder[];
  documents?: Document[];
  selectedFolderId: string;
  onFolderSelect: (folderId: string) => void;
  onDocumentSelect?: (document: Document) => void;
  onDeleteDocument?: (id: string) => void;
  onDeleteFolder?: (id: string) => void;
  showDocuments?: boolean;
  currentDocumentId?: string | null;
}

export function FolderTree({
  folders,
  documents = [],
  selectedFolderId,
  onFolderSelect,
  onDocumentSelect,
  onDeleteDocument,
  onDeleteFolder,
  showDocuments = false,
  currentDocumentId,
}: FolderTreeProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(['root'])
  );

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

  const renderFolder = (
    folder: { id: string; name: string; parentId: string | null },
    depth: number = 0
  ) => {
    const isExpanded = expandedFolders.has(folder.id);
    const isSelected = selectedFolderId === folder.id;
    const subfolders = getSubfolders(folder.id === 'root' ? null : folder.id);
    const folderDocuments = showDocuments ? getDocumentsInFolder(folder.id) : [];
    const hasChildren = subfolders.length > 0 || folderDocuments.length > 0;

    return (
      <div key={folder.id}>
        <div
          role="button"
          tabIndex={0}
          className={`group flex items-center gap-1 rounded px-2 py-1.5 cursor-pointer hover:bg-[var(--ui-bg-hover)] ${
            isSelected ? 'bg-[var(--ui-bg-hover)]' : ''
          }`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => {
            onFolderSelect(folder.id)
            toggleExpand(folder.id);
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
          <span className="flex-1 text-sm truncate">{folder.name}</span>

          {/* Delete button for non-root folders */}
          {folder.id !== 'root' && onDeleteFolder && (
            <button
              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 text-red-500"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteFolder(folder.id);
              }}
              aria-label={`Delete ${folder.name}`}
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

        {/* Children */}
        {isExpanded && (
          <div>
            {subfolders.map((subfolder) => renderFolder(subfolder, depth + 1))}
            {showDocuments &&
              folderDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className={`group flex items-center gap-1 rounded px-2 py-1.5 cursor-pointer hover:bg-[var(--ui-bg-hover)] ${
                    currentDocumentId === doc.id ? 'bg-[var(--ui-bg-hover)] font-medium' : ''
                  }`}
                  style={{ paddingLeft: `${(depth + 1) * 16 + 8}px` }}
                  onClick={() => onDocumentSelect?.(doc)}
                >
                  {/* Spacer */}
                  <span className="w-4" />

                  {/* Document icon */}
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

                  {/* Document name */}
                  <span className="flex-1 text-sm truncate">{doc.name}</span>

                  {/* Delete button */}
                  {onDeleteDocument && (
                    <button
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteDocument(doc.id);
                      }}
                      aria-label={`Delete ${doc.name}`}
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
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
              ))}
          </div>
        )}
      </div>
    );
  };

  const rootSubfolders = getSubfolders(null);
  const rootDocuments = showDocuments ? getDocumentsInFolder('root') : [];

  return (
    <div className="text-sm">
      {rootSubfolders.map((subfolder) => renderFolder(subfolder, 0))}
      {rootDocuments.map((doc) => (
        <div
          key={doc.id}
          className={`group flex items-center gap-1 rounded px-2 py-1.5 cursor-pointer hover:bg-[var(--ui-bg-hover)] ${
            currentDocumentId === doc.id ? 'bg-[var(--ui-bg-hover)] font-medium' : ''
          }`}
          style={{ paddingLeft: '8px' }}
          onClick={() => onDocumentSelect?.(doc)}
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
          <span className="flex-1 text-sm truncate">{doc.name}</span>
          {onDeleteDocument && (
            <button
              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 text-red-500"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteDocument(doc.id);
              }}
              aria-label={`Delete ${doc.name}`}
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
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
      ))}
    </div>
  );
}
