/**
 * Popup script for printmd extension
 */

import { getRecentFiles, type RecentFile } from '../utils/storage';
import { toRawUrl } from '../utils/github-api';

interface TabInfo {
  url: string;
  title: string;
  isMarkdown: boolean;
  rawUrl: string | null;
  fileName: string | null;
}

interface GitHubPageInfo {
  type: 'markdown-file' | 'readme' | 'none';
  url: string;
  rawUrl: string | null;
  fileName: string | null;
}

/**
 * Get page info from content script
 */
async function getPageInfoFromContentScript(tabId: number): Promise<GitHubPageInfo | null> {
  return new Promise((resolve) => {
    chrome.tabs.sendMessage(tabId, { type: 'GET_PAGE_INFO' }, (response) => {
      if (chrome.runtime.lastError) {
        resolve(null);
      } else {
        resolve(response as GitHubPageInfo);
      }
    });
  });
}

/**
 * Detect if URL is a markdown file (fallback)
 */
function detectMarkdownFromUrl(url: string): TabInfo {
  const markdownExtensions = ['.md', '.markdown', '.mdown', '.mkd', '.mkdn'];
  const isMarkdown = markdownExtensions.some((ext) => url.toLowerCase().includes(ext));

  let rawUrl: string | null = null;
  let fileName: string | null = null;

  if (isMarkdown && url.includes('github.com')) {
    rawUrl = toRawUrl(url);
    const match = url.match(/\/([^/]+\.(?:md|markdown|mdown|mkd|mkdn))(?:\?|$)/i);
    fileName = match ? match[1] : null;
  }

  return {
    url,
    title: '',
    isMarkdown,
    rawUrl,
    fileName,
  };
}

/**
 * Update page info UI
 */
function updatePageInfo(info: TabInfo): void {
  const pageInfoEl = document.getElementById('page-info')!;
  const actionSection = document.getElementById('action-section')!;
  const noMarkdown = document.getElementById('no-markdown')!;

  if (info.isMarkdown && info.rawUrl) {
    pageInfoEl.innerHTML = `
      <p class="file-name">${info.fileName || 'Markdown file'}</p>
      <p class="file-type">GitHub Markdown</p>
    `;
    actionSection.classList.remove('hidden');
    noMarkdown.classList.add('hidden');

    // Setup button click
    const openButton = document.getElementById('open-button')!;
    openButton.addEventListener('click', () => {
      const encodedUrl = encodeURIComponent(info.rawUrl!);
      chrome.tabs.create({
        url: `https://printmd.app/?src=${encodedUrl}`,
      });
      window.close();
    });
  } else {
    pageInfoEl.classList.add('hidden');
    actionSection.classList.add('hidden');
    noMarkdown.classList.remove('hidden');
  }
}

/**
 * Update recent files list
 */
async function updateRecentFiles(): Promise<void> {
  const recentList = document.getElementById('recent-list')!;
  const recentFiles = await getRecentFiles();

  if (recentFiles.length === 0) {
    recentList.innerHTML = '<li class="empty">No recent files</li>';
    return;
  }

  recentList.innerHTML = recentFiles
    .map((file) => {
      // Extract short URL for display
      const shortUrl = file.url.replace('https://github.com/', '');
      return `
        <li data-url="${encodeURIComponent(file.url)}">
          <div class="file-title">${file.title}</div>
          <div class="file-url">${shortUrl}</div>
        </li>
      `;
    })
    .join('');

  // Add click handlers
  recentList.querySelectorAll('li[data-url]').forEach((li) => {
    li.addEventListener('click', () => {
      const url = decodeURIComponent(li.getAttribute('data-url')!);
      const rawUrl = toRawUrl(url);
      if (rawUrl) {
        const encodedUrl = encodeURIComponent(rawUrl);
        chrome.tabs.create({
          url: `https://printmd.app/?src=${encodedUrl}`,
        });
        window.close();
      }
    });
  });
}

/**
 * Initialize popup
 */
async function init(): Promise<void> {
  // Get current tab info
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (tab?.url && tab.id) {
    let info: TabInfo;

    // Try to get page info from content script first
    const pageInfo = await getPageInfoFromContentScript(tab.id);

    if (pageInfo && pageInfo.type !== 'none') {
      // Content script detected markdown
      info = {
        url: pageInfo.url,
        title: tab.title || '',
        isMarkdown: true,
        rawUrl: pageInfo.rawUrl,
        fileName: pageInfo.fileName,
      };
    } else {
      // Fallback to URL detection
      info = detectMarkdownFromUrl(tab.url);
      info.title = tab.title || '';
    }

    updatePageInfo(info);
  }

  // Load recent files
  await updateRecentFiles();
}

// Initialize on load
document.addEventListener('DOMContentLoaded', init);
