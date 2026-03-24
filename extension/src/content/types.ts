/**
 * Common types for site detection across all supported platforms
 */

export interface PageInfo {
  type: 'markdown-file' | 'readme' | 'gist' | 'issue-pr' | 'package-readme' | 'document' | 'none';
  site: 'github' | 'gitlab' | 'bitbucket' | 'npm' | 'pypi' | 'notion';
  url: string;
  rawUrl: string | null;
  fileName: string | null;
  /** HTML content extracted from DOM (for sites without raw URLs) */
  htmlContent?: string | null;
}

export interface SiteDetector {
  detectPage(): PageInfo;
  findButtonInsertionPoint(): Element | null;
  getSignificantSelectors(): string[];
}
