/**
 * Popup script for printmd extension
 */

import { getRecentFiles, removeRecentFile, clearRecentFiles, type RecentFile } from '../utils/storage';
import { toRawUrl } from '../utils/github-api';

const msg = chrome.i18n.getMessage.bind(chrome.i18n);

interface TabInfo {
  url: string;
  title: string;
  isMarkdown: boolean;
  rawUrl: string | null;
  fileName: string | null;
}

interface PageInfoResponse {
  type: string;
  url: string;
  rawUrl: string | null;
  fileName: string | null;
}

/**
 * Apply i18n to all elements with data-i18n attribute
 */
function applyI18n(): void {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n')!;
    const message = msg(key);
    if (message) {
      el.textContent = message;
    }
  });
}

/**
 * Get page info from content script
 */
async function getPageInfoFromContentScript(tabId: number): Promise<PageInfoResponse | null> {
  return new Promise((resolve) => {
    chrome.tabs.sendMessage(tabId, { type: 'GET_PAGE_INFO' }, (response) => {
      if (chrome.runtime.lastError) {
        resolve(null);
      } else {
        resolve(response as PageInfoResponse);
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
      <p class="file-name">${info.fileName || msg('popupMarkdownFile')}</p>
      <p class="file-type">${msg('popupFileType')}</p>
    `;
    actionSection.classList.remove('hidden');
    noMarkdown.classList.add('hidden');

    // Setup button click
    const openButton = document.getElementById('open-button')!;
    openButton.textContent = msg('popupOpenButton');
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
  const clearButton = document.getElementById('clear-recent')!;
  const recentFiles = await getRecentFiles();

  if (recentFiles.length === 0) {
    recentList.innerHTML = `<li class="empty">${msg('popupNoRecentFiles')}</li>`;
    clearButton.classList.add('hidden');
    return;
  }

  clearButton.classList.remove('hidden');

  recentList.innerHTML = recentFiles
    .map((file) => {
      const shortUrl = file.url
        .replace('https://github.com/', '')
        .replace('https://gist.github.com/', 'gist:')
        .replace('https://gitlab.com/', '')
        .replace('https://bitbucket.org/', '')
        .replace('https://www.npmjs.com/', 'npm:')
        .replace('https://pypi.org/', 'pypi:')
        .replace('https://notion.so/', 'notion:');
      return `
        <li data-url="${encodeURIComponent(file.url)}">
          <div class="recent-item-content">
            <div class="file-title">${file.title}</div>
            <div class="file-url">${shortUrl}</div>
          </div>
          <button class="remove-btn" data-remove-url="${encodeURIComponent(file.url)}" title="${msg('popupRemove')}">
            <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor">
              <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06z"/>
            </svg>
          </button>
        </li>
      `;
    })
    .join('');

  // Add click handlers for opening files
  recentList.querySelectorAll('li[data-url]').forEach((li) => {
    li.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).closest('.remove-btn')) return;

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

  // Add click handlers for remove buttons
  recentList.querySelectorAll('.remove-btn').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const url = decodeURIComponent(btn.getAttribute('data-remove-url')!);
      await removeRecentFile(url);
      await updateRecentFiles();
    });
  });

  // Clear all button handler
  clearButton.onclick = async () => {
    await clearRecentFiles();
    await updateRecentFiles();
  };
}

/**
 * Initialize popup
 */
async function init(): Promise<void> {
  // Apply i18n to static elements
  applyI18n();

  // Get current tab info
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (tab?.url && tab.id) {
    let info: TabInfo;

    // Try to get page info from content script first
    const pageInfo = await getPageInfoFromContentScript(tab.id);

    if (pageInfo && pageInfo.type !== 'none') {
      info = {
        url: pageInfo.url,
        title: tab.title || '',
        isMarkdown: true,
        rawUrl: pageInfo.rawUrl,
        fileName: pageInfo.fileName,
      };
    } else {
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
