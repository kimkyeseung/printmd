/**
 * Background service worker for printmd extension
 */

// Helper: convert GitHub URL to raw URL
function toRawUrl(url: string): string {
  if (url.includes('github.com') && url.includes('/blob/')) {
    return url
      .replace('github.com', 'raw.githubusercontent.com')
      .replace('/blob/', '/');
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
    chrome.contextMenus.create({
      id: 'open-in-printmd-link',
      title: 'Open in printmd',
      contexts: ['link'],
      targetUrlPatterns: [
        '*://github.com/*/*.md',
        '*://github.com/*/*.markdown',
        '*://gist.github.com/*',
        '*://raw.githubusercontent.com/*/*.md',
        '*://raw.githubusercontent.com/*/*.markdown',
      ],
    });

    chrome.contextMenus.create({
      id: 'open-in-printmd-page',
      title: 'Open in printmd',
      contexts: ['page'],
      documentUrlPatterns: [
        '*://github.com/*/*.md',
        '*://github.com/*/*.markdown',
        '*://github.com/*/*.mdown',
        '*://github.com/*/*.mkd',
        '*://github.com/*/*.mkdn',
        '*://github.com/*/*/README*',
        '*://gist.github.com/*',
        '*://raw.githubusercontent.com/*/*.md',
        '*://raw.githubusercontent.com/*/*.markdown',
      ],
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

  if (info.menuItemId === 'open-in-printmd-page' && tab?.url) {
    const rawUrl = toRawUrl(tab.url);
    const encodedUrl = encodeURIComponent(rawUrl);
    chrome.tabs.create({
      url: `https://printmd.app/?src=${encodedUrl}`,
    });
  }
});

// Keyboard shortcut handler
chrome.commands?.onCommand?.addListener((command) => {
  if (command === 'open-in-printmd') {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      if (tab?.url) {
        const rawUrl = toRawUrl(tab.url);
        const encodedUrl = encodeURIComponent(rawUrl);
        chrome.tabs.create({
          url: `https://printmd.app/?src=${encodedUrl}`,
        });
      }
    });
  }
});
