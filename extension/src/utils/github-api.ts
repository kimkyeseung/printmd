/**
 * GitHub API utilities for fetching raw markdown content
 */

export interface GitHubFileInfo {
  owner: string;
  repo: string;
  branch: string;
  path: string;
}

/**
 * Parse GitHub blob URL to extract file info
 * Example: https://github.com/owner/repo/blob/main/README.md
 */
export function parseGitHubUrl(url: string): GitHubFileInfo | null {
  const match = url.match(
    /github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+)/
  );

  if (!match) return null;

  return {
    owner: match[1],
    repo: match[2],
    branch: match[3],
    path: match[4],
  };
}

/**
 * Convert GitHub blob URL to raw.githubusercontent.com URL
 */
export function toRawUrl(blobUrl: string): string | null {
  const info = parseGitHubUrl(blobUrl);
  if (!info) return null;

  return `https://raw.githubusercontent.com/${info.owner}/${info.repo}/${info.branch}/${info.path}`;
}

/**
 * Convert GitHub repository URL to README raw URL
 * Example: https://github.com/owner/repo -> raw URL for README.md
 * Tries 'main' first, then 'master' if not found
 */
export function getReadmeRawUrl(repoUrl: string, branch = 'main'): string | null {
  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) return null;

  const owner = match[1];
  const repo = match[2];

  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/README.md`;
}

/**
 * Try to fetch README with fallback branch detection
 */
export async function fetchReadmeWithFallback(repoUrl: string): Promise<{ content: string; branch: string } | null> {
  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) return null;

  const [, owner, repo] = match;
  const branches = ['main', 'master', 'develop'];

  for (const branch of branches) {
    const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/README.md`;
    try {
      const content = await fetchRawContent(rawUrl);
      return { content, branch };
    } catch {
      continue;
    }
  }

  return null;
}

/**
 * Fetch raw markdown content from GitHub
 */
export async function fetchRawContent(rawUrl: string): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(rawUrl, { signal: controller.signal });

    if (response.status === 404) {
      throw new GitHubFetchError(
        'File not found. This may be a private repository.',
        'NOT_FOUND'
      );
    }

    if (response.status === 403) {
      throw new GitHubFetchError(
        'Access denied. Private repositories require authentication.',
        'FORBIDDEN'
      );
    }

    if (!response.ok) {
      throw new GitHubFetchError(
        `Failed to fetch: ${response.status} ${response.statusText}`,
        'FETCH_ERROR'
      );
    }

    return response.text();
  } finally {
    clearTimeout(timeoutId);
  }
}

export class GitHubFetchError extends Error {
  constructor(
    message: string,
    public readonly code: 'NOT_FOUND' | 'FORBIDDEN' | 'FETCH_ERROR' | 'TIMEOUT'
  ) {
    super(message);
    this.name = 'GitHubFetchError';
  }
}

/**
 * Get raw content from a GitHub page URL
 */
export async function getMarkdownContent(url: string): Promise<{ content: string; sourceUrl: string }> {
  const rawUrl = toRawUrl(url);

  if (!rawUrl) {
    throw new Error('Invalid GitHub URL');
  }

  const content = await fetchRawContent(rawUrl);

  return {
    content,
    sourceUrl: url,
  };
}
