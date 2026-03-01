/**
 * GitHub page detector - identifies markdown files and README sections
 */

export interface GitHubPageInfo {
  type: 'markdown-file' | 'readme' | 'none';
  url: string;
  rawUrl: string | null;
  fileName: string | null;
}

/**
 * Check if current page is a markdown file view
 */
function isMarkdownFileView(): boolean {
  const url = window.location.href;

  // Check URL pattern for blob view
  if (!url.includes('/blob/')) return false;

  // Check file extension
  const markdownExtensions = ['.md', '.markdown', '.mdown', '.mkd', '.mkdn'];
  return markdownExtensions.some((ext) => url.toLowerCase().endsWith(ext));
}

/**
 * Check if current page has a README section
 */
function isReadmePage(): boolean {
  // Check for README article element (new GitHub UI)
  const readmeArticle = document.querySelector('article[data-testid="readme"]');
  if (readmeArticle) return true;

  // Check for markdown-body article (current GitHub UI)
  const markdownArticle = document.querySelector('article.markdown-body.entry-content');
  if (markdownArticle) return true;

  // Check for readme-toc anchor (older GitHub UI)
  const readmeAnchor = document.querySelector('#readme');
  if (readmeAnchor) return true;

  return false;
}

/**
 * Get raw URL for current markdown file
 */
function getRawUrl(): string | null {
  const url = window.location.href;

  // Convert blob URL to raw URL
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+)/);
  if (!match) return null;

  const [, owner, repo, branch, path] = match;
  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
}

/**
 * Get raw URL for README
 */
function getReadmeRawUrl(): string | null {
  const url = window.location.href;

  // Extract owner/repo from URL
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) return null;

  const [, owner, repo] = match;

  // Try to find the default branch from the page
  const branchElement = document.querySelector('[data-hotkey="w"] span.Text-sc-17v1xeu-0');
  const branch = branchElement?.textContent?.trim() || 'main';

  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/README.md`;
}

/**
 * Get file name from URL
 */
function getFileName(): string | null {
  const url = window.location.href;
  const match = url.match(/\/([^/]+\.(?:md|markdown|mdown|mkd|mkdn))(?:\?|$)/i);
  return match ? match[1] : null;
}

/**
 * Detect the type of GitHub page
 */
export function detectPage(): GitHubPageInfo {
  const url = window.location.href;

  if (isMarkdownFileView()) {
    return {
      type: 'markdown-file',
      url,
      rawUrl: getRawUrl(),
      fileName: getFileName(),
    };
  }

  if (isReadmePage()) {
    return {
      type: 'readme',
      url,
      rawUrl: getReadmeRawUrl(),
      fileName: 'README.md',
    };
  }

  return {
    type: 'none',
    url,
    rawUrl: null,
    fileName: null,
  };
}

/**
 * Find the best insertion point for the button
 */
export function findButtonInsertionPoint(): Element | null {
  const pageInfo = detectPage();

  if (pageInfo.type === 'markdown-file') {
    // For file view, look for the "Raw" button's parent container
    const rawButton = document.querySelector('a[data-testid="raw-button"]');
    if (rawButton?.parentElement) {
      return rawButton.parentElement;
    }

    // Fallback: look for button group in file header
    const buttonGroup = document.querySelector('.file-header .BtnGroup');
    if (buttonGroup) return buttonGroup;

    // Another fallback: file actions container
    const fileActions = document.querySelector('[data-view-component="true"].file-actions');
    if (fileActions) return fileActions;
  }

  if (pageInfo.type === 'readme') {
    // For README, look for the header (new GitHub UI)
    const markdownHeading = document.querySelector('article.markdown-body .markdown-heading');
    if (markdownHeading) {
      return markdownHeading;
    }

    // Look for the first h1 in markdown-body
    const h1Heading = document.querySelector('article.markdown-body h1');
    if (h1Heading?.parentElement) {
      return h1Heading.parentElement;
    }

    // Fallback: look for the header (old GitHub UI)
    const readmeHeader = document.querySelector('#readme h2');
    if (readmeHeader?.parentElement) {
      return readmeHeader.parentElement;
    }

    // Fallback: readme-toc header
    const readmeTocHeader = document.querySelector('.Box-header.d-flex');
    if (readmeTocHeader) return readmeTocHeader;
  }

  return null;
}
