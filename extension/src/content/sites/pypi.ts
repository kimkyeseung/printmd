/**
 * PyPI page detector
 */

import type { PageInfo, SiteDetector } from '../types';

function isProjectPage(): boolean {
  return /^\/project\//.test(window.location.pathname);
}

function getProjectName(): string | null {
  const match = window.location.pathname.match(/^\/project\/([^/]+)/);
  return match ? match[1] : null;
}

function extractDescription(): string | null {
  const descEl = document.querySelector<HTMLElement>('.project-description');
  if (!descEl) return null;

  const content = descEl.innerHTML;
  return content || null;
}

export function createPyPIDetector(): SiteDetector {
  return {
    detectPage(): PageInfo {
      const url = window.location.href;

      if (isProjectPage()) {
        const projectName = getProjectName();
        const htmlContent = extractDescription();

        if (htmlContent) {
          return {
            type: 'package-readme',
            site: 'pypi',
            url,
            rawUrl: null,
            fileName: projectName ? `${projectName} README` : 'README',
            htmlContent,
          };
        }
      }

      return { type: 'none', site: 'pypi', url, rawUrl: null, fileName: null };
    },

    findButtonInsertionPoint(): Element | null {
      const projectHeader = document.querySelector('.banner .package-header__name')?.parentElement;
      if (projectHeader) return projectHeader;

      const descHeader = document.querySelector('.project-description')?.parentElement;
      if (descHeader) return descHeader;

      return null;
    },

    getSignificantSelectors(): string[] {
      return ['.project-description', '.package-header', '.banner'];
    },
  };
}
