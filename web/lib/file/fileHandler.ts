export interface FileInfo {
  name: string;
  content: string;
  size: number;
  lastModified: number;
}

export async function readFile(file: File): Promise<FileInfo> {
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
  const validExtensions = ['.md', '.markdown', '.mdown', '.mkd', '.mkdn', '.txt'];
  const fileName = file.name.toLowerCase();
  return validExtensions.some((ext) => fileName.endsWith(ext));
}

