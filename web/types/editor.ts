export interface Tab {
  id: string;
  documentId: string | null;
  title: string;
  content: string;
  lastSavedContent: string;
  isDirty: boolean;
}

export interface TabsState {
  tabs: Tab[];
  activeTabId: string | null;
}

export interface TabsActions {
  addTab: (options?: { documentId?: string | null; content?: string; title?: string }) => string;
  removeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  updateTabContent: (tabId: string, content: string) => void;
  markTabSaved: (tabId: string, documentId?: string, title?: string) => void;
  updateTabTitle: (tabId: string, title: string) => void;
  getActiveTab: () => Tab | undefined;
}

export type TabsStore = TabsState & TabsActions;

export interface EditorState {
  sourceUrl: string | null;
}

export interface EditorActions {
  setSourceUrl: (url: string | null) => void;
  reset: () => void;
}

export type EditorStore = EditorState & EditorActions;

export type ToolbarAction =
  | 'bold'
  | 'italic'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'link'
  | 'image'
  | 'code'
  | 'codeblock'
  | 'hr'
  | 'quote'
  | 'ul'
  | 'ol';

export interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

export interface ToolbarProps {
  onAction: (action: ToolbarAction) => void;
}
