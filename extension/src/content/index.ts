/**
 * Content script entry point for GitHub pages
 */

import { detectPage, findButtonInsertionPoint } from './github';
import { injectButton, removeButton, isButtonInjected } from './injector';

/**
 * Initialize the content script
 */
function init(): void {
  console.log('[printmd] init called');
  const pageInfo = detectPage();
  console.log('[printmd] pageInfo:', pageInfo);

  // Only proceed if we're on a markdown page
  if (pageInfo.type === 'none') {
    removeButton();
    return;
  }

  // Find insertion point and inject button
  const container = findButtonInsertionPoint();
  console.log('[printmd] container:', container);
  if (container && !isButtonInjected()) {
    injectButton(container, pageInfo);
    console.log('[printmd] button injected');
  }
}

/**
 * Observe DOM changes for SPA navigation
 * GitHub uses pjax for navigation, so we need to re-inject on page changes
 */
function setupObserver(): void {
  // Debounce init calls
  let timeout: number | null = null;
  const debouncedInit = () => {
    if (timeout) clearTimeout(timeout);
    timeout = window.setTimeout(init, 200);
  };

  // Observe for GitHub's pjax navigation
  const observer = new MutationObserver((mutations) => {
    // Check if there were significant DOM changes
    const hasSignificantChanges = mutations.some((mutation) => {
      // Check for added nodes that might indicate page change
      if (mutation.addedNodes.length > 0) {
        for (const node of mutation.addedNodes) {
          if (node instanceof HTMLElement) {
            // GitHub content container changes
            if (
              node.id === 'repo-content-turbo-frame' ||
              node.classList.contains('repository-content') ||
              node.classList.contains('markdown-body') ||
              node.querySelector('article') ||
              node.querySelector('article.markdown-body') ||
              node.querySelector('.file-header')
            ) {
              return true;
            }
          }
        }
      }
      return false;
    });

    if (hasSignificantChanges) {
      debouncedInit();
    }
  });

  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

/**
 * Handle popstate for browser back/forward navigation
 */
function setupPopstateHandler(): void {
  let lastUrl = window.location.href;

  window.addEventListener('popstate', () => {
    if (window.location.href !== lastUrl) {
      lastUrl = window.location.href;
      setTimeout(init, 100);
    }
  });
}

// Run on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    init();
    setupObserver();
    setupPopstateHandler();
  });
} else {
  init();
  setupObserver();
  setupPopstateHandler();
}
