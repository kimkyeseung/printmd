export type PaperSize = 'A4' | 'Letter' | 'A3';
export type Orientation = 'portrait' | 'landscape';

export interface Margins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface HeaderFooterConfig {
  enabled: boolean;
  left: string;
  center: string;
  right: string;
}

export interface PrintSettings {
  paperSize: PaperSize;
  orientation: Orientation;
  margins: Margins;
  includeBackground: boolean;
  header: HeaderFooterConfig;
  footer: HeaderFooterConfig;
}

export interface PrintState {
  settings: PrintSettings;
  isPreviewOpen: boolean;
}

export interface PrintActions {
  updateSettings: (settings: Partial<PrintSettings>) => void;
  updateMargins: (margins: Partial<Margins>) => void;
  updateHeader: (header: Partial<HeaderFooterConfig>) => void;
  updateFooter: (footer: Partial<HeaderFooterConfig>) => void;
  openPreview: () => void;
  closePreview: () => void;
  print: () => void;
}

export type PrintStore = PrintState & PrintActions;

export interface PaperSizeConfig {
  name: string;
  width: number;
  height: number;
  unit: 'mm';
}

export interface PrintPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  onPrint: () => void;
}

export interface PrintSettingsProps {
  settings: PrintSettings;
  onChange: (settings: Partial<PrintSettings>) => void;
}

export interface HeaderFooterProps {
  header: HeaderFooterConfig;
  footer: HeaderFooterConfig;
  onHeaderChange: (header: Partial<HeaderFooterConfig>) => void;
  onFooterChange: (footer: Partial<HeaderFooterConfig>) => void;
}
