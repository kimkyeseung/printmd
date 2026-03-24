/**
 * Bitbucket page detector
 */

import type { PageInfo, SiteDetector } from '../types';

const MARKDOWN_EXTENSIONS = ['.md', '.markdown', '.mdown', '.mkd', '.mkdn'];

function isMarkdownFileView(): boolean {
  const url = window.location.href;
  if (!url.includes('/src/')) return false;
  return MARKDOWN_EXTENSIONS.some((ext) => url.toLowerCase().endsWith(ext));
}

function isReadmePage(): boolean {
  const url = window.location.pathname;
  const isRepoRoot = /^\/[^/]+\/[^/]+\/?$/.test(url);
  if (!isRepoRoot) return false;

  return !!document.querySelector('[data-testid="readme"]') ||
    !!document.querySelector('.readme-container') ||
    !!document.querySelector('#readme');
}

function isPullRequestPage(): boolean {
  return /\/pull-requests\/\d+/.test(window.location.href);
}

function getRawUrl(): string | null {
  const url = window.location.href;
  const match = url.match(/bitbucket\.org\/([^/]+\/[^/]+)\/src\/(.+)/);
  if (!match) return null;
  return `https://bitbucket.org/${match[1]}/raw/${match[2]}`;
}

function getReadmeRawUrl(): string | null {
  const url = window.location.href;
  const match = url.match(/bitbucket\.org\/([^/]+\/[^/]+)/);
  if (!match) return null;

  const branchEl = document.querySelector<HTMLElement>('[data-testid="branch-name"]');
  const branch = branchEl?.textContent?.trim() || 'main';

  return `https://bitbucket.org/${match[1]}/raw/${branch}/README.md`;
}

function getFileName(): string | null {
  const url = window.location.href;
  const match = url.match(/\/([^/]+\.(?:md|markdown|mdown|mkd|mkdn))(?:\?|$)/i);
  return match ? match[1] : null;
}

function extractPrContent(): string | null {
  const titleEl = document.querySelector<HTMLElement>('[data-testid="pull-request-title"]') ||
    document.querySelector<HTMLElement>('#pull-request-details h1');
  const title = titleEl?.textContent?.trim() || '';
  const bodyEl = document.querySelector<HTMLElement>('[data-testid="pull-request-description"]') ||
    document.querySelector<HTMLElement>('.description .markup');
  if (!bodyEl) return null;

  let content = '';
  if (title) content += `# ${title}\n\n`;
  content += bodyEl.innerHTML;
  return content || null;
}

export function createBitbucketDetector(): SiteDetector {
  return {
    detectPage(): PageInfo {
      const url = window.location.href;

      if (isPullRequestPage()) {
        return {
          type: 'issue-pr',
          site: 'bitbucket',
          url,
          rawUrl: null,
          fileName: document.querySelector<HTMLElement>('#pull-request-details h1')?.textContent?.trim() || null,
          htmlContent: extractPrContent(),
        };
      }

      if (isMarkdownFileView()) {
        return {
          type: 'markdown-file',
          site: 'bitbucket',
          url,
          rawUrl: getRawUrl(),
          fileName: getFileName(),
        };
      }

      if (isReadmePage()) {
        return {
          type: 'readme',
          site: 'bitbucket',
          url,
          rawUrl: getReadmeRawUrl(),
          fileName: 'README.md',
        };
      }

      return { type: 'none', site: 'bitbucket', url, rawUrl: null, fileName: null };
    },

    findButtonInsertionPoint(): Element | null {
      const pageInfo = this.detectPage();

      if (pageInfo.type === 'markdown-file') {
        const fileActions = document.querySelector('[data-testid="file-actions"]') ||
          document.querySelector('.file-toolbar');
        if (fileActions) return fileActions;
      }

      if (pageInfo.type === 'issue-pr') {
        const headerActions = document.querySelector('[data-testid="pull-request-actions"]');
        if (headerActions) return headerActions;
      }

      if (pageInfo.type === 'readme') {
        const readmeHeader = document.querySelector('[data-testid="readme"] header') ||
          document.querySelector('.readme-container header');
        if (readmeHeader) return readmeHeader;
      }

      return null;
    },

    getSignificantSelectors(): string[] {
      return ['[data-testid="readme"]', '.readme-container', '.file-content', '.markup'];
    },
  };
}
