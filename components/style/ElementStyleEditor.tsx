'use client';

import { useState, useMemo, useCallback } from 'react';
import { ColorPicker } from './ColorPicker';
import { Slider } from './Slider';
import { useStyleStore, useTabsStore, useUIStore } from '@/stores';
import { FONT_OPTIONS_WITH_DEFAULT as FONT_OPTIONS } from '@/lib/fonts/constants';
import { showToast } from '@/components/ui/Toast';
import type { EditableElement, ElementStyle } from '@/types/style';

const FONT_WEIGHT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: '300', label: 'Light' },
  { value: '400', label: 'Normal' },
  { value: '500', label: 'Medium' },
  { value: '600', label: 'Semi Bold' },
  { value: '700', label: 'Bold' },
  { value: '800', label: 'Extra Bold' },
];

/** Default spacing values (px) based on preview.css at 16px base */
const SPACING_DEFAULTS: Record<EditableElement, {
  marginTop: number;
  marginBottom: number;
  paddingTop: number;
  paddingBottom: number;
  paddingLeft: number;
  paddingRight: number;
}> = {
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

const ELEMENTS: { key: EditableElement; label: string }[] = [
  { key: 'page', label: 'Page' },
  { key: 'h1', label: 'H1' },
  { key: 'h2', label: 'H2' },
  { key: 'h3', label: 'H3' },
  { key: 'h4', label: 'H4' },
  { key: 'h5', label: 'H5' },
  { key: 'h6', label: 'H6' },
  { key: 'paragraph', label: 'Text' },
  { key: 'bulletList', label: 'Bullet List' },
  { key: 'orderedList', label: 'Ordered List' },
  { key: 'todoList', label: 'Todo List' },
  { key: 'todoChecked', label: 'Todo (checked)' },
  { key: 'blockquote', label: 'Quote' },
  { key: 'hr', label: 'Divider' },
  { key: 'image', label: 'Image' },
  { key: 'code', label: 'Code' },
  { key: 'table', label: 'Table' },
];

function detectUsedElements(markdown: string): Set<EditableElement> {
  const used = new Set<EditableElement>(['page']);
  if (/^# /m.test(markdown)) used.add('h1');
  if (/^## /m.test(markdown)) used.add('h2');
  if (/^### /m.test(markdown)) used.add('h3');
  if (/^#### /m.test(markdown)) used.add('h4');
  if (/^##### /m.test(markdown)) used.add('h5');
  if (/^###### /m.test(markdown)) used.add('h6');
  if (/^[^#\-\*\d>|`!\[].*\S/m.test(markdown)) used.add('paragraph');
  if (/^[\-\*] /m.test(markdown)) used.add('bulletList');
  if (/^\d+\. /m.test(markdown)) used.add('orderedList');
  if (/^- \[[ x]\]/m.test(markdown)) used.add('todoList');
  if (/^- \[x\]/mi.test(markdown)) used.add('todoChecked');
  if (/^>/m.test(markdown)) used.add('blockquote');
  if (/^---/m.test(markdown) || /^\*\*\*/m.test(markdown)) used.add('hr');
  if (/!\[.*\]\(.*\)/m.test(markdown)) used.add('image');
  if (/```/m.test(markdown) || /`[^`]+`/.test(markdown)) used.add('code');
  if (/^\|.*\|/m.test(markdown)) used.add('table');
  return used;
}

/** Collapsible section wrapper */
function Section({ title, defaultOpen = true, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-xs font-medium text-[var(--ui-text-muted)] uppercase hover:text-[var(--foreground)]"
      >
        <svg
          className={`h-3 w-3 transition-transform ${open ? 'rotate-90' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        {title}
      </button>
      {open && children}
    </div>
  );
}

/** Padding/Margin 4-field grid */
function SpacingGrid({
  values,
  onChange,
  max = 100,
  fields: fieldOverride,
  onFieldFocus,
  onFieldBlur,
  defaults,
}: {
  values: { top?: number; bottom?: number; left?: number; right?: number };
  onChange: (field: string, value: number | undefined) => void;
  max?: number;
  fields?: readonly { key: 'top' | 'bottom' | 'left' | 'right'; label: string }[];
  onFieldFocus?: (field: string) => void;
  onFieldBlur?: () => void;
  defaults?: { top?: number; bottom?: number; left?: number; right?: number };
}) {
  const fields = fieldOverride ?? [
    { key: 'top', label: 'Top' },
    { key: 'bottom', label: 'Bottom' },
    { key: 'left', label: 'Left' },
    { key: 'right', label: 'Right' },
  ] as const;

  return (
    <div className="grid grid-cols-2 gap-2">
      {fields.map(({ key, label }) => (
        <div key={key} className="flex flex-col gap-1">
          <label className="text-xs text-[var(--ui-text-muted)]">{label}</label>
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={values[key] ?? ''}
              onChange={(e) => onChange(key, e.target.value ? Number(e.target.value) : undefined)}
              onFocus={() => onFieldFocus?.(key)}
              onBlur={() => onFieldBlur?.()}
              placeholder={String(defaults?.[key] ?? 0)}
              className="w-full rounded border border-[var(--ui-border)] bg-transparent px-2 py-1.5 text-sm"
              min={0}
              max={max}
            />
            <span className="text-xs text-[var(--ui-text-muted)] shrink-0">px</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ElementStyleEditor() {
  const [selectedElement, setSelectedElement] = useState<EditableElement>('page');
  const [showAll, setShowAll] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const content = useTabsStore((state) => state.getActiveTab()?.content ?? '');
  const elementStyles = useStyleStore((state) => state.elementStyles);
  const customFonts = useStyleStore((state) => state.customFonts);
  const globalStyles = useStyleStore((state) => state.globalStyles);
  const updateElementStyle = useStyleStore((state) => state.updateElementStyle);
  const resetElementStyle = useStyleStore((state) => state.resetElementStyle);
  const updateGlobalStyles = useStyleStore((state) => state.updateGlobalStyles);
  const setSpacingHighlight = useUIStore((state) => state.setSpacingHighlight);

  const usedElements = useMemo(() => detectUsedElements(content), [content]);

  const visibleElements = showAll
    ? ELEMENTS
    : ELEMENTS.filter((e) => usedElements.has(e.key));

  const hasHiddenElements = usedElements.size < ELEMENTS.length;

  const currentStyle = elementStyles[selectedElement] || {};

  const fontOptions = [
    ...FONT_OPTIONS,
    ...customFonts.map((f) => ({ value: f.name, label: f.name })),
  ];

  const handleStyleChange = (style: Partial<ElementStyle>) => {
    updateElementStyle(selectedElement, style);
  };

  const handleSubElementStyleChange = (element: EditableElement, style: Partial<ElementStyle>) => {
    updateElementStyle(element, style);
  };

  const handleReset = useCallback(() => {
    if (confirmReset) {
      resetElementStyle(selectedElement);
      setConfirmReset(false);
      const label = ELEMENTS.find((e) => e.key === selectedElement)?.label;
      showToast(`${label} style has been reset.`, 'info');
    } else {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 3000);
    }
  }, [confirmReset, resetElementStyle, selectedElement]);

  const isNonTypographyElement = (['hr', 'image', 'table'] as EditableElement[]).includes(selectedElement);
  const isTextElement = (['paragraph', 'bulletList', 'orderedList', 'todoList', 'todoChecked', 'blockquote'] as EditableElement[]).includes(selectedElement);
  const isHeadingElement = (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as EditableElement[]).includes(selectedElement);
  const isTableElement = selectedElement === 'table';

  return (
    <div className="flex flex-col gap-3">
      {/* Element selector */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between border-b border-[var(--ui-border)] pb-2">
          <label className="text-sm font-medium">Element</label>
          {hasHiddenElements && (
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={showAll}
                onChange={(e) => setShowAll(e.target.checked)}
                className="accent-[var(--printmd-link-color)]"
              />
              <span className="text-xs text-[var(--ui-text-muted)]">Show all</span>
            </label>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {visibleElements.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => { setSelectedElement(key); setConfirmReset(false); }}
              className={`rounded-md px-3 py-1.5 text-sm ${
                selectedElement === key
                  ? 'bg-[var(--foreground)] text-[var(--background)]'
                  : 'border border-[var(--ui-border)] hover:bg-[var(--ui-bg-hover)]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Style controls */}
      <div className="flex flex-col gap-3 border-t border-[var(--ui-border)] pt-3">
        <h3 className="text-sm font-medium">
          {ELEMENTS.find((e) => e.key === selectedElement)?.label}
        </h3>

        {selectedElement === 'page' ? (
          <>
            <Section title="Background">
              <ColorPicker
                label="Background"
                value={currentStyle.backgroundColor || '#ffffff'}
                onChange={(backgroundColor) => handleStyleChange({ backgroundColor })}
              />
            </Section>

            <Section title="Padding">
              <SpacingGrid
                values={globalStyles.padding}
                onChange={(field, value) =>
                  updateGlobalStyles({ padding: { ...globalStyles.padding, [field]: value ?? 0 } })
                }
                onFieldFocus={(field) => setSpacingHighlight({ element: 'page', type: 'padding', side: field as 'top' | 'bottom' | 'left' | 'right' })}
                onFieldBlur={() => setSpacingHighlight(null)}
              />
            </Section>

            <Section title="Typography">
              <ColorPicker
                label="Text Color"
                value={globalStyles.textColor}
                onChange={(textColor) => updateGlobalStyles({ textColor })}
              />

              <div className="flex flex-col gap-1">
                <label className="text-sm text-[var(--ui-text-muted)]">Font</label>
                <select
                  value={globalStyles.fontFamily}
                  onChange={(e) => updateGlobalStyles({ fontFamily: e.target.value })}
                  className="rounded border border-[var(--ui-border)] bg-transparent px-2 py-1.5 text-sm"
                >
                  {fontOptions.filter((f) => f.value !== '').map((font) => (
                    <option key={font.value} value={font.value}>
                      {font.label}
                    </option>
                  ))}
                </select>
              </div>

              <Slider
                label="Font Size"
                value={globalStyles.fontSize}
                onChange={(fontSize) => updateGlobalStyles({ fontSize })}
                min={12}
                max={24}
                unit="px"
              />

              <Slider
                label="Line Height"
                value={globalStyles.lineHeight}
                onChange={(lineHeight) => updateGlobalStyles({ lineHeight })}
                min={1.2}
                max={2.5}
                step={0.1}
              />
            </Section>

            <Section title="Layout">
              <Slider
                label="Max Width"
                value={globalStyles.maxWidth}
                onChange={(maxWidth) => updateGlobalStyles({ maxWidth })}
                min={500}
                max={1200}
                step={50}
                unit="px"
              />
            </Section>

            <Section title="Colors">
              <ColorPicker
                label="Link"
                value={globalStyles.linkColor}
                onChange={(linkColor) => updateGlobalStyles({ linkColor })}
              />
              <ColorPicker
                label="Code BG"
                value={globalStyles.codeBackground}
                onChange={(codeBackground) => updateGlobalStyles({ codeBackground })}
              />
            </Section>
          </>
        ) : (
          <>
            {/* Typography */}
            {!isNonTypographyElement && (
              <Section title="Typography">
                <ColorPicker
                  label="Color"
                  value={currentStyle.color || '#000000'}
                  onChange={(color) => handleStyleChange({ color })}
                />

                <div className="flex flex-col gap-1">
                  <label className="text-sm text-[var(--ui-text-muted)]">Font</label>
                  <select
                    value={currentStyle.fontFamily || ''}
                    onChange={(e) => handleStyleChange({ fontFamily: e.target.value || undefined })}
                    className="rounded border border-[var(--ui-border)] bg-transparent px-2 py-1.5 text-sm"
                  >
                    {fontOptions.map((font) => (
                      <option key={font.value} value={font.value}>
                        {font.label}
                      </option>
                    ))}
                  </select>
                </div>

                <Slider
                  label="Font Size"
                  value={currentStyle.fontSize || 16}
                  onChange={(fontSize) => handleStyleChange({ fontSize })}
                  min={8}
                  max={72}
                  unit="px"
                />

                <div className="flex flex-col gap-1">
                  <label className="text-sm text-[var(--ui-text-muted)]">Font Weight</label>
                  <select
                    value={currentStyle.fontWeight || ''}
                    onChange={(e) => handleStyleChange({ fontWeight: e.target.value || undefined })}
                    className="rounded border border-[var(--ui-border)] bg-transparent px-2 py-1.5 text-sm"
                  >
                    {FONT_WEIGHT_OPTIONS.map((fw) => (
                      <option key={fw.value} value={fw.value}>
                        {fw.label}
                      </option>
                    ))}
                  </select>
                </div>
              </Section>
            )}

            {/* Background */}
            {selectedElement !== 'image' && (
              <Section title="Background">
                <ColorPicker
                  label={selectedElement === 'hr' ? 'Line Color' : 'Background'}
                  value={currentStyle.backgroundColor || '#ffffff'}
                  onChange={(backgroundColor) => handleStyleChange({ backgroundColor })}
                />
              </Section>
            )}

            {/* Image-specific controls */}
            {selectedElement === 'image' && (
              <>
                <Section title="Size">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-[var(--ui-text-muted)]">Width</label>
                    <select
                      value={currentStyle.imageWidth || ''}
                      onChange={(e) => handleStyleChange({ imageWidth: (e.target.value || undefined) as 'auto' | '100%' | undefined })}
                      className="rounded border border-[var(--ui-border)] bg-transparent px-2 py-1.5 text-sm"
                    >
                      <option value="">Default (max 100%)</option>
                      <option value="auto">Original Size</option>
                      <option value="100%">Full Width (100%)</option>
                    </select>
                  </div>
                </Section>

                <Section title="Border" defaultOpen={false}>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-[var(--ui-text-muted)]">Style</label>
                      <select
                        value={currentStyle.borderStyle || ''}
                        onChange={(e) => handleStyleChange({ borderStyle: e.target.value || undefined })}
                        className="rounded border border-[var(--ui-border)] bg-transparent px-2 py-1.5 text-sm"
                      >
                        <option value="">None</option>
                        <option value="solid">Solid</option>
                        <option value="dashed">Dashed</option>
                        <option value="dotted">Dotted</option>
                      </select>
                    </div>

                    <Slider
                      label="Width"
                      value={currentStyle.borderWidth ?? 1}
                      onChange={(borderWidth) => handleStyleChange({ borderWidth })}
                      min={0}
                      max={10}
                      unit="px"
                    />

                    <ColorPicker
                      label="Color"
                      value={currentStyle.borderColor || '#d0d0d0'}
                      onChange={(borderColor) => handleStyleChange({ borderColor })}
                    />

                    <Slider
                      label="Radius"
                      value={currentStyle.borderRadius ?? 4}
                      onChange={(borderRadius) => handleStyleChange({ borderRadius })}
                      min={0}
                      max={50}
                      unit="px"
                    />
                  </div>
                </Section>
              </>
            )}

            {/* Margin */}
            <Section title="Margin">
              <SpacingGrid
                values={{ top: currentStyle.marginTop, bottom: currentStyle.marginBottom }}
                fields={[{ key: 'top', label: 'Top' }, { key: 'bottom', label: 'Bottom' }]}
                onChange={(field, value) => {
                  if (field === 'top') handleStyleChange({ marginTop: value });
                  if (field === 'bottom') handleStyleChange({ marginBottom: value });
                }}
                max={200}
                defaults={{ top: SPACING_DEFAULTS[selectedElement].marginTop, bottom: SPACING_DEFAULTS[selectedElement].marginBottom }}
                onFieldFocus={(field) => setSpacingHighlight({ element: selectedElement, type: 'margin', side: field as 'top' | 'bottom' })}
                onFieldBlur={() => setSpacingHighlight(null)}
              />
            </Section>

            {/* Table-specific controls */}
            {isTableElement && (() => {
              const thStyle = elementStyles['tableHeader'] || {};
              const tdStyle = elementStyles['tableCell'] || {};
              return (
                <>
                  <Section title="Header (th)">
                    <ColorPicker
                      label="Background"
                      value={thStyle.backgroundColor || 'rgba(0,0,0,0.06)'}
                      onChange={(backgroundColor) => handleSubElementStyleChange('tableHeader', { backgroundColor })}
                    />
                    <ColorPicker
                      label="Text Color"
                      value={thStyle.color || ''}
                      onChange={(color) => handleSubElementStyleChange('tableHeader', { color: color || undefined })}
                    />
                    <div className="flex flex-col gap-1">
                      <label className="text-sm text-[var(--ui-text-muted)]">Font Weight</label>
                      <select
                        value={thStyle.fontWeight || ''}
                        onChange={(e) => handleSubElementStyleChange('tableHeader', { fontWeight: e.target.value || undefined })}
                        className="rounded border border-[var(--ui-border)] bg-transparent px-2 py-1.5 text-sm"
                      >
                        {FONT_WEIGHT_OPTIONS.map((fw) => (
                          <option key={fw.value} value={fw.value}>{fw.label}</option>
                        ))}
                      </select>
                    </div>
                  </Section>

                  <Section title="Cell (td)">
                    <ColorPicker
                      label="Background"
                      value={tdStyle.backgroundColor || ''}
                      onChange={(backgroundColor) => handleSubElementStyleChange('tableCell', { backgroundColor: backgroundColor || undefined })}
                    />
                    <ColorPicker
                      label="Text Color"
                      value={tdStyle.color || ''}
                      onChange={(color) => handleSubElementStyleChange('tableCell', { color: color || undefined })}
                    />
                  </Section>

                  <Section title="Striped Rows">
                    {(() => {
                      const evenRowStyle = elementStyles['tableEvenRow'] || {};
                      const hasStripe = evenRowStyle.backgroundColor !== 'transparent';
                      return (
                        <div className="flex flex-col gap-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={hasStripe}
                              onChange={(e) => {
                                handleSubElementStyleChange('tableEvenRow', {
                                  backgroundColor: e.target.checked ? 'rgba(0,0,0,0.03)' : 'transparent',
                                });
                              }}
                              className="accent-[var(--printmd-link-color)]"
                            />
                            <span className="text-sm">Enable alternating row color</span>
                          </label>
                          {hasStripe && (
                            <ColorPicker
                              label="Even Row Color"
                              value={evenRowStyle.backgroundColor || 'rgba(0,0,0,0.03)'}
                              onChange={(backgroundColor) => handleSubElementStyleChange('tableEvenRow', { backgroundColor })}
                            />
                          )}
                        </div>
                      );
                    })()}
                  </Section>

                  <Section title="Border">
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-[var(--ui-text-muted)]">Style</label>
                        <div className="flex gap-1" role="radiogroup">
                          {[
                            { value: 'solid', label: 'Solid' },
                            { value: 'dashed', label: 'Dashed' },
                            { value: 'dotted', label: 'Dotted' },
                            { value: 'none', label: 'None' },
                          ].map((opt) => {
                            const active = (thStyle.borderStyle || 'solid') === opt.value;
                            return (
                              <button
                                key={opt.value}
                                type="button"
                                role="radio"
                                aria-checked={active}
                                onClick={() => {
                                  const v = opt.value || undefined;
                                  handleSubElementStyleChange('tableHeader', { borderStyle: v });
                                  handleSubElementStyleChange('tableCell', { borderStyle: v });
                                }}
                                className={`flex-1 rounded border px-2 py-1.5 text-xs transition-colors ${
                                  active
                                    ? 'border-[var(--printmd-link-color)] bg-[var(--ui-bg-hover)] font-medium'
                                    : 'border-[var(--ui-border)] hover:bg-[var(--ui-bg-hover)]'
                                }`}
                              >
                                {opt.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {thStyle.borderStyle !== 'none' && (
                        <Slider
                          label="Width"
                          value={thStyle.borderWidth ?? 1}
                          onChange={(borderWidth) => {
                            handleSubElementStyleChange('tableHeader', { borderWidth });
                            handleSubElementStyleChange('tableCell', { borderWidth });
                          }}
                          min={0}
                          max={5}
                          unit="px"
                        />
                      )}

                      <ColorPicker
                        label="Color"
                        value={thStyle.borderColor || 'rgba(0,0,0,0.20)'}
                        onChange={(borderColor) => {
                          handleSubElementStyleChange('tableHeader', { borderColor });
                          handleSubElementStyleChange('tableCell', { borderColor });
                        }}
                      />
                    </div>
                  </Section>
                </>
              );
            })()}

            {/* Padding */}
            {!isNonTypographyElement && (
              <Section title="Padding">
                <SpacingGrid
                  values={{
                    top: currentStyle.paddingTop,
                    bottom: currentStyle.paddingBottom,
                    left: currentStyle.paddingLeft,
                    right: currentStyle.paddingRight,
                  }}
                  onChange={(field, value) => {
                    const map: Record<string, string> = { top: 'paddingTop', bottom: 'paddingBottom', left: 'paddingLeft', right: 'paddingRight' };
                    handleStyleChange({ [map[field]]: value });
                  }}
                  defaults={{
                    top: SPACING_DEFAULTS[selectedElement].paddingTop,
                    bottom: SPACING_DEFAULTS[selectedElement].paddingBottom,
                    left: SPACING_DEFAULTS[selectedElement].paddingLeft,
                    right: SPACING_DEFAULTS[selectedElement].paddingRight,
                  }}
                  onFieldFocus={(field) => setSpacingHighlight({ element: selectedElement, type: 'padding', side: field as 'top' | 'bottom' | 'left' | 'right' })}
                  onFieldBlur={() => setSpacingHighlight(null)}
                />
              </Section>
            )}

            {/* Text indent */}
            {isTextElement && (
              <Section title="Indent" defaultOpen={false}>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={currentStyle.textIndent ?? ''}
                    onChange={(e) => handleStyleChange({ textIndent: e.target.value ? Number(e.target.value) : undefined })}
                    placeholder="0"
                    className="w-full rounded border border-[var(--ui-border)] bg-transparent px-2 py-1.5 text-sm"
                    min={0}
                    max={100}
                  />
                  <span className="text-xs text-[var(--ui-text-muted)] shrink-0">px</span>
                </div>
              </Section>
            )}

            {/* Code Block */}
            {selectedElement === 'code' && (
              <>
                <Section title="Code Style">
                  <Slider
                    label="Line Height"
                    value={currentStyle.lineHeight ?? 1.5}
                    onChange={(lineHeight) => handleStyleChange({ lineHeight })}
                    min={1.0}
                    max={2.5}
                    step={0.1}
                  />
                </Section>

                <Section title="Border" defaultOpen={false}>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-[var(--ui-text-muted)]">Style</label>
                      <select
                        value={currentStyle.borderStyle || ''}
                        onChange={(e) => handleStyleChange({ borderStyle: e.target.value || undefined })}
                        className="rounded border border-[var(--ui-border)] bg-transparent px-2 py-1.5 text-sm"
                      >
                        <option value="">None</option>
                        <option value="solid">Solid</option>
                        <option value="dashed">Dashed</option>
                        <option value="dotted">Dotted</option>
                      </select>
                    </div>

                    <Slider
                      label="Width"
                      value={currentStyle.borderWidth ?? 1}
                      onChange={(borderWidth) => handleStyleChange({ borderWidth })}
                      min={0}
                      max={5}
                      unit="px"
                    />

                    <ColorPicker
                      label="Color"
                      value={currentStyle.borderColor || '#d0d0d0'}
                      onChange={(borderColor) => handleStyleChange({ borderColor })}
                    />

                    <Slider
                      label="Radius"
                      value={currentStyle.borderRadius ?? 6}
                      onChange={(borderRadius) => handleStyleChange({ borderRadius })}
                      min={0}
                      max={24}
                      unit="px"
                    />
                  </div>
                </Section>
              </>
            )}

            {/* Border Bottom */}
            {isHeadingElement && (
              <Section title="Border Bottom" defaultOpen={false}>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-[var(--ui-text-muted)]">Style</label>
                    <select
                      value={currentStyle.borderBottomStyle || ''}
                      onChange={(e) => handleStyleChange({ borderBottomStyle: e.target.value || undefined })}
                      className="rounded border border-[var(--ui-border)] bg-transparent px-2 py-1.5 text-sm"
                    >
                      <option value="">Default</option>
                      <option value="none">None</option>
                      <option value="solid">Solid</option>
                      <option value="dashed">Dashed</option>
                      <option value="dotted">Dotted</option>
                      <option value="double">Double</option>
                    </select>
                  </div>

                  <Slider
                    label="Width"
                    value={currentStyle.borderBottomWidth ?? 1}
                    onChange={(borderBottomWidth) => handleStyleChange({ borderBottomWidth })}
                    min={0}
                    max={10}
                    unit="px"
                  />

                  <ColorPicker
                    label="Color"
                    value={currentStyle.borderBottomColor || 'rgba(0,0,0,0.15)'}
                    onChange={(borderBottomColor) => handleStyleChange({ borderBottomColor })}
                  />
                </div>
              </Section>
            )}
          </>
        )}

        {/* Reset button */}
        <button
          onClick={handleReset}
          className={`mt-2 rounded border px-3 py-2 text-sm ${
            confirmReset
              ? 'border-red-300 bg-red-50 text-red-600 hover:bg-red-100'
              : 'border-[var(--ui-border)] hover:bg-[var(--ui-bg-hover)]'
          }`}
        >
          {confirmReset
            ? `Reset ${ELEMENTS.find((e) => e.key === selectedElement)?.label}? Click again`
            : `Reset ${ELEMENTS.find((e) => e.key === selectedElement)?.label}`
          }
        </button>
      </div>
    </div>
  );
}

export default ElementStyleEditor;
