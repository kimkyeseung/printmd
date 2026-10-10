import { hwpxToMarkdown, type HwpxConversion } from './hwpx';

export { hwpxToMarkdown, HwpxError, type HwpxConversion, type HwpxOptions } from './hwpx';

/** Wider than this is more detail than a printed page can show, even at 2×. */
const MAX_IMAGE_WIDTH = 1600;
const LOSSY_QUALITY = 0.85;

/**
 * Redraw an image the Markdown pipeline can't show (e.g. BMP), downscaled for
 * print, as whichever of PNG and a lossy encoding comes out smaller.
 */
async function reencodeImage(bytes: Uint8Array, mediaType: string): Promise<string | null> {
  if (typeof createImageBitmap !== 'function') return null;
  const bitmap = await createImageBitmap(new Blob([bytes as BlobPart], { type: mediaType }));
  try {
    const scale = Math.min(1, MAX_IMAGE_WIDTH / bitmap.width);
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const context = canvas.getContext('2d');
    if (!context) return null;
    // BMPs have no alpha; a white backdrop keeps JPEG from turning
    // transparent pixels black.
    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    const png = canvas.toDataURL('image/png');
    // Safari can't encode WebP and silently hands back PNG; fall back to JPEG.
    let lossy = canvas.toDataURL('image/webp', LOSSY_QUALITY);
    if (!lossy.startsWith('data:image/webp')) lossy = canvas.toDataURL('image/jpeg', LOSSY_QUALITY);
    return lossy.length < png.length ? lossy : png;
  } finally {
    bitmap.close();
  }
}

/** Convert an uploaded .hwpx file to Markdown in the browser. */
export async function importHwpxFile(file: File): Promise<HwpxConversion> {
  return hwpxToMarkdown(await file.arrayBuffer(), { convertImage: reencodeImage });
}
