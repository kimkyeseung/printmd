import { describe, it, expect } from 'vitest';
import { zipSync, strToU8 } from 'fflate';
import { fileTitle, isSupportedFile, readFile, UnsupportedFileError } from '../fileHandler';

describe('fileHandler', () => {
  it('accepts Markdown and HWPX files but not legacy HWP', () => {
    expect(isSupportedFile(new File([''], 'notes.md'))).toBe(true);
    expect(isSupportedFile(new File([''], '보고서.HWPX'))).toBe(true);
    expect(isSupportedFile(new File([''], '보고서.hwp'))).toBe(false);
    expect(isSupportedFile(new File([''], 'image.png'))).toBe(false);
  });

  it('strips the extension for the tab title', () => {
    expect(fileTitle('README.md')).toBe('README');
    expect(fileTitle('모집공고.hwpx')).toBe('모집공고');
    expect(fileTitle('archive.tar.gz')).toBe('archive.tar.gz');
  });

  it('rejects unsupported files with UnsupportedFileError', async () => {
    await expect(readFile(new File(['x'], '보고서.hwp'))).rejects.toBeInstanceOf(UnsupportedFileError);
  });

  it('converts .hwpx files to Markdown', async () => {
    // TextEncoder output comes from Node's realm; copy it so fflate sees a Uint8Array.
    const u8 = (text: string) => Uint8Array.from(strToU8(text));
    const archive = zipSync({
      mimetype: u8('application/hwp+zip'),
      'Contents/section0.xml': u8(
        '<hs:sec xmlns:hs="s" xmlns:hp="p"><hp:p><hp:run><hp:t>안녕하세요</hp:t></hp:run></hp:p></hs:sec>'
      ),
    });
    const info = await readFile(new File([archive as BlobPart], '인사.hwpx'));
    expect(info.content).toBe('안녕하세요\n');
    expect(info.convertedFrom).toBe('hwpx');
  });
});
