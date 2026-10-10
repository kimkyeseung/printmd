import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useExtensionReceiver } from '../useExtensionReceiver';
import { useTabsStore } from '@/stores';

function post(data: unknown, init: { origin?: string; source?: MessageEventSource | null } = {}) {
  window.dispatchEvent(
    new MessageEvent('message', {
      data,
      origin: init.origin ?? window.location.origin,
      source: init.source === undefined ? window : init.source,
    })
  );
}

const tabs = () => useTabsStore.getState().tabs;

describe('useExtensionReceiver', () => {
  beforeEach(() => {
    useTabsStore.setState({ tabs: [], activeTabId: null });
    window.history.replaceState({}, '', '/ko');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('announces it is listening when opened with ?ext=', () => {
    window.history.replaceState({}, '', '/ko?ext=abc');
    const postMessage = vi.spyOn(window, 'postMessage');
    renderHook(() => useExtensionReceiver());
    expect(postMessage).toHaveBeenCalledWith({ type: 'PRINTMD_READY' }, window.location.origin);
  });

  it('does not announce without ?ext=', () => {
    const postMessage = vi.spyOn(window, 'postMessage');
    renderHook(() => useExtensionReceiver());
    expect(postMessage).not.toHaveBeenCalled();
  });

  it('converts handed-off HTML to Markdown, titles the tab and clears ?ext=', async () => {
    window.history.replaceState({}, '', '/ko?ext=h1');
    renderHook(() => useExtensionReceiver());
    post({
      type: 'PRINTMD_CONTENT',
      id: 'h1',
      format: 'html',
      title: 'left-pad',
      content: '<h1>left-pad</h1><ul><li>pads strings</li></ul>',
      sourceUrl: 'https://www.npmjs.com/package/left-pad',
    });

    await waitFor(() => expect(tabs()).toHaveLength(1));
    expect(tabs()[0].content).toBe('# left-pad\n\n- pads strings');
    expect(tabs()[0].title).toBe('left-pad');
    expect(window.location.search).toBe('');
  });

  it('opens each handoff only once, even across remounts', async () => {
    window.history.replaceState({}, '', '/ko?ext=dup');
    const first = renderHook(() => useExtensionReceiver());
    first.unmount();
    renderHook(() => useExtensionReceiver());
    renderHook(() => useExtensionReceiver());
    const message = { type: 'PRINTMD_CONTENT', id: 'dup', format: 'markdown', content: '# Hi' };
    post(message);
    post(message);

    await waitFor(() => expect(tabs()).toHaveLength(1));
    await new Promise((r) => setTimeout(r, 20));
    expect(tabs()).toHaveLength(1);
  });

  it('ignores messages from other origins or other windows', async () => {
    renderHook(() => useExtensionReceiver());
    const message = { type: 'PRINTMD_CONTENT', content: '# x' };
    post(message, { origin: 'https://github.com' });
    post(message, { source: null });
    await new Promise((r) => setTimeout(r, 20));
    expect(tabs()).toHaveLength(0);
  });

  it('still accepts Markdown messages from older extension versions', async () => {
    renderHook(() => useExtensionReceiver());
    post({ type: 'PRINTMD_CONTENT', content: '# Legacy **md**' });
    await waitFor(() => expect(tabs()).toHaveLength(1));
    expect(tabs()[0].content).toBe('# Legacy **md**');
    expect(tabs()[0].title).toBe('From Extension');
  });
});
