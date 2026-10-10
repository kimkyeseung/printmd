export interface FileInfo {
  name: string;
  content: string;
  size: number;
  lastModified: number;
  /** Set when the content was converted from another format. */
  convertedFrom?: 'hwpx';
  /** Images left out during conversion. */
  skippedImages?: number;
}

const MARKDOWN_EXTENSIONS = ['.md', '.markdown', '.mdown', '.mkd', '.mkdn', '.txt'];

export class UnsupportedFileError extends Error {
  constructor(public readonly fileName: string) {
    super(`Unsupported file: ${fileName}`);
    this.name = 'UnsupportedFileError';
  }
}

export async function readFile(file: File): Promise<FileInfo> {
  if (isHwpxFile(file)) {
    // Loaded on demand so the converter stays out of the editor's first load.
    const { importHwpxFile } = await import('@/lib/import');
    const { markdown, skippedImages } = await importHwpxFile(file);
    return {
      name: file.name,
      content: markdown,
      size: file.size,
      lastModified: file.lastModified,
      convertedFrom: 'hwpx',
      skippedImages,
    };
  }
  if (!isMarkdownFile(file)) throw new UnsupportedFileError(file.name);

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        resolve({
          name: file.name,
          content,
          size: file.size,
          lastModified: file.lastModified,
        });
      } else {
        reject(new Error('Failed to read file as text'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}

export function isMarkdownFile(file: File): boolean {
  const fileName = file.name.toLowerCase();
  return MARKDOWN_EXTENSIONS.some((ext) => fileName.endsWith(ext));
}

export function isHwpxFile(file: File): boolean {
  return file.name.toLowerCase().endsWith('.hwpx');
}

/** Legacy binary HWP, which can't be converted yet. */
export function isHwpFile(file: File): boolean {
  return file.name.toLowerCase().endsWith('.hwp');
}

export function isSupportedFile(file: File): boolean {
  return isMarkdownFile(file) || isHwpxFile(file);
}

/** Tab title for an opened file: its name without the extension. */
export function fileTitle(name: string): string {
  return name.replace(/\.(md|markdown|mdown|mkd|mkdn|txt|hwpx)$/i, '');
}
