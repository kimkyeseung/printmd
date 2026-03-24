/**
 * Site detector router - selects the right detector based on hostname
 */

import type { SiteDetector } from '../types';
import { createGitHubDetector } from './github';
import { createGitLabDetector } from './gitlab';
import { createBitbucketDetector } from './bitbucket';
import { createNpmDetector } from './npm';
import { createPyPIDetector } from './pypi';
import { createNotionDetector } from './notion';

export function getSiteDetector(): SiteDetector | null {
  const hostname = window.location.hostname;

  if (hostname === 'github.com' || hostname === 'gist.github.com') {
    return createGitHubDetector();
  }

  if (hostname === 'gitlab.com' || hostname.endsWith('.gitlab.io')) {
    return createGitLabDetector();
  }

  if (hostname === 'bitbucket.org') {
    return createBitbucketDetector();
  }

  if (hostname === 'www.npmjs.com') {
    return createNpmDetector();
  }

  if (hostname === 'pypi.org') {
    return createPyPIDetector();
  }

  if (hostname === 'notion.so' || hostname.endsWith('.notion.site')) {
    return createNotionDetector();
  }

  return null;
}
