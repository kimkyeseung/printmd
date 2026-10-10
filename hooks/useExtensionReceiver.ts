import { useEffect } from 'react';
import { useEditorStore, useTabsStore } from '@/stores';
import { decodeDocumentFromUrl } from '@/lib/share/documentUrl';

/**
 * Content handed over by the extension. Its marker script posts this from
 * inside the page (so from our own origin) after we announce PRINTMD_READY.
 * Messages without `format` come from older extension versions and are
 * Markdown.
 */
interface ExtensionMessage {
  type: 'PRINTMD_CONTENT';
  content: string;
  sourceUrl?: string;
  /** Handoff id from the `?ext=` parameter; each is opened once. */
  id?: string;
  format?: 'html' | 'markdown';
  title?: string | null;
}

/** Survives React's dev double-mount, which would otherwise open two tabs. */
const handledHandoffs = new Set<string>();

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

      if (event.source !== window) return;

      const data = event.data as ExtensionMessage;
      if (data?.type !== 'PRINTMD_CONTENT' || !data.content) return;
      if (data.id) {
        if (handledHandoffs.has(data.id)) return;
        handledHandoffs.add(data.id);
      }

      void (async () => {
        let content = data.content;
        if (data.format === 'html') {
          const { htmlToMarkdown } = await import('@/lib/editor/htmlPaste');
          content = htmlToMarkdown(content);
        }
        addTab({ content, title: data.title?.trim() || 'From Extension' });
        if (data.sourceUrl) {
          setSourceUrl(data.sourceUrl);
        }
        if (data.id) {
          // Drop ?ext= so a reload doesn't wait for content that's gone.
          const url = new URL(window.location.href);
          url.searchParams.delete('ext');
          window.history.replaceState({}, '', url.pathname + url.search + url.hash);
        }
      })();
    };

    // Run URL param handler
    handleUrlParam();

    // Listen for postMessage
    window.addEventListener('message', handleMessage);

    // Opened by the extension with content waiting: tell its marker script
    // we're listening.
    if (new URLSearchParams(window.location.search).has('ext')) {
      window.postMessage({ type: 'PRINTMD_READY' }, window.location.origin);
    }

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [addTab, setSourceUrl]);
}
