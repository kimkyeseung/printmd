/**
 * Notion public page detector
 */

import type { PageInfo, SiteDetector } from '../types';

function isPublicPage(): boolean {
  return !!document.querySelector('.notion-page-content') ||
    !!document.querySelector('[class*="notion-page"]') ||
    !!document.querySelector('.super-content');
}

function getPageTitle(): string | null {
  const titleEl = document.querySelector<HTMLElement>('.notion-page__title') ||
    document.querySelector<HTMLElement>('[data-content-editable-leaf="true"]') ||
    document.querySelector<HTMLElement>('h1');
  return titleEl?.textContent?.trim() || document.title || null;
}

function extractPageContent(): string | null {
  const contentEl = document.querySelector<HTMLElement>('.notion-page-content') ||
    document.querySelector<HTMLElement>('[class*="notion-page"]') ||
    document.querySelector<HTMLElement>('.super-content') ||
    document.querySelector<HTMLElement>('article');

  if (!contentEl) return null;

  const title = getPageTitle();
  let content = '';
  if (title) content += `# ${title}\n\n`;
  content += contentEl.innerHTML;
  return content || null;
}

export function createNotionDetector(): SiteDetector {
  return {
    detectPage(): PageInfo {
      const url = window.location.href;

      if (isPublicPage()) {
        const htmlContent = extractPageContent();
        if (htmlContent) {
          return {
            type: 'document',
            site: 'notion',
            url,
            rawUrl: null,
            fileName: getPageTitle(),
            htmlContent,
          };
        }
      }

      return { type: 'none', site: 'notion', url, rawUrl: null, fileName: null };
    },

    findButtonInsertionPoint(): Element | null {
      const titleBlock = document.querySelector('.notion-page__title')?.parentElement ||
        document.querySelector('[class*="notion-page"] h1')?.parentElement;
      if (titleBlock) return titleBlock;

      const superHeader = document.querySelector('.super-navbar') ||
        document.querySelector('header');
      if (superHeader) return superHeader;

      return null;
    },

    getSignificantSelectors(): string[] {
      return ['.notion-page-content', '[class*="notion-page"]', '.super-content', 'article'];
    },
  };
}
