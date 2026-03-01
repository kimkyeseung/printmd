import { useEffect } from 'react';
import { useEditorStore } from '@/stores';

interface ExtensionMessage {
  type: 'PRINTMD_CONTENT';
  content: string;
  sourceUrl?: string;
}

/**
 * Hook to receive content from the Chrome extension
 * Handles both URL parameter and postMessage methods
 */
export function useExtensionReceiver() {
  const setContent = useEditorStore((state) => state.setContent);
  const setSourceUrl = useEditorStore((state) => state.setSourceUrl);

  useEffect(() => {
    // Handle URL parameter method
    const handleUrlParam = async () => {
      const params = new URLSearchParams(window.location.search);
      const srcUrl = params.get('src');

      if (srcUrl) {
        try {
          const decodedUrl = decodeURIComponent(srcUrl);

          // Fetch raw content from the URL
          const response = await fetch(decodedUrl);
          if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status}`);
          }

          const content = await response.text();
          setContent(content);

          // Convert raw URL back to GitHub URL for display
          // raw.githubusercontent.com/owner/repo/branch/path -> github.com/owner/repo/blob/branch/path
          const rawMatch = decodedUrl.match(/raw\.githubusercontent\.com\/([^/]+)\/([^/]+)\/([^/]+)\/(.+)/);
          if (rawMatch) {
            const [, owner, repo, branch, path] = rawMatch;
            const githubUrl = `https://github.com/${owner}/${repo}/blob/${branch}/${path}`;
            setSourceUrl(githubUrl);
          } else {
            setSourceUrl(decodedUrl);
          }

          // Clean URL without reload
          const cleanUrl = window.location.pathname;
          window.history.replaceState({}, '', cleanUrl);
        } catch (error) {
          console.error('Failed to load content from URL:', error);
        }
      }
    };

    // Handle postMessage method (for large content)
    const handleMessage = (event: MessageEvent) => {
      // Verify origin in production
      // if (event.origin !== 'chrome-extension://...') return;

      const data = event.data as ExtensionMessage;
      if (data?.type === 'PRINTMD_CONTENT' && data.content) {
        setContent(data.content);
        if (data.sourceUrl) {
          setSourceUrl(data.sourceUrl);
        }
      }
    };

    // Run URL param handler
    handleUrlParam();

    // Listen for postMessage
    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [setContent, setSourceUrl]);
}
