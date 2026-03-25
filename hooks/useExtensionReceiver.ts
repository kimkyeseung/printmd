import { useEffect } from 'react';
import { useEditorStore, useTabsStore } from '@/stores';
import { decodeDocumentFromUrl } from '@/lib/share/documentUrl';

interface ExtensionMessage {
  type: 'PRINTMD_CONTENT';
  content: string;
  sourceUrl?: string;
}

/**
 * Hook to receive content from the Chrome extension
 * Handles URL parameters (?src=, ?doc=) and postMessage methods
 */
export function useExtensionReceiver() {
  const setSourceUrl = useEditorStore((state) => state.setSourceUrl);
  const addTab = useTabsStore((state) => state.addTab);

  useEffect(() => {
    // Handle URL parameter method
    const handleUrlParam = async () => {
      const params = new URLSearchParams(window.location.search);
      const srcUrl = params.get('src');
      const docParam = params.get('doc');

      // Handle shared document (?doc=)
      if (docParam) {
        try {
          const content = await decodeDocumentFromUrl(docParam);
          if (content) {
            addTab({ content, title: 'Shared Document' });
          }
          // Clean URL without reload
          const cleanUrl = window.location.pathname;
          window.history.replaceState({}, '', cleanUrl);
        } catch (error) {
          console.error('Failed to decode shared document:', error);
        }
        return;
      }

      if (srcUrl) {
        try {
          const decodedUrl = decodeURIComponent(srcUrl);

          // Validate URL against allowed hosts to prevent arbitrary fetch
          const ALLOWED_HOSTS = ['raw.githubusercontent.com'];
          try {
            const url = new URL(decodedUrl);
            if (!ALLOWED_HOSTS.includes(url.hostname)) {
              console.warn('Blocked fetch from untrusted host:', url.hostname);
              return;
            }
          } catch {
            console.warn('Invalid URL:', decodedUrl);
            return;
          }

          // Fetch raw content from the validated URL
          const response = await fetch(decodedUrl);
          if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status}`);
          }

          const content = await response.text();
          addTab({ content, title: 'From Extension' });

          // Convert raw URL back to GitHub URL for display
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
      // Only accept messages from trusted origins
      if (event.origin !== window.location.origin) return;

      const data = event.data as ExtensionMessage;
      if (data?.type === 'PRINTMD_CONTENT' && data.content) {
        addTab({ content: data.content, title: 'From Extension' });
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
  }, [addTab, setSourceUrl]);
}
