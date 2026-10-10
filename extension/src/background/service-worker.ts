/**
 * Background service worker for printmd extension
 */

import { printmdHandoffUrl, printmdSrcUrl } from '../utils/config';
import type { HandoffPayload } from '../utils/handoff';
import { storeHandoff, takeHandoff } from './handoff-store';

// All supported site URL patterns for context menus
const SUPPORTED_SITE_PATTERNS = [
  '*://github.com/*',
  '*://gist.github.com/*',
  '*://gitlab.com/*',
  '*://bitbucket.org/*',
  '*://www.npmjs.com/package/*',
  '*://pypi.org/project/*',
  '*://notion.so/*',
  '*://*.notion.site/*',
];

// Markdown link patterns (for right-clicking links)
const MARKDOWN_LINK_PATTERNS = [
  '*://github.com/*/*.md',
  '*://github.com/*/*.markdown',
  '*://gist.github.com/*',
  '*://raw.githubusercontent.com/*/*.md',
  '*://raw.githubusercontent.com/*/*.markdown',
  '*://gitlab.com/*/*.md',
  '*://gitlab.com/*/*.markdown',
  '*://bitbucket.org/*/*.md',
  '*://bitbucket.org/*/*.markdown',
];

// Helper: convert various site URLs to raw URLs
function toRawUrl(url: string): string {
  // GitHub blob -> raw
  if (url.includes('github.com') && url.includes('/blob/')) {
    return url
      .replace('github.com', 'raw.githubusercontent.com')
      .replace('/blob/', '/');
  }

  // GitLab blob -> raw
  if (url.includes('gitlab.com') && url.includes('/-/blob/')) {
    return url.replace('/-/blob/', '/-/raw/');
  }

  // Bitbucket src -> raw
  if (url.includes('bitbucket.org') && url.includes('/src/')) {
    return url.replace('/src/', '/raw/');
  }

  return url;
}

// Listen for installation - single listener
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('printmd extension installed');
    chrome.storage.sync.set({
      enabled: true,
      autoDetect: true,
    });
  }

  // Create context menus (runs on install AND update)
  chrome.contextMenus.removeAll(() => {
    // Link context menu - for markdown file links
    chrome.contextMenus.create({
      id: 'open-in-printmd-link',
      title: chrome.i18n.getMessage('contextMenuEdit'),
      contexts: ['link'],
      targetUrlPatterns: MARKDOWN_LINK_PATTERNS,
    });

    // Page context menu - for all supported sites
    chrome.contextMenus.create({
      id: 'open-in-printmd-page',
      title: chrome.i18n.getMessage('contextMenuEdit'),
      contexts: ['page'],
      documentUrlPatterns: SUPPORTED_SITE_PATTERNS,
    });
  });
});

/** Content a site's content script extracted for the "open in printmd" action. */
interface PageContentResponse {
  rawUrl: string | null;
  htmlContent: string | null;
  fileName: string | null;
}

/** Open printmd with content that has no raw URL to fetch. */
async function openWithContent(payload: HandoffPayload): Promise<void> {
  const id = await storeHandoff(payload);
  await chrome.tabs.create({ url: printmdHandoffUrl(id) });
}

/**
 * Open what a content script found on the page: a raw file by URL, otherwise
 * its extracted HTML. Returns false when there was nothing to open.
 */
async function openPageContent(response: PageContentResponse | null, pageUrl?: string): Promise<boolean> {
  if (response?.rawUrl) {
    await chrome.tabs.create({ url: printmdSrcUrl(response.rawUrl) });
    return true;
  }
  if (response?.htmlContent) {
    await openWithContent({
      content: response.htmlContent,
      format: 'html',
      sourceUrl: pageUrl,
      title: response.fileName,
    });
    return true;
  }
  return false;
}

/** Ask the tab's content script what to open; fall back to the page URL. */
function openFromTab(tab: chrome.tabs.Tab): void {
  if (!tab.id) return;
  chrome.tabs.sendMessage(tab.id, { type: 'CONTEXT_MENU_OPEN' }, async (response: PageContentResponse | null) => {
    if (chrome.runtime.lastError || !(await openPageContent(response, tab.url))) {
      // No content script on this page (or nothing detected): try its URL.
      if (tab.url) await chrome.tabs.create({ url: printmdSrcUrl(toRawUrl(tab.url)) });
    }
  });
}

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_TAB_INFO') {
    if (sender.tab) {
      sendResponse({
        url: sender.tab.url,
        title: sender.tab.title,
      });
    }
    return false;
  }

  if (message.type === 'OPEN_PRINTMD') {
    const { rawUrl } = message;
    if (rawUrl) chrome.tabs.create({ url: printmdSrcUrl(rawUrl) });
    sendResponse({ success: true });
    return false;
  }

  // A source page hands over extracted content (utils/handoff.ts).
  if (message.type === 'HANDOFF_CONTENT') {
    const { content, format, sourceUrl, title } = message;
    openWithContent({ content, format, sourceUrl, title })
      .then(() => sendResponse({ ok: true }))
      .catch(() => sendResponse({ ok: false }));
    return true;
  }

  // The printmd tab collects it (content/marker.ts).
  if (message.type === 'TAKE_HANDOFF') {
    takeHandoff(message.id)
      .then(sendResponse)
      .catch(() => sendResponse(null));
    return true;
  }

  return false;
});

// Context menu click handler
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'open-in-printmd-link' && info.linkUrl) {
    chrome.tabs.create({ url: printmdSrcUrl(toRawUrl(info.linkUrl)) });
  }

  if (info.menuItemId === 'open-in-printmd-page' && tab) {
    openFromTab(tab);
  }
});

// Keyboard shortcut handler
chrome.commands?.onCommand?.addListener((command) => {
  if (command === 'open-in-printmd') {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      if (tab) openFromTab(tab);
    });
  }
});
