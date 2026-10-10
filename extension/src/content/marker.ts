/**
 * Content script on printmd.app, injected at document_start.
 *
 * 1. Marks the page so printmd can tell the extension is installed.
 * 2. Delivers handed-off content (see utils/handoff.ts): when the page was
 *    opened as /?ext=<id>, wait for the app to say it is listening, fetch the
 *    content from the service worker and post it into the page. Posting from
 *    here gives the message printmd's own origin, which the app requires.
 */

import type { PrintmdContentMessage, TakeHandoffRequest, HandoffPayload } from '../utils/handoff';

document.documentElement.setAttribute('data-printmd-extension', '');

const handoffId = new URLSearchParams(window.location.search).get('ext');

if (handoffId) {
  let delivered = false;

  window.addEventListener('message', async (event) => {
    if (event.source !== window || event.origin !== window.location.origin) return;
    if (event.data?.type !== 'PRINTMD_READY' || delivered) return;
    delivered = true;

    const request: TakeHandoffRequest = { type: 'TAKE_HANDOFF', id: handoffId };
    const payload = (await chrome.runtime.sendMessage(request)) as HandoffPayload | null;
    if (!payload) return;

    const message: PrintmdContentMessage = { type: 'PRINTMD_CONTENT', id: handoffId, ...payload };
    window.postMessage(message, window.location.origin);
  });
}
