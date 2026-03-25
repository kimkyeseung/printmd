/**
 * Encode/decode markdown document content for URL sharing.
 * Uses CompressionStream (gzip) + base64url for compact, URL-safe encoding.
 */

const MAX_URL_ENCODED_LENGTH = 2000;

/**
 * Compress a string using gzip and return base64url-encoded result.
 */
export async function encodeDocumentToUrl(content: string): Promise<string> {
  const encoder = new TextEncoder();
  const input = encoder.encode(content);

  const cs = new CompressionStream('gzip');
  const writer = cs.writable.getWriter();
  writer.write(input);
  writer.close();

  const reader = cs.readable.getReader();
  const chunks: Uint8Array[] = [];
  let totalLength = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    totalLength += value.length;
  }

  const compressed = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    compressed.set(chunk, offset);
    offset += chunk.length;
  }

  // Convert to base64url (URL-safe base64 without padding)
  const base64 = btoa(String.fromCharCode(...compressed));
  const base64url = base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return base64url;
}

/**
 * Decode a base64url-encoded gzip-compressed string back to text.
 */
export async function decodeDocumentFromUrl(encoded: string): Promise<string> {
  // Restore standard base64 from base64url
  let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
  // Re-add padding
  while (base64.length % 4 !== 0) {
    base64 += '=';
  }

  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const ds = new DecompressionStream('gzip');
  const writer = ds.writable.getWriter();
  writer.write(bytes);
  writer.close();

  const reader = ds.readable.getReader();
  const chunks: Uint8Array[] = [];
  let totalLength = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    totalLength += value.length;
  }

  const decompressed = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    decompressed.set(chunk, offset);
    offset += chunk.length;
  }

  return new TextDecoder().decode(decompressed);
}

/**
 * Build a full shareable URL with the document content.
 * Returns null if the encoded content exceeds the URL length limit.
 */
export async function buildDocumentShareUrl(
  content: string,
): Promise<{ url: string } | { error: 'empty' } | { error: 'too_large' }> {
  if (!content || content.trim().length === 0) {
    return { error: 'empty' };
  }

  const encoded = await encodeDocumentToUrl(content);

  if (encoded.length > MAX_URL_ENCODED_LENGTH) {
    return { error: 'too_large' };
  }

  const base = `${window.location.origin}${window.location.pathname}`;
  return { url: `${base}?doc=${encoded}` };
}
