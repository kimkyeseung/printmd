/**
 * GitHub page detector - identifies markdown files and README sections
 */

export interface GitHubPageInfo {
  type: 'markdown-file' | 'readme' | 'gist' | 'issue-pr' | 'none';
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
  const url = window.location.href;

  // Must be a repo root page (not /blob/, /tree/, /issues/, etc.)
  // Allow: /owner/repo or /owner/repo/ or /owner/repo?tab=readme
  const repoRootPattern = /^https:\/\/github\.com\/[^/]+\/[^/]+\/?(\?.*)?$/;
  const isRepoRoot = repoRootPattern.test(url) || url.includes('?tab=readme');

  if (!isRepoRoot) return false;

  // Check for README article element (new GitHub UI)
  const readmeArticle = document.querySelector('article[data-testid="readme"]');
  if (readmeArticle) return true;

  // Check for markdown-body article (current GitHub UI)
  const markdownArticle = document.querySelector('article.markdown-body');
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
 * Detect the default branch of the repository
 */
function detectDefaultBranch(): string {
  // Method 1: Meta tag (most reliable when available)
  const defaultBranchMeta = document.querySelector('meta[name="default-branch"]');
  if (defaultBranchMeta) {
    const content = defaultBranchMeta.getAttribute('content');
    if (content) return content;
  }

  // Method 2: data-default-branch attribute on repo-root element
  const repoRoot = document.querySelector('[data-default-branch]');
  if (repoRoot) {
    const branch = repoRoot.getAttribute('data-default-branch');
    if (branch) return branch;
  }

  // Method 3: Branch switcher button text
  const branchButton = document.querySelector('[data-hotkey="w"]');
  if (branchButton) {
    const buttonText = branchButton.textContent?.trim();
    const branchMatch = buttonText?.match(/^(\S+)/);
    if (branchMatch?.[1]) return branchMatch[1];
  }

  // Method 4: Look for branch name in the URL (tree view)
  const url = window.location.href;
  const treeMatch = url.match(/github\.com\/[^/]+\/[^/]+\/tree\/([^/]+)/);
  if (treeMatch) return treeMatch[1];

  // Method 5: Check the ref selector in new GitHub UI
  const refSelector = document.querySelector<HTMLElement>('#branch-picker-repos-header-ref-selector');
  if (refSelector) {
    const selectedText = refSelector.textContent?.trim();
    if (selectedText) return selectedText;
  }

  // Default fallback
  return 'main';
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
  const branch = detectDefaultBranch();

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
 * Check if current page is a GitHub Issue or Pull Request
 */
function isIssuePrPage(): boolean {
  const url = window.location.href;
  return /github\.com\/[^/]+\/[^/]+\/(issues|pull)\/\d+/.test(url);
}

/**
 * Get title for Issue/PR page
 */
function getIssuePrTitle(): string | null {
  const titleEl = document.querySelector<HTMLElement>('.gh-header-title .js-issue-title');
  return titleEl?.textContent?.trim() || document.title.split('·')[0]?.trim() || null;
}

/**
 * Check if current page is a GitHub Gist with markdown content
 */
function isGistPage(): boolean {
  return window.location.hostname === 'gist.github.com';
}

/**
 * Get raw URL for a Gist markdown file
 */
function getGistRawUrl(): string | null {
  // Look for the "Raw" button link in the Gist file header
  const rawLinks = document.querySelectorAll<HTMLAnchorElement>('a[href*="gist.githubusercontent.com"]');
  for (const link of rawLinks) {
    const href = link.href;
    const markdownExtensions = ['.md', '.markdown', '.mdown', '.mkd', '.mkdn'];
    if (markdownExtensions.some((ext) => href.toLowerCase().includes(ext))) {
      return href;
    }
  }

  // Fallback: any raw link from gist (first markdown file)
  const fileHeaders = document.querySelectorAll('.file-header');
  for (const header of fileHeaders) {
    const fileInfo = header.querySelector('.file-info a');
    const fileName = fileInfo?.textContent?.trim() || '';
    const markdownExtensions = ['.md', '.markdown', '.mdown', '.mkd', '.mkdn'];
    if (markdownExtensions.some((ext) => fileName.toLowerCase().endsWith(ext))) {
      const rawLink = header.querySelector<HTMLAnchorElement>('a[href*="/raw/"]');
      if (rawLink) return rawLink.href;
    }
  }

  return null;
}

/**
 * Get filename from a Gist page
 */
function getGistFileName(): string | null {
  const fileHeaders = document.querySelectorAll('.file-header');
  for (const header of fileHeaders) {
    const fileInfo = header.querySelector('.file-info a');
    const fileName = fileInfo?.textContent?.trim() || '';
    const markdownExtensions = ['.md', '.markdown', '.mdown', '.mkd', '.mkdn'];
    if (markdownExtensions.some((ext) => fileName.toLowerCase().endsWith(ext))) {
      return fileName;
    }
  }
  return null;
}

/**
 * Detect the type of GitHub page
 */
export function detectPage(): GitHubPageInfo {
  const url = window.location.href;

  if (isGistPage()) {
    const gistRawUrl = getGistRawUrl();
    if (gistRawUrl) {
      return {
        type: 'gist',
        url,
        rawUrl: gistRawUrl,
        fileName: getGistFileName(),
      };
    }
  }

  if (isIssuePrPage()) {
    return {
      type: 'issue-pr',
      url,
      rawUrl: null, // Issue/PR has no raw URL, content is extracted from DOM
      fileName: getIssuePrTitle(),
    };
  }

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

  if (pageInfo.type === 'issue-pr') {
    // For Issue/PR, look for the header actions area
    const headerActions = document.querySelector('.gh-header-actions');
    if (headerActions) return headerActions;

    // Fallback: issue header
    const header = document.querySelector('.gh-header-show');
    if (header) return header;
  }

  if (pageInfo.type === 'gist') {
    // For Gist, look for the file actions area
    const fileActions = document.querySelector('.file-header .file-actions');
    if (fileActions) return fileActions;

    // Fallback: first file header
    const fileHeader = document.querySelector('.file-header');
    if (fileHeader) return fileHeader;
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
