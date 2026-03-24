/**
 * GitHub page detector - wraps existing github.ts as SiteDetector
 */

import type { SiteDetector } from '../types';
import { detectPage as detectGitHubPage, findButtonInsertionPoint as findGitHubInsertionPoint } from '../github';

export function createGitHubDetector(): SiteDetector {
  return {
    detectPage() {
      const result = detectGitHubPage();
      return {
        ...result,
        site: 'github' as const,
      };
    },

    findButtonInsertionPoint() {
      return findGitHubInsertionPoint();
    },

    getSignificantSelectors() {
      return [
        '#repo-content-turbo-frame',
        '.repository-content',
        '.markdown-body',
        'article',
        '.file-header',
      ];
    },
  };
}
