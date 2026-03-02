export interface EditorState {
  content: string;
  sourceUrl: string | null;
  currentDocumentId: string | null;
}

export interface EditorActions {
  setContent: (content: string) => void;
  setSourceUrl: (url: string | null) => void;
  setCurrentDocumentId: (id: string | null) => void;
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
