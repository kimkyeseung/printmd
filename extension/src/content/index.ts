/**
 * Content script entry point - works across all supported sites
 */

import { getSiteDetector } from './sites';
import { injectButton, removeButton, isButtonInjected } from './injector';
import type { SiteDetector } from './types';

let detector: SiteDetector | null = null;

/**
 * Initialize the content script
 */
function init(): void {
  if (!detector) {
    detector = getSiteDetector();
  }

  if (!detector) return;

  const pageInfo = detector.detectPage();

  // Only proceed if we're on a markdown page
  if (pageInfo.type === 'none') {
    removeButton();
    return;
  }

  // Find insertion point and inject button
  const container = detector.findButtonInsertionPoint();
  if (container && !isButtonInjected()) {
    injectButton(container, pageInfo);
  }
}

/**
 * Observe DOM changes for SPA navigation
 */
function setupObserver(): void {
  let timeout: number | null = null;
  const debouncedInit = () => {
    if (timeout) clearTimeout(timeout);
    timeout = window.setTimeout(init, 200);
  };

  const selectors = detector?.getSignificantSelectors() || [];

  const observer = new MutationObserver((mutations) => {
    const hasSignificantChanges = mutations.some((mutation) => {
      if (mutation.addedNodes.length > 0) {
        for (const node of mutation.addedNodes) {
          if (node instanceof HTMLElement) {
            // Check site-specific selectors
            for (const selector of selectors) {
              if (node.matches?.(selector) || node.querySelector?.(selector)) {
                return true;
              }
            }
            // Generic markdown content changes
            if (node.querySelector?.('article') || node.classList?.contains('markdown-body')) {
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

/**
 * Handle messages from popup and service worker
 */
function setupMessageHandler(): void {
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (!detector) detector = getSiteDetector();
    const pageInfo = detector?.detectPage() || null;

    if (message.type === 'GET_PAGE_INFO') {
      sendResponse(pageInfo);
    }

    if (message.type === 'CONTEXT_MENU_OPEN') {
      // Respond with page info so service worker can open printmd
      if (pageInfo && pageInfo.type !== 'none') {
        sendResponse({
          rawUrl: pageInfo.rawUrl,
          htmlContent: pageInfo.htmlContent || null,
          fileName: pageInfo.fileName,
        });
      } else {
        sendResponse(null);
      }
    }

    return true;
  });
}

// Run on load
detector = getSiteDetector();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    init();
    setupObserver();
    setupPopstateHandler();
    setupMessageHandler();
  });
} else {
  init();
  setupObserver();
  setupPopstateHandler();
  setupMessageHandler();
}
