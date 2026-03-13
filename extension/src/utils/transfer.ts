/**
 * Content transfer utilities for sending markdown to printmd.app
 */

const PRINTMD_URL = 'https://printmd.app';
// For development, you can use: const PRINTMD_URL = 'http://localhost:3000';

export class TransferError extends Error {
  constructor(
    message: string,
    public readonly code: 'POPUP_BLOCKED' | 'TRANSFER_FAILED' | 'TIMEOUT'
  ) {
    super(message);
    this.name = 'TransferError';
  }
}

/**
 * Transfer content via URL parameter (for raw URL reference)
 * Best for: when we can provide the raw URL directly
 */
export function transferViaUrl(rawUrl: string): void {
  const encodedUrl = encodeURIComponent(rawUrl);
  const targetUrl = `${PRINTMD_URL}/?src=${encodedUrl}`;

  const newWindow = window.open(targetUrl, '_blank');
  if (!newWindow) {
    throw new TransferError(
      'Popup blocked. Please allow popups for this site and try again.',
      'POPUP_BLOCKED'
    );
  }
}

/**
 * Transfer content via SessionStorage (for large content)
 * Best for: content > 2KB or when raw URL is not available
 */
export function transferViaStorage(content: string, sourceUrl?: string): void {
  const newWindow = window.open(PRINTMD_URL, '_blank');

  if (!newWindow) {
    throw new TransferError(
      'Popup blocked. Please allow popups for this site and try again.',
      'POPUP_BLOCKED'
    );
  }

  // Wait for the new window to be ready, then post message
  let attempts = 0;
  const maxAttempts = 50; // 5 seconds max (50 * 100ms)

  const checkReady = setInterval(() => {
    attempts++;
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

    if (attempts >= maxAttempts) {
      clearInterval(checkReady);
    }
  }, 100);
}

/**
 * Smart transfer - chooses the best method based on content
 */
export function transferContent(rawUrl: string | null, content: string, sourceUrl: string): void {
  if (rawUrl && content.length <= 50000) {
    transferViaUrl(rawUrl);
  } else {
    transferViaStorage(content, sourceUrl);
  }
}
