/**
 * Content transfer utilities for sending markdown to printmd.app
 */

const PRINTMD_URL = 'https://printmd.app';
// For development, you can use: const PRINTMD_URL = 'http://localhost:3000';

const STORAGE_KEYS = {
  CONTENT: 'printmd_content',
  SOURCE: 'printmd_source',
};

/**
 * Transfer content via URL parameter (for raw URL reference)
 * Best for: when we can provide the raw URL directly
 */
export function transferViaUrl(rawUrl: string): void {
  const encodedUrl = encodeURIComponent(rawUrl);
  const targetUrl = `${PRINTMD_URL}/?src=${encodedUrl}`;

  window.open(targetUrl, '_blank');
}

/**
 * Transfer content via SessionStorage (for large content)
 * Best for: content > 2KB or when raw URL is not available
 */
export function transferViaStorage(content: string, sourceUrl?: string): void {
  // Open the printmd app first
  const newWindow = window.open(PRINTMD_URL, '_blank');

  if (!newWindow) {
    console.error('Failed to open printmd window');
    return;
  }

  // Wait for the new window to be ready, then post message
  // We use postMessage since SessionStorage doesn't work cross-origin
  const checkReady = setInterval(() => {
    try {
      newWindow.postMessage(
        {
          type: 'PRINTMD_CONTENT',
          content,
          sourceUrl,
        },
        PRINTMD_URL
      );
    } catch {
      // Window not ready yet, keep trying
    }
  }, 100);

  // Stop trying after 10 seconds
  setTimeout(() => {
    clearInterval(checkReady);
  }, 10000);
}

/**
 * Smart transfer - chooses the best method based on content
 */
export function transferContent(rawUrl: string | null, content: string, sourceUrl: string): void {
  // If we have a raw URL and content is reasonable size, use URL method
  if (rawUrl && content.length <= 50000) {
    transferViaUrl(rawUrl);
  } else {
    // For large files or when raw URL is not available, use storage method
    transferViaStorage(content, sourceUrl);
  }
}
