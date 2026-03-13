/**
 * Button injector for GitHub pages
 */

import { type GitHubPageInfo } from './github';
import { toRawUrl, fetchRawContent } from '../utils/github-api';
import { transferViaUrl, transferViaStorage, TransferError } from '../utils/transfer';
import { addRecentFile } from '../utils/storage';

const BUTTON_ID = 'printmd-open-button';

/**
 * Create the "Open in printmd" button element
 */
function createButton(pageInfo: GitHubPageInfo): HTMLButtonElement {
  const button = document.createElement('button');
  button.id = BUTTON_ID;
  button.className = 'printmd-button';
  button.type = 'button';
  button.title = 'printmd에서 스타일링하고 PDF로 저장하기';

  // Icon SVG (document with arrow)
  const iconSvg = `
    <svg class="printmd-icon" viewBox="0 0 16 16" fill="currentColor">
      <path d="M4 1.75C4 .784 4.784 0 5.75 0h5.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 14.25 16h-8.5A1.75 1.75 0 0 1 4 14.25V1.75zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25V4.664a.25.25 0 0 0-.073-.177l-2.914-2.914a.25.25 0 0 0-.177-.073H5.75z"/>
      <path d="M10 8l-2-2v1.5H5v1h3V10l2-2z"/>
    </svg>
  `;

  button.innerHTML = `${iconSvg}<span>Open in printmd</span>`;

  // Click handler
  button.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();

    button.disabled = true;
    button.classList.add('loading');

    try {
      // Add to recent files
      await addRecentFile({
        url: pageInfo.url,
        title: pageInfo.fileName || 'Markdown file',
      });

      if (pageInfo.type === 'issue-pr') {
        // Extract markdown content from Issue/PR body
        const content = extractIssuePrContent();
        if (content) {
          transferViaStorage(content, pageInfo.url);
        } else {
          showToast('마크다운 본문을 찾을 수 없습니다.', 'error');
        }
      } else if (pageInfo.rawUrl) {
        transferViaUrl(pageInfo.rawUrl);
      }
    } catch (error) {
      console.error('printmd: Failed to open file', error);
      if (error instanceof TransferError && error.code === 'POPUP_BLOCKED') {
        showToast('팝업이 차단되었습니다. 팝업 허용 후 다시 시도해주세요.', 'error');
      } else {
        showToast('파일을 열 수 없습니다. 다시 시도해주세요.', 'error');
      }
    } finally {
      button.disabled = false;
      button.classList.remove('loading');
    }
  });

  return button;
}

/**
 * Inject the button into the page
 */
export function injectButton(container: Element, pageInfo: GitHubPageInfo): void {
  // Remove existing button if any
  removeButton();

  // Create and insert new button
  const button = createButton(pageInfo);

  // For file view, gist, or issue/PR, prepend to button group
  if (pageInfo.type === 'markdown-file' || pageInfo.type === 'gist' || pageInfo.type === 'issue-pr') {
    // Create a wrapper to match GitHub's button style
    const wrapper = document.createElement('div');
    wrapper.className = 'printmd-button-wrapper';
    wrapper.appendChild(button);
    container.prepend(wrapper);
  } else {
    // For README, append to header
    const wrapper = document.createElement('div');
    wrapper.className = 'printmd-button-wrapper readme';
    wrapper.appendChild(button);
    container.appendChild(wrapper);
  }
}

/**
 * Remove the injected button
 */
export function removeButton(): void {
  const existing = document.getElementById(BUTTON_ID);
  if (existing) {
    existing.parentElement?.remove();
  }
}

/**
 * Check if button is already injected
 */
export function isButtonInjected(): boolean {
  return document.getElementById(BUTTON_ID) !== null;
}

/**
 * Extract markdown content from GitHub Issue/PR page
 * Uses the rendered HTML and converts to a simple markdown representation
 */
function extractIssuePrContent(): string | null {
  // Get the issue/PR title
  const titleEl = document.querySelector<HTMLElement>('.gh-header-title .js-issue-title');
  const title = titleEl?.textContent?.trim() || '';

  // Get the issue/PR body (first comment)
  const bodyEl = document.querySelector<HTMLElement>('.comment-body .markdown-body');
  if (!bodyEl) return null;

  // Get inner HTML and do a basic HTML-to-markdown conversion
  const bodyHtml = bodyEl.innerHTML;

  // Build markdown content with title
  let markdown = '';
  if (title) {
    markdown += `# ${title}\n\n`;
  }

  // Use the rendered HTML as-is (printmd can handle HTML in markdown)
  markdown += bodyHtml;

  return markdown || null;
}

/**
 * Show a toast notification on the page
 */
function showToast(message: string, type: 'success' | 'error' = 'success'): void {
  // Remove existing toast
  document.getElementById('printmd-toast')?.remove();

  const toast = document.createElement('div');
  toast.id = 'printmd-toast';
  toast.textContent = message;
  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    padding: '12px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    zIndex: '99999',
    color: '#fff',
    background: type === 'error' ? '#d1242f' : '#2da44e',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    transition: 'opacity 0.3s',
    opacity: '0',
  });

  document.body.appendChild(toast);

  // Fade in
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
  });

  // Fade out and remove
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
