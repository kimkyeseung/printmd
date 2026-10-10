/**
 * Handing page content to printmd.app.
 *
 * A content script on github.com can't postMessage into a printmd.app tab:
 * printmd only trusts messages from its own origin. So content travels
 * through the extension instead:
 *
 *   source page ──HANDOFF_CONTENT──▶ service worker (stores it, opens
 *   printmd.app/?ext=<id>) ◀──TAKE_HANDOFF── marker script on printmd.app,
 *   which posts it into the page from printmd's own origin.
 */

export type HandoffFormat = 'html' | 'markdown';

export interface HandoffPayload {
  content: string;
  format: HandoffFormat;
  sourceUrl?: string;
  title?: string | null;
}

/** Message a content script sends to the service worker. */
export interface HandoffRequest extends HandoffPayload {
  type: 'HANDOFF_CONTENT';
}

/** Message the printmd.app marker script sends to collect a handoff. */
export interface TakeHandoffRequest {
  type: 'TAKE_HANDOFF';
  id: string;
}

/** What the marker script posts into the printmd page. */
export interface PrintmdContentMessage extends HandoffPayload {
  type: 'PRINTMD_CONTENT';
  id: string;
}

/** Ask the service worker to open printmd with this content. */
export async function handOff(payload: HandoffPayload): Promise<void> {
  const request: HandoffRequest = { type: 'HANDOFF_CONTENT', ...payload };
  const response = await chrome.runtime.sendMessage(request);
  if (!response?.ok) throw new Error('Handoff failed');
}

const HTML_ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };

/** A page title as an <h1>, so extracted content stays plain HTML. */
export function titleHeading(title: string): string {
  return title ? `<h1>${title.replace(/[&<>"]/g, (c) => HTML_ESCAPES[c])}</h1>\n` : '';
}
