import { describe, it, expect, beforeEach } from 'vitest';
import { useEditorStore } from '../editorStore';

describe('editorStore', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useEditorStore.getState().reset();
  });

  it('has correct initial state', () => {
    const state = useEditorStore.getState();
    expect(state.content).toBe('');
    expect(state.sourceUrl).toBeNull();
    expect(state.currentDocumentId).toBeNull();
  });

  it('setContent updates content', () => {
    useEditorStore.getState().setContent('# Hello');
    expect(useEditorStore.getState().content).toBe('# Hello');
  });

  it('setContent replaces previous content', () => {
    useEditorStore.getState().setContent('first');
    useEditorStore.getState().setContent('second');
    expect(useEditorStore.getState().content).toBe('second');
  });

  it('setSourceUrl updates sourceUrl', () => {
    useEditorStore.getState().setSourceUrl('https://example.com');
    expect(useEditorStore.getState().sourceUrl).toBe('https://example.com');
  });

  it('setCurrentDocumentId updates currentDocumentId', () => {
    useEditorStore.getState().setCurrentDocumentId('doc-123');
    expect(useEditorStore.getState().currentDocumentId).toBe('doc-123');
  });

  it('reset restores initial state', () => {
    useEditorStore.getState().setContent('some content');
    useEditorStore.getState().setSourceUrl('https://example.com');
    useEditorStore.getState().setCurrentDocumentId('doc-123');

    useEditorStore.getState().reset();

    const state = useEditorStore.getState();
    expect(state.content).toBe('');
    expect(state.sourceUrl).toBeNull();
    expect(state.currentDocumentId).toBeNull();
  });
});
