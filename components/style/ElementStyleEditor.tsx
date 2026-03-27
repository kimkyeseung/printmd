'use client';

import { useState, useMemo, useCallback } from 'react';
import { ColorPicker } from './ColorPicker';
import { Slider } from './Slider';
import { useStyleStore, useTabsStore, useUIStore } from '@/stores';
import { FONT_OPTIONS_WITH_DEFAULT as FONT_OPTIONS } from '@/lib/fonts/constants';
import { showToast } from '@/components/ui/Toast';
import type { EditableElement, ElementStyle } from '@/types/style';
import { SPACING_DEFAULTS } from '@/lib/styles/spacingDefaults';
import { useClientDictionary } from '@/hooks/useClientLocale';

const ELEMENT_KEYS: EditableElement[] = [
  'page', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'paragraph', 'bulletList', 'orderedList', 'todoList', 'todoChecked',
  'blockquote', 'hr', 'image', 'code', 'table',
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
  labels,
}: {
  values: { top?: number; bottom?: number; left?: number; right?: number };
  onChange: (field: string, value: number | undefined) => void;
  max?: number;
  fields?: readonly { key: 'top' | 'bottom' | 'left' | 'right'; label: string }[];
  onFieldFocus?: (field: string) => void;
  onFieldBlur?: () => void;
  defaults?: { top?: number; bottom?: number; left?: number; right?: number };
  labels?: { top: string; bottom: string; left: string; right: string };
}) {
  const fields = fieldOverride ?? [
    { key: 'top', label: labels?.top ?? 'Top' },
    { key: 'bottom', label: labels?.bottom ?? 'Bottom' },
    { key: 'left', label: labels?.left ?? 'Left' },
    { key: 'right', label: labels?.right ?? 'Right' },
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
  const t = useClientDictionary().stylePanel;

  const content = useTabsStore((state) => state.getActiveTab()?.content ?? '');
  const elementStyles = useStyleStore((state) => state.elementStyles);
  const customFonts = useStyleStore((state) => state.customFonts);
  const globalStyles = useStyleStore((state) => state.globalStyles);
  const updateElementStyle = useStyleStore((state) => state.updateElementStyle);
  const resetElementStyle = useStyleStore((state) => state.resetElementStyle);
  const updateGlobalStyles = useStyleStore((state) => state.updateGlobalStyles);
  const setSpacingHighlight = useUIStore((state) => state.setSpacingHighlight);

  const usedElements = useMemo(() => detectUsedElements(content), [content]);

  const elementLabels = t.elements as Record<EditableElement, string>;

  const elements = ELEMENT_KEYS.map((key) => ({ key, label: elementLabels[key] ?? key }));

  const visibleElements = showAll
    ? elements
    : elements.filter((e) => usedElements.has(e.key));

  const hasHiddenElements = usedElements.size < elements.length;

  const currentStyle = elementStyles[selectedElement] || {};

  const fontWeightOptions = [
    { value: '', label: t.fontWeights.default },
    { value: '300', label: t.fontWeights.light },
    { value: '400', label: t.fontWeights.normal },
    { value: '500', label: t.fontWeights.medium },
    { value: '600', label: t.fontWeights.semiBold },
    { value: '700', label: t.fontWeights.bold },
    { value: '800', label: t.fontWeights.extraBold },
  ];

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

  const selectedLabel = elements.find((e) => e.key === selectedElement)?.label ?? '';

  const handleReset = useCallback(() => {
    if (confirmReset) {
      resetElementStyle(selectedElement);
      setConfirmReset(false);
      showToast(t.elementResetComplete.replace('{{label}}', selectedLabel), 'info');
    } else {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 3000);
    }
  }, [confirmReset, resetElementStyle, selectedElement, selectedLabel, t]);

  const isNonTypographyElement = (['hr', 'image', 'table'] as EditableElement[]).includes(selectedElement);
  const isTextElement = (['paragraph', 'bulletList', 'orderedList', 'todoList', 'todoChecked', 'blockquote'] as EditableElement[]).includes(selectedElement);
  const isHeadingElement = (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as EditableElement[]).includes(selectedElement);
  const isTableElement = selectedElement === 'table';

  const spacingLabels = { top: t.top, bottom: t.bottom, left: t.left, right: t.right };

  return (
    <div className="flex flex-col gap-3">
      {/* Element selector */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between border-b border-[var(--ui-border)] pb-2">
          <label className="text-sm font-medium">{t.element}</label>
          {hasHiddenElements && (
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={showAll}
                onChange={(e) => setShowAll(e.target.checked)}
                className="accent-[var(--printmd-link-color)]"
              />
              <span className="text-xs text-[var(--ui-text-muted)]">{t.showAll}</span>
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
          {selectedLabel}
        </h3>

        {selectedElement === 'page' ? (
          <>
            <Section title={t.background}>
              <ColorPicker
                label={t.background}
                value={currentStyle.backgroundColor || '#ffffff'}
                onChange={(backgroundColor) => handleStyleChange({ backgroundColor })}
              />
            </Section>

            <Section title={t.padding}>
              <SpacingGrid
                values={globalStyles.padding}
                onChange={(field, value) =>
                  updateGlobalStyles({ padding: { ...globalStyles.padding, [field]: value ?? 0 } })
                }
                labels={spacingLabels}
                onFieldFocus={(field) => setSpacingHighlight({ element: 'page', type: 'padding', side: field as 'top' | 'bottom' | 'left' | 'right' })}
                onFieldBlur={() => setSpacingHighlight(null)}
              />
            </Section>

            <Section title={t.typography}>
              <ColorPicker
                label={t.textColor}
                value={globalStyles.textColor}
                onChange={(textColor) => updateGlobalStyles({ textColor })}
              />

              <div className="flex flex-col gap-1">
                <label className="text-sm text-[var(--ui-text-muted)]">{t.font}</label>
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
                label={t.fontSize}
                value={globalStyles.fontSize}
                onChange={(fontSize) => updateGlobalStyles({ fontSize })}
                min={12}
                max={24}
                unit="px"
              />

              <Slider
                label={t.lineHeight}
                value={globalStyles.lineHeight}
                onChange={(lineHeight) => updateGlobalStyles({ lineHeight })}
                min={1.2}
                max={2.5}
                step={0.1}
              />
            </Section>

            <Section title={t.layout}>
              <Slider
                label={t.maxWidth}
                value={globalStyles.maxWidth}
                onChange={(maxWidth) => updateGlobalStyles({ maxWidth })}
                min={500}
                max={1200}
                step={50}
                unit="px"
              />
            </Section>

            <Section title={t.colors}>
              <ColorPicker
                label={t.link}
                value={globalStyles.linkColor}
                onChange={(linkColor) => updateGlobalStyles({ linkColor })}
              />
              <ColorPicker
                label={t.codeBg}
                value={globalStyles.codeBackground}
                onChange={(codeBackground) => updateGlobalStyles({ codeBackground })}
              />
            </Section>
          </>
        ) : (
          <>
            {/* Typography */}
            {!isNonTypographyElement && (
              <Section title={t.typography}>
                <ColorPicker
                  label={t.color}
                  value={currentStyle.color || '#000000'}
                  onChange={(color) => handleStyleChange({ color })}
                />

                <div className="flex flex-col gap-1">
                  <label className="text-sm text-[var(--ui-text-muted)]">{t.font}</label>
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
                  label={t.fontSize}
                  value={currentStyle.fontSize || 16}
                  onChange={(fontSize) => handleStyleChange({ fontSize })}
                  min={8}
                  max={72}
                  unit="px"
                />

                <div className="flex flex-col gap-1">
                  <label className="text-sm text-[var(--ui-text-muted)]">{t.fontWeight}</label>
                  <select
                    value={currentStyle.fontWeight || ''}
                    onChange={(e) => handleStyleChange({ fontWeight: e.target.value || undefined })}
                    className="rounded border border-[var(--ui-border)] bg-transparent px-2 py-1.5 text-sm"
                  >
                    {fontWeightOptions.map((fw) => (
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
              <Section title={t.background}>
                <ColorPicker
                  label={selectedElement === 'hr' ? t.lineColor : t.background}
                  value={currentStyle.backgroundColor || '#ffffff'}
                  onChange={(backgroundColor) => handleStyleChange({ backgroundColor })}
                />
              </Section>
            )}

            {/* Image-specific controls */}
            {selectedElement === 'image' && (
              <>
                <Section title={t.size}>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-[var(--ui-text-muted)]">{t.width}</label>
                    <select
                      value={currentStyle.imageWidth || ''}
                      onChange={(e) => handleStyleChange({ imageWidth: (e.target.value || undefined) as 'auto' | '100%' | undefined })}
                      className="rounded border border-[var(--ui-border)] bg-transparent px-2 py-1.5 text-sm"
                    >
                      <option value="">{t.imageWidth.default}</option>
                      <option value="auto">{t.imageWidth.auto}</option>
                      <option value="100%">{t.imageWidth.full}</option>
                    </select>
                  </div>
                </Section>

                <Section title={t.border} defaultOpen={false}>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-[var(--ui-text-muted)]">{t.borderStyle}</label>
                      <select
                        value={currentStyle.borderStyle || ''}
                        onChange={(e) => handleStyleChange({ borderStyle: e.target.value || undefined })}
                        className="rounded border border-[var(--ui-border)] bg-transparent px-2 py-1.5 text-sm"
                      >
                        <option value="">{t.borderStyles.none}</option>
                        <option value="solid">{t.borderStyles.solid}</option>
                        <option value="dashed">{t.borderStyles.dashed}</option>
                        <option value="dotted">{t.borderStyles.dotted}</option>
                      </select>
                    </div>

                    <Slider
                      label={t.borderWidth}
                      value={currentStyle.borderWidth ?? 1}
                      onChange={(borderWidth) => handleStyleChange({ borderWidth })}
                      min={0}
                      max={10}
                      unit="px"
                    />

                    <ColorPicker
                      label={t.borderColor}
                      value={currentStyle.borderColor || '#d0d0d0'}
                      onChange={(borderColor) => handleStyleChange({ borderColor })}
                    />

                    <Slider
                      label={t.borderRadius}
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
            <Section title={t.margin}>
              <SpacingGrid
                values={{ top: currentStyle.marginTop, bottom: currentStyle.marginBottom }}
                fields={[{ key: 'top', label: t.top }, { key: 'bottom', label: t.bottom }]}
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
                  <Section title={t.table.header}>
                    <ColorPicker
                      label={t.background}
                      value={thStyle.backgroundColor || 'rgba(0,0,0,0.06)'}
                      onChange={(backgroundColor) => handleSubElementStyleChange('tableHeader', { backgroundColor })}
                    />
                    <ColorPicker
                      label={t.textColor}
                      value={thStyle.color || ''}
                      onChange={(color) => handleSubElementStyleChange('tableHeader', { color: color || undefined })}
                    />
                    <div className="flex flex-col gap-1">
                      <label className="text-sm text-[var(--ui-text-muted)]">{t.fontWeight}</label>
                      <select
                        value={thStyle.fontWeight || ''}
                        onChange={(e) => handleSubElementStyleChange('tableHeader', { fontWeight: e.target.value || undefined })}
                        className="rounded border border-[var(--ui-border)] bg-transparent px-2 py-1.5 text-sm"
                      >
                        {fontWeightOptions.map((fw) => (
                          <option key={fw.value} value={fw.value}>{fw.label}</option>
                        ))}
                      </select>
                    </div>
                  </Section>

                  <Section title={t.table.cell}>
                    <ColorPicker
                      label={t.background}
                      value={tdStyle.backgroundColor || ''}
                      onChange={(backgroundColor) => handleSubElementStyleChange('tableCell', { backgroundColor: backgroundColor || undefined })}
                    />
                    <ColorPicker
                      label={t.textColor}
                      value={tdStyle.color || ''}
                      onChange={(color) => handleSubElementStyleChange('tableCell', { color: color || undefined })}
                    />
                  </Section>

                  <Section title={t.table.stripedRows}>
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
                            <span className="text-sm">{t.table.enableStriped}</span>
                          </label>
                          {hasStripe && (
                            <ColorPicker
                              label={t.table.evenRowColor}
                              value={evenRowStyle.backgroundColor || 'rgba(0,0,0,0.03)'}
                              onChange={(backgroundColor) => handleSubElementStyleChange('tableEvenRow', { backgroundColor })}
                            />
                          )}
                        </div>
                      );
                    })()}
                  </Section>

                  <Section title={t.border}>
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-[var(--ui-text-muted)]">{t.borderStyle}</label>
                        <div className="flex gap-1" role="radiogroup">
                          {[
                            { value: 'solid', label: t.borderStyles.solid },
                            { value: 'dashed', label: t.borderStyles.dashed },
                            { value: 'dotted', label: t.borderStyles.dotted },
                            { value: 'none', label: t.borderStyles.none },
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
                          label={t.borderWidth}
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
                        label={t.borderColor}
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
              <Section title={t.padding}>
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
                  labels={spacingLabels}
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
              <Section title={t.indent} defaultOpen={false}>
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
                <Section title={t.codeStyle}>
                  <Slider
                    label={t.lineHeight}
                    value={currentStyle.lineHeight ?? 1.5}
                    onChange={(lineHeight) => handleStyleChange({ lineHeight })}
                    min={1.0}
                    max={2.5}
                    step={0.1}
                  />
                </Section>

                <Section title={t.border} defaultOpen={false}>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-[var(--ui-text-muted)]">{t.borderStyle}</label>
                      <select
                        value={currentStyle.borderStyle || ''}
                        onChange={(e) => handleStyleChange({ borderStyle: e.target.value || undefined })}
                        className="rounded border border-[var(--ui-border)] bg-transparent px-2 py-1.5 text-sm"
                      >
                        <option value="">{t.borderStyles.none}</option>
                        <option value="solid">{t.borderStyles.solid}</option>
                        <option value="dashed">{t.borderStyles.dashed}</option>
                        <option value="dotted">{t.borderStyles.dotted}</option>
                      </select>
                    </div>

                    <Slider
                      label={t.borderWidth}
                      value={currentStyle.borderWidth ?? 1}
                      onChange={(borderWidth) => handleStyleChange({ borderWidth })}
                      min={0}
                      max={5}
                      unit="px"
                    />

                    <ColorPicker
                      label={t.borderColor}
                      value={currentStyle.borderColor || '#d0d0d0'}
                      onChange={(borderColor) => handleStyleChange({ borderColor })}
                    />

                    <Slider
                      label={t.borderRadius}
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
              <Section title={t.borderBottom} defaultOpen={false}>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-[var(--ui-text-muted)]">{t.borderStyle}</label>
                    <select
                      value={currentStyle.borderBottomStyle || ''}
                      onChange={(e) => handleStyleChange({ borderBottomStyle: e.target.value || undefined })}
                      className="rounded border border-[var(--ui-border)] bg-transparent px-2 py-1.5 text-sm"
                    >
                      <option value="">{t.borderStyles.default}</option>
                      <option value="none">{t.borderStyles.none}</option>
                      <option value="solid">{t.borderStyles.solid}</option>
                      <option value="dashed">{t.borderStyles.dashed}</option>
                      <option value="dotted">{t.borderStyles.dotted}</option>
                      <option value="double">{t.borderStyles.double}</option>
                    </select>
                  </div>

                  <Slider
                    label={t.borderWidth}
                    value={currentStyle.borderBottomWidth ?? 1}
                    onChange={(borderBottomWidth) => handleStyleChange({ borderBottomWidth })}
                    min={0}
                    max={10}
                    unit="px"
                  />

                  <ColorPicker
                    label={t.borderColor}
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
            ? t.resetElementConfirm.replace('{{label}}', selectedLabel)
            : t.resetElement.replace('{{label}}', selectedLabel)
          }
        </button>
      </div>
    </div>
  );
}

export default ElementStyleEditor;
