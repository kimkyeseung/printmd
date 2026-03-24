/**
 * GitLab page detector
 */

import type { PageInfo, SiteDetector } from '../types';

const MARKDOWN_EXTENSIONS = ['.md', '.markdown', '.mdown', '.mkd', '.mkdn'];

function isMarkdownFileView(): boolean {
  const url = window.location.href;
  if (!url.includes('/-/blob/')) return false;
  return MARKDOWN_EXTENSIONS.some((ext) => url.toLowerCase().endsWith(ext));
}

function isReadmePage(): boolean {
  // GitLab repo root shows README
  const url = window.location.pathname;
  const isRepoRoot = /^\/[^/]+\/[^/]+\/?$/.test(url);
  if (!isRepoRoot) return false;

  return !!document.querySelector('.readme-holder') || !!document.querySelector('#readme');
}

function isIssueMrPage(): boolean {
  return /\/-\/(issues|merge_requests)\/\d+/.test(window.location.href);
}

function getRawUrl(): string | null {
  const url = window.location.href;
  // Convert /-/blob/ to /-/raw/
  const match = url.match(/gitlab\.com\/(.+?)\/-\/blob\/(.+)/);
  if (!match) return null;
  return `https://gitlab.com/${match[1]}/-/raw/${match[2]}`;
}

function getReadmeRawUrl(): string | null {
  const url = window.location.href;
  const match = url.match(/gitlab\.com\/([^/]+\/[^/]+)/);
  if (!match) return null;

  // Try to get branch from DOM
  const branchEl = document.querySelector<HTMLElement>('.ref-selector .gl-button-text');
  const branch = branchEl?.textContent?.trim() || 'main';

  return `https://gitlab.com/${match[1]}/-/raw/${branch}/README.md`;
}

function getFileName(): string | null {
  const url = window.location.href;
  const match = url.match(/\/([^/]+\.(?:md|markdown|mdown|mkd|mkdn))(?:\?|$)/i);
  return match ? match[1] : null;
}

function extractIssueMrContent(): string | null {
  const titleEl = document.querySelector<HTMLElement>('.detail-page-header .title');
  const title = titleEl?.textContent?.trim() || '';
  const bodyEl = document.querySelector<HTMLElement>('.description .md');
  if (!bodyEl) return null;

  let content = '';
  if (title) content += `# ${title}\n\n`;
  content += bodyEl.innerHTML;
  return content || null;
}

export function createGitLabDetector(): SiteDetector {
  return {
    detectPage(): PageInfo {
      const url = window.location.href;

      if (isIssueMrPage()) {
        return {
          type: 'issue-pr',
          site: 'gitlab',
          url,
          rawUrl: null,
          fileName: document.querySelector<HTMLElement>('.detail-page-header .title')?.textContent?.trim() || null,
          htmlContent: extractIssueMrContent(),
        };
      }

      if (isMarkdownFileView()) {
        return {
          type: 'markdown-file',
          site: 'gitlab',
          url,
          rawUrl: getRawUrl(),
          fileName: getFileName(),
        };
      }

      if (isReadmePage()) {
        return {
          type: 'readme',
          site: 'gitlab',
          url,
          rawUrl: getReadmeRawUrl(),
          fileName: 'README.md',
        };
      }

      return { type: 'none', site: 'gitlab', url, rawUrl: null, fileName: null };
    },

    findButtonInsertionPoint(): Element | null {
      const pageInfo = this.detectPage();

      if (pageInfo.type === 'markdown-file') {
        const fileActions = document.querySelector('.file-actions') || document.querySelector('.file-header-content');
        if (fileActions) return fileActions;
      }

      if (pageInfo.type === 'issue-pr') {
        const headerActions = document.querySelector('.detail-page-header-actions');
        if (headerActions) return headerActions;
      }

      if (pageInfo.type === 'readme') {
        const readmeHeader = document.querySelector('.readme-holder .file-title-flex-parent');
        if (readmeHeader) return readmeHeader;
        const readmeH1 = document.querySelector('.readme-holder h1');
        if (readmeH1?.parentElement) return readmeH1.parentElement;
      }

      return null;
    },

    getSignificantSelectors(): string[] {
      return ['.readme-holder', '.file-holder', '.detail-page-description', '.md'];
    },
  };
}
