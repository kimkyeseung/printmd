/**
 * npm registry page detector
 */

import type { PageInfo, SiteDetector } from '../types';

function isPackagePage(): boolean {
  return /^\/package\//.test(window.location.pathname);
}

function getPackageName(): string | null {
  const match = window.location.pathname.match(/^\/package\/(@?[^/]+(?:\/[^/]+)?)/);
  return match ? match[1] : null;
}

function extractReadmeContent(): string | null {
  const readmeEl = document.querySelector<HTMLElement>('#readme');
  if (!readmeEl) return null;

  const content = readmeEl.innerHTML;
  return content || null;
}

export function createNpmDetector(): SiteDetector {
  return {
    detectPage(): PageInfo {
      const url = window.location.href;

      if (isPackagePage()) {
        const packageName = getPackageName();
        const htmlContent = extractReadmeContent();

        if (htmlContent) {
          return {
            type: 'package-readme',
            site: 'npm',
            url,
            rawUrl: null,
            fileName: packageName ? `${packageName} README` : 'README',
            htmlContent,
          };
        }
      }

      return { type: 'none', site: 'npm', url, rawUrl: null, fileName: null };
    },

    findButtonInsertionPoint(): Element | null {
      const packageHeader = document.querySelector('[data-testid="package-name"]')?.parentElement ||
        document.querySelector('#top h1')?.parentElement ||
        document.querySelector('h1[class*="package"]')?.parentElement;
      if (packageHeader) return packageHeader;

      const readmeHeader = document.querySelector('#readme')?.previousElementSibling;
      if (readmeHeader) return readmeHeader;

      return null;
    },

    getSignificantSelectors(): string[] {
      return ['#readme', '[data-testid="package-name"]', 'article'];
    },
  };
}
