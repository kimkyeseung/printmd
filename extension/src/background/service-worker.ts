/**
 * Background service worker for printmd extension
 */

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

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_TAB_INFO') {
    if (sender.tab) {
      sendResponse({
        url: sender.tab.url,
        title: sender.tab.title,
      });
    }
  }

  if (message.type === 'OPEN_PRINTMD') {
    const { rawUrl } = message;
    if (rawUrl) {
      const encodedUrl = encodeURIComponent(rawUrl);
      chrome.tabs.create({
        url: `https://printmd.app/?src=${encodedUrl}`,
      });
    }
    sendResponse({ success: true });
  }

  return true;
});

// Context menu click handler
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'open-in-printmd-link' && info.linkUrl) {
    const rawUrl = toRawUrl(info.linkUrl);
    const encodedUrl = encodeURIComponent(rawUrl);
    chrome.tabs.create({
      url: `https://printmd.app/?src=${encodedUrl}`,
    });
  }

  if (info.menuItemId === 'open-in-printmd-page' && tab?.id) {
    // Ask content script to detect and handle the page
    chrome.tabs.sendMessage(tab.id, { type: 'CONTEXT_MENU_OPEN' }, (response) => {
      if (chrome.runtime.lastError) {
        // Content script not available, try URL-based fallback
        if (tab.url) {
          const rawUrl = toRawUrl(tab.url);
          const encodedUrl = encodeURIComponent(rawUrl);
          chrome.tabs.create({
            url: `https://printmd.app/?src=${encodedUrl}`,
          });
        }
        return;
      }

      if (response?.rawUrl) {
        const encodedUrl = encodeURIComponent(response.rawUrl);
        chrome.tabs.create({
          url: `https://printmd.app/?src=${encodedUrl}`,
        });
      } else if (response?.htmlContent) {
        // For sites without raw URLs, open printmd and pass content
        chrome.tabs.create({
          url: 'https://printmd.app/',
        }, (newTab) => {
          // Wait for tab to load then send content
          if (newTab?.id) {
            const tabId = newTab.id;
            const listener = (updatedTabId: number, changeInfo: chrome.tabs.TabChangeInfo) => {
              if (updatedTabId === tabId && changeInfo.status === 'complete') {
                chrome.tabs.onUpdated.removeListener(listener);
                chrome.tabs.sendMessage(tabId, {
                  type: 'PRINTMD_CONTENT',
                  content: response.htmlContent,
                  sourceUrl: tab.url,
                });
              }
            };
            chrome.tabs.onUpdated.addListener(listener);
          }
        });
      }
    });
  }
});

// Keyboard shortcut handler
chrome.commands?.onCommand?.addListener((command) => {
  if (command === 'open-in-printmd') {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      if (tab?.id) {
        // Try content script first
        chrome.tabs.sendMessage(tab.id, { type: 'CONTEXT_MENU_OPEN' }, (response) => {
          if (chrome.runtime.lastError || !response) {
            // Fallback to URL
            if (tab.url) {
              const rawUrl = toRawUrl(tab.url);
              const encodedUrl = encodeURIComponent(rawUrl);
              chrome.tabs.create({
                url: `https://printmd.app/?src=${encodedUrl}`,
              });
            }
            return;
          }

          if (response.rawUrl) {
            const encodedUrl = encodeURIComponent(response.rawUrl);
            chrome.tabs.create({
              url: `https://printmd.app/?src=${encodedUrl}`,
            });
          }
        });
      }
    });
  }
});
