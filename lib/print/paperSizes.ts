import type { PaperSize, PaperSizeConfig } from '@/types/print';

export const paperSizes: Record<PaperSize, PaperSizeConfig> = {
  A4: {
    name: 'A4',
    width: 210,
    height: 297,
    unit: 'mm',
  },
  Letter: {
    name: 'Letter',
    width: 216,
    height: 279,
    unit: 'mm',
  },
  A3: {
    name: 'A3',
    width: 297,
    height: 420,
    unit: 'mm',
  },
};

export function getPaperDimensions(
  size: PaperSize,
  orientation: 'portrait' | 'landscape'
): { width: number; height: number } {
  const config = paperSizes[size];
  if (orientation === 'landscape') {
    return { width: config.height, height: config.width };
  }
  return { width: config.width, height: config.height };
}

export function mmToPx(mm: number, dpi: number = 96): number {
  return (mm / 25.4) * dpi;
}