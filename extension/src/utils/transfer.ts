/**
 * Content transfer utilities for sending markdown to printmd.app
 */

import { printmdSrcUrl } from './config';

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
  const newWindow = window.open(printmdSrcUrl(rawUrl), '_blank');
  if (!newWindow) {
    throw new TransferError(
      'Popup blocked. Please allow popups for this site and try again.',
      'POPUP_BLOCKED'
    );
  }
}
