/**
 * Button injector for GitHub pages
 */

import { type GitHubPageInfo } from './github';
import { toRawUrl, fetchRawContent } from '../utils/github-api';
import { transferViaUrl } from '../utils/transfer';
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
      if (pageInfo.rawUrl) {
        // Add to recent files
        await addRecentFile({
          url: pageInfo.url,
          title: pageInfo.fileName || 'Markdown file',
        });

        // Transfer via URL
        transferViaUrl(pageInfo.rawUrl);
      }
    } catch (error) {
      console.error('printmd: Failed to open file', error);
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

  // For file view, prepend to button group
  if (pageInfo.type === 'markdown-file') {
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
