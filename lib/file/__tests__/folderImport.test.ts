import { describe, it, expect } from 'vitest';
import { importDroppedTree, readDroppedFolders, type DroppedFolder } from '../folderImport';
import type { FileInfo } from '../fileHandler';

const file = (name: string, content = name) => new File([content], name);

function fakeTarget() {
  const folders: { id: string; name: string; parentId: string | null }[] = [];
  const documents: { name: string; content: string; folderId: string }[] = [];
  return {
    folders,
    documents,
    createFolder: (name: string, parentId: string | null) => {
      const id = `f${folders.length}`;
      folders.push({ id, name, parentId });
      return id;
    },
    saveDocument: (name: string, content: string, folderId: string) => {
      documents.push({ name, content, folderId });
      return `d${documents.length}`;
    },
  };
}

const read = async (f: File): Promise<FileInfo> => {
  if (f.name.startsWith('broken')) throw new Error('bad');
  return { name: f.name, content: await f.text(), size: f.size, lastModified: 0 };
};

describe('importDroppedTree', () => {
  it('keeps the folder structure and drops file extensions from names', async () => {
    const docs: DroppedFolder = {
      name: 'docs',
      files: [file('intro.md', '# Intro')],
      folders: [{ name: 'guide', files: [file('setup.txt')], folders: [] }],
    };
    const target = fakeTarget();
    const result = await importDroppedTree({ folders: [docs], files: [], unreadable: 0 }, target, read);

    expect(target.folders).toEqual([
      { id: 'f0', name: 'docs', parentId: null },
      { id: 'f1', name: 'guide', parentId: 'f0' },
    ]);
    expect(target.documents).toEqual([
      { name: 'setup', content: 'setup.txt', folderId: 'f1' },
      { name: 'intro', content: '# Intro', folderId: 'f0' },
    ]);
    expect(result).toEqual({ folders: 2, documents: 2, failed: 0, skipped: 0 });
  });

  it('leaves out folders with no documents and counts skipped files', async () => {
    const tree = {
      folders: [
        {
          name: 'site',
          files: [file('index.md'), file('logo.png')],
          folders: [{ name: 'images', files: [file('a.png'), file('b.jpg')], folders: [] }],
        },
      ],
      files: [],
      unreadable: 0,
    };
    const target = fakeTarget();
    const result = await importDroppedTree(tree, target, read);

    expect(target.folders.map((f) => f.name)).toEqual(['site']);
    expect(result).toEqual({ folders: 1, documents: 1, failed: 0, skipped: 3 });
  });

  it('puts loose files at the top level and counts files that fail to read', async () => {
    const tree = {
      folders: [{ name: 'notes', files: [file('broken.md')], folders: [] }],
      files: [file('readme.md')],
      unreadable: 0,
    };
    const target = fakeTarget();
    const result = await importDroppedTree(tree, target, read);

    expect(target.documents).toEqual([{ name: 'readme', content: 'readme.md', folderId: 'root' }]);
    expect(result).toEqual({ folders: 1, documents: 1, failed: 1, skipped: 0 });
  });
});

describe('readDroppedFolders', () => {
  type Entry = Partial<FileSystemDirectoryEntry & FileSystemFileEntry>;

  const fileEntry = (f: File): Entry => ({
    name: f.name,
    isFile: true,
    isDirectory: false,
    file: (ok: FileCallback) => ok(f),
  });
  const dirEntry = (name: string, children: Entry[]): Entry => ({
    name,
    isFile: false,
    isDirectory: true,
    createReader: () => {
      // Hand entries back in two batches, as browsers do for large folders.
      const batches = [children.slice(0, 1), children.slice(1), []];
      return { readEntries: (ok: FileSystemEntriesCallback) => ok(batches.shift() as FileSystemEntry[]) };
    },
  });
  const transfer = (entries: Entry[]) =>
    ({
      items: entries.map((e) => ({ kind: 'file', webkitGetAsEntry: () => e })),
    }) as unknown as DataTransfer;

  it('returns null when only files are dropped', () => {
    expect(readDroppedFolders(transfer([fileEntry(file('a.md'))]))).toBeNull();
  });

  it('reads nested folders in name order and skips hidden entries', async () => {
    const tree = await readDroppedFolders(
      transfer([
        dirEntry('docs', [
          fileEntry(file('b.md')),
          fileEntry(file('.DS_Store')),
          dirEntry('.git', [fileEntry(file('HEAD'))]),
          dirEntry('sub', [fileEntry(file('c.md'))]),
          fileEntry(file('a.md')),
        ]),
        fileEntry(file('loose.md')),
      ]),
    );

    expect(tree?.files.map((f) => f.name)).toEqual(['loose.md']);
    const docs = tree!.folders[0];
    expect(docs.name).toBe('docs');
    expect(docs.files.map((f) => f.name)).toEqual(['a.md', 'b.md']);
    expect(docs.folders.map((f) => f.name)).toEqual(['sub']);
    expect(docs.folders[0].files.map((f) => f.name)).toEqual(['c.md']);
    expect(tree!.unreadable).toBe(0);
  });

  it('skips files and folders that cannot be read instead of failing the whole drop', async () => {
    // e.g. a OneDrive file that is only in the cloud, or a locked system folder on Windows.
    const cloudOnly: Entry = {
      name: 'cloud.md',
      isFile: true,
      isDirectory: false,
      file: (_ok: FileCallback, fail?: ErrorCallback) => fail?.(new DOMException('gone', 'NotFoundError')),
    };
    const locked: Entry = {
      name: 'locked',
      isFile: false,
      isDirectory: true,
      createReader: () => ({
        readEntries: (_ok: FileSystemEntriesCallback, fail?: ErrorCallback) =>
          fail?.(new DOMException('denied', 'NotReadableError')),
      }),
    };
    const tree = await readDroppedFolders(
      transfer([dirEntry('notes', [fileEntry(file('a.md')), cloudOnly, locked])]),
    );

    expect(tree!.unreadable).toBe(2);
    expect(tree!.folders[0].files.map((f) => f.name)).toEqual(['a.md']);

    const target = { createFolder: () => 'f', saveDocument: () => 'd' };
    const result = await importDroppedTree(tree!, target, async (f) => ({
      name: f.name, content: '', size: 0, lastModified: 0,
    }));
    expect(result).toMatchObject({ documents: 1, failed: 2 });
  });
});
