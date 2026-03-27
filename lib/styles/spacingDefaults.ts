import type { EditableElement } from '@/types/style';

export interface SpacingValues {
  [key: string]: number;
  marginTop: number;
  marginBottom: number;
  paddingTop: number;
  paddingBottom: number;
  paddingLeft: number;
  paddingRight: number;
}

/** Default spacing values (px) based on preview.css at 16px base */
export const SPACING_DEFAULTS: Record<EditableElement, SpacingValues> = {
  page: { marginTop: 0, marginBottom: 0, paddingTop: 40, paddingBottom: 40, paddingLeft: 40, paddingRight: 40 },
  h1: { marginTop: 24, marginBottom: 8, paddingTop: 0, paddingBottom: 5, paddingLeft: 0, paddingRight: 0 },
  h2: { marginTop: 24, marginBottom: 8, paddingTop: 0, paddingBottom: 5, paddingLeft: 0, paddingRight: 0 },
  h3: { marginTop: 24, marginBottom: 8, paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0 },
  h4: { marginTop: 24, marginBottom: 8, paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0 },
  h5: { marginTop: 24, marginBottom: 8, paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0 },
  h6: { marginTop: 24, marginBottom: 8, paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0 },
  paragraph: { marginTop: 0, marginBottom: 16, paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0 },
  bulletList: { marginTop: 0, marginBottom: 16, paddingTop: 0, paddingBottom: 0, paddingLeft: 32, paddingRight: 0 },
  orderedList: { marginTop: 0, marginBottom: 16, paddingTop: 0, paddingBottom: 0, paddingLeft: 32, paddingRight: 0 },
  todoList: { marginTop: 0, marginBottom: 16, paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0 },
  todoChecked: { marginTop: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0 },
  blockquote: { marginTop: 0, marginBottom: 16, paddingTop: 8, paddingBottom: 8, paddingLeft: 16, paddingRight: 16 },
  hr: { marginTop: 24, marginBottom: 24, paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0 },
  image: { marginTop: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0 },
  code: { marginTop: 0, marginBottom: 16, paddingTop: 16, paddingBottom: 16, paddingLeft: 16, paddingRight: 16 },
  table: { marginTop: 0, marginBottom: 16, paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0 },
  tableHeader: { marginTop: 0, marginBottom: 0, paddingTop: 8, paddingBottom: 8, paddingLeft: 16, paddingRight: 16 },
  tableCell: { marginTop: 0, marginBottom: 0, paddingTop: 8, paddingBottom: 8, paddingLeft: 16, paddingRight: 16 },
  tableEvenRow: { marginTop: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0 },
  strong: { marginTop: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0 },
};
