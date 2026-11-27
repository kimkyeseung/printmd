import { fileTitle, isSupportedFile, type FileInfo } from './fileHandler';

/** A dropped folder, with the files and subfolders inside it. */
export interface DroppedFolder {
  name: string;
  folders: DroppedFolder[];
  files: File[];
}

/** What was dropped: folders, plus any loose files dropped with them. */
export interface DroppedTree {
  folders: DroppedFolder[];
  files: File[];
  /**
   * Files and folders the browser could not read. On Windows this happens with
   * OneDrive files that are only in the cloud, locked system folders and very
   * long paths; they are skipped so the rest of the folder still comes in.
   */
  unreadable: number;
}

/** Hidden entries such as .git or .DS_Store are never documents. */
function isHidden(name: string): boolean {
  return name.startsWith('.');
}

function entryFile(entry: FileSystemFileEntry): Promise<File> {
  return new Promise((resolve, reject) => entry.file(resolve, reject));
}

/** All entries of a directory; readEntries returns them in batches. */
async function readAllEntries(dir: FileSystemDirectoryEntry): Promise<FileSystemEntry[]> {
  const reader = dir.createReader();
  const entries: FileSystemEntry[] = [];
  for (;;) {
    const batch = await new Promise<FileSystemEntry[]>((resolve, reject) => reader.readEntries(resolve, reject));
    if (batch.length === 0) return entries;
    entries.push(...batch);
  }
}

/** Read entries into `tree`'s shape, counting what can't be read instead of failing. */
async function readEntries(
  entries: FileSystemEntry[],
  into: { folders: DroppedFolder[]; files: File[] },
  tree: DroppedTree,
): Promise<void> {
  const sorted = [...entries].sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
  for (const entry of sorted) {
    if (isHidden(entry.name)) continue;
    if (entry.isDirectory) {
      const folder: DroppedFolder = { name: entry.name, folders: [], files: [] };
      try {
        await readEntries(await readAllEntries(entry as FileSystemDirectoryEntry), folder, tree);
      } catch (error) {
        console.warn('Could not read folder', entry.fullPath, error);
        tree.unreadable++;
      }
      into.folders.push(folder);
    } else if (entry.isFile) {
      try {
        into.files.push(await entryFile(entry as FileSystemFileEntry));
      } catch (error) {
        console.warn('Could not read file', entry.fullPath, error);
        tree.unreadable++;
      }
    }
  }
}

/**
 * Read a drop that contains at least one folder. Returns null when only files
 * were dropped, so the caller can open them the usual way.
 *
 * Entries must be taken from the DataTransfer before the drop handler awaits
 * anything: the browser empties it once the event is over.
 */
export function readDroppedFolders(dataTransfer: DataTransfer | null): Promise<DroppedTree> | null {
  const items = dataTransfer?.items;
  if (!items) return null;
  const entries: FileSystemEntry[] = [];
  for (const item of Array.from(items)) {
    if (item.kind !== 'file') continue;
    const entry = item.webkitGetAsEntry?.();
    if (entry) entries.push(entry);
  }
  if (!entries.some((e) => e.isDirectory)) return null;

  return (async () => {
    const tree: DroppedTree = { folders: [], files: [], unreadable: 0 };
    // Dropped items keep the order they were dropped in.
    for (const entry of entries) await readEntries([entry], tree, tree);
    return tree;
  })();
}

export interface FolderImportTarget {
  createFolder: (name: string, parentId: string | null) => string;
  saveDocument: (name: string, content: string, folderId: string) => string;
}

export interface FolderImportResult {
  folders: number;
  documents: number;
  /** Files and folders that could not be read, or documents that could not be converted. */
  failed: number;
  /** Files of other types, such as images, that were left out. */
  skipped: number;
}

/** Whether a folder holds a document anywhere inside it. */
function hasDocuments(folder: DroppedFolder): boolean {
  return folder.files.some(isSupportedFile) || folder.folders.some(hasDocuments);
}

/**
 * Add a dropped tree to the document sidebar, keeping its folder structure.
 * Folders with no documents anywhere inside (an images folder, say) are left
 * out rather than added empty.
 */
export async function importDroppedTree(
  tree: DroppedTree,
  target: FolderImportTarget,
  read: (file: File) => Promise<FileInfo>,
): Promise<FolderImportResult> {
  const result: FolderImportResult = { folders: 0, documents: 0, failed: tree.unreadable, skipped: 0 };

  const addFiles = async (files: File[], folderId: string) => {
    for (const file of files) {
      if (!isSupportedFile(file)) {
        result.skipped++;
        continue;
      }
      try {
        const info = await read(file);
        target.saveDocument(fileTitle(file.name), info.content, folderId);
        result.documents++;
      } catch {
        result.failed++;
      }
    }
  };

  const addFolder = async (folder: DroppedFolder, parentId: string | null) => {
    if (!hasDocuments(folder)) {
      result.skipped += countFiles(folder);
      return;
    }
    const id = target.createFolder(folder.name, parentId);
    result.folders++;
    for (const sub of folder.folders) await addFolder(sub, id);
    await addFiles(folder.files, id);
  };

  for (const folder of tree.folders) await addFolder(folder, null);
  await addFiles(tree.files, 'root');
  return result;
}

function countFiles(folder: DroppedFolder): number {
  return folder.files.length + folder.folders.reduce((n, f) => n + countFiles(f), 0);
}
