/**
 * Button injector for all supported sites
 */

import { type PageInfo } from './types';
import { transferViaUrl, transferViaStorage, TransferError } from '../utils/transfer';
import { addRecentFile } from '../utils/storage';

const BUTTON_ID = 'printmd-open-button';

/**
 * Create the "Open in printmd" button element
 */
function createButton(pageInfo: PageInfo): HTMLButtonElement {
  const button = document.createElement('button');
  button.id = BUTTON_ID;
  button.className = 'printmd-button';
  button.type = 'button';
  button.title = 'Style and save as PDF in printmd';

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

      if (pageInfo.rawUrl) {
        // Sites with raw URLs (GitHub, GitLab, Bitbucket file views)
        transferViaUrl(pageInfo.rawUrl);
      } else if (pageInfo.htmlContent) {
        // Sites without raw URLs (npm, PyPI, Notion, Issue/PR pages)
        transferViaStorage(pageInfo.htmlContent, pageInfo.url);
      } else if (pageInfo.type === 'issue-pr') {
        // GitHub Issue/PR fallback - extract from DOM
        const content = extractIssuePrContent();
        if (content) {
          transferViaStorage(content, pageInfo.url);
        } else {
          showToast('Could not find markdown content.', 'error');
        }
      } else {
        showToast('Could not find markdown content.', 'error');
      }
    } catch (error) {
      console.error('printmd: Failed to open file', error);
      if (error instanceof TransferError && error.code === 'POPUP_BLOCKED') {
        showToast('Popup blocked. Please allow popups and try again.', 'error');
      } else {
        showToast('Could not open file. Please try again.', 'error');
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
export function injectButton(container: Element, pageInfo: PageInfo): void {
  // Remove existing button if any
  removeButton();

  const button = createButton(pageInfo);
  const wrapper = document.createElement('div');

  if (pageInfo.type === 'readme' || pageInfo.type === 'package-readme' || pageInfo.type === 'document') {
    wrapper.className = 'printmd-button-wrapper readme';
    wrapper.appendChild(button);
    container.appendChild(wrapper);
  } else {
    wrapper.className = 'printmd-button-wrapper';
    wrapper.appendChild(button);
    container.prepend(wrapper);
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
 * Extract markdown content from GitHub Issue/PR page (legacy fallback)
 */
function extractIssuePrContent(): string | null {
  const titleEl = document.querySelector<HTMLElement>('.gh-header-title .js-issue-title');
  const title = titleEl?.textContent?.trim() || '';
  const bodyEl = document.querySelector<HTMLElement>('.comment-body .markdown-body');
  if (!bodyEl) return null;

  let markdown = '';
  if (title) markdown += `# ${title}\n\n`;
  markdown += bodyEl.innerHTML;
  return markdown || null;
}

/**
 * Show a toast notification on the page
 */
function showToast(message: string, type: 'success' | 'error' = 'success'): void {
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

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
