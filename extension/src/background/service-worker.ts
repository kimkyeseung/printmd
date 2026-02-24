/**
 * Background service worker for printmd extension
 */

// Listen for installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('printmd extension installed');

    // Set default settings
    chrome.storage.sync.set({
      enabled: true,
      autoDetect: true,
    });
  }
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_TAB_INFO') {
    // Return current tab info
    if (sender.tab) {
      sendResponse({
        url: sender.tab.url,
        title: sender.tab.title,
      });
    }
  }

  if (message.type === 'OPEN_PRINTMD') {
    // Open printmd with the provided URL
    const { rawUrl } = message;
    if (rawUrl) {
      const encodedUrl = encodeURIComponent(rawUrl);
      chrome.tabs.create({
        url: `https://printmd.app/?src=${encodedUrl}`,
      });
    }
    sendResponse({ success: true });
  }

  return true; // Keep message channel open for async response
});

// Context menu for right-click on markdown links
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'open-in-printmd',
    title: 'Open in printmd',
    contexts: ['link'],
    targetUrlPatterns: [
      '*://github.com/*/*.md',
      '*://github.com/*/*.markdown',
      '*://raw.githubusercontent.com/*/*.md',
      '*://raw.githubusercontent.com/*/*.markdown',
    ],
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === 'open-in-printmd' && info.linkUrl) {
    let rawUrl = info.linkUrl;

    // Convert GitHub blob URL to raw URL if needed
    if (rawUrl.includes('github.com') && rawUrl.includes('/blob/')) {
      rawUrl = rawUrl
        .replace('github.com', 'raw.githubusercontent.com')
        .replace('/blob/', '/');
    }

    const encodedUrl = encodeURIComponent(rawUrl);
    chrome.tabs.create({
      url: `https://printmd.app/?src=${encodedUrl}`,
    });
  }
});
