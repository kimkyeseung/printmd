import { describe, it, expect, beforeEach } from 'vitest';
import { useEditorStore } from '../editorStore';

describe('editorStore', () => {
  beforeEach(() => {
    useEditorStore.getState().reset();
  });

  it('has correct initial state', () => {
    const state = useEditorStore.getState();
    expect(state.sourceUrl).toBeNull();
  });

  it('setSourceUrl updates sourceUrl', () => {
    useEditorStore.getState().setSourceUrl('https://example.com');
    expect(useEditorStore.getState().sourceUrl).toBe('https://example.com');
  });

  it('reset restores initial state', () => {
    useEditorStore.getState().setSourceUrl('https://example.com');

    useEditorStore.getState().reset();

    const state = useEditorStore.getState();
    expect(state.sourceUrl).toBeNull();
  });
});
