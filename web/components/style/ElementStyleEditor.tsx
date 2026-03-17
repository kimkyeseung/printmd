'use client';

import { useState, useMemo } from 'react';
import { ColorPicker } from './ColorPicker';
import { Slider } from './Slider';
import { useStyleStore, useEditorStore } from '@/stores';
import type { EditableElement, ElementStyle } from '@/types/style';

const FONT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'system-ui, -apple-system, sans-serif', label: 'System (Sans)' },
  { value: '"Noto Sans KR", system-ui, sans-serif', label: 'Noto Sans KR' },
  { value: 'Georgia, "Times New Roman", serif', label: 'Georgia (Serif)' },
  { value: '"Nanum Gothic", sans-serif', label: 'Nanum Gothic' },
  { value: '"Nanum Myeongjo", serif', label: 'Nanum Myeongjo' },
  { value: 'ui-monospace, SFMono-Regular, monospace', label: 'Monospace' },
];

const FONT_WEIGHT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: '300', label: 'Light' },
  { value: '400', label: 'Normal' },
  { value: '500', label: 'Medium' },
  { value: '600', label: 'Semi Bold' },
  { value: '700', label: 'Bold' },
  { value: '800', label: 'Extra Bold' },
];

const ELEMENTS: { key: EditableElement; label: string }[] = [
  { key: 'page', label: '페이지' },
  { key: 'h1', label: '제목 1' },
  { key: 'h2', label: '제목 2' },
  { key: 'h3', label: '제목 3' },
  { key: 'h4', label: '제목 4' },
  { key: 'h5', label: '제목 5' },
  { key: 'h6', label: '제목 6' },
  { key: 'paragraph', label: '텍스트' },
  { key: 'bulletList', label: '글머리 기호 목록' },
  { key: 'orderedList', label: '번호 매기기 목록' },
  { key: 'todoList', label: '할 일 목록' },
  { key: 'blockquote', label: '인용' },
  { key: 'hr', label: '구분선' },
  { key: 'image', label: '이미지' },
  { key: 'code', label: '코드' },
  { key: 'table', label: '표' },
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
  if (/^>/m.test(markdown)) used.add('blockquote');
  if (/^---/m.test(markdown) || /^\*\*\*/m.test(markdown)) used.add('hr');
  if (/!\[.*\]\(.*\)/m.test(markdown)) used.add('image');
  if (/```/m.test(markdown) || /`[^`]+`/.test(markdown)) used.add('code');
  if (/^\|.*\|/m.test(markdown)) used.add('table');
  return used;
}

export function ElementStyleEditor() {
  const [selectedElement, setSelectedElement] = useState<EditableElement>('page');
  const [showAll, setShowAll] = useState(false);

  const content = useEditorStore((state) => state.content);
  const elementStyles = useStyleStore((state) => state.elementStyles);
  const customFonts = useStyleStore((state) => state.customFonts);
  const globalStyles = useStyleStore((state) => state.globalStyles);
  const updateElementStyle = useStyleStore((state) => state.updateElementStyle);
  const resetElementStyle = useStyleStore((state) => state.resetElementStyle);
  const updateGlobalStyles = useStyleStore((state) => state.updateGlobalStyles);

  const usedElements = useMemo(() => detectUsedElements(content), [content]);

  const visibleElements = showAll
    ? ELEMENTS
    : ELEMENTS.filter((e) => usedElements.has(e.key));

  const currentStyle = elementStyles[selectedElement] || {};

  const fontOptions = [
    ...FONT_OPTIONS,
    ...customFonts.map((f) => ({ value: f.name, label: f.name })),
  ];

  const handleStyleChange = (style: Partial<ElementStyle>) => {
    updateElementStyle(selectedElement, style);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Element list */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between border-b border-[var(--ui-border)] pb-2">
          <label className="text-sm font-medium">요소 선택</label>
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              checked={showAll}
              onChange={(e) => setShowAll(e.target.checked)}
              className="accent-[var(--printmd-link-color)]"
            />
            <span className="text-xs text-[var(--ui-text-muted)]">전체 보기</span>
          </label>
        </div>
        <div className="flex flex-wrap gap-1">
          {visibleElements.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setSelectedElement(key)}
              className={`rounded px-2 py-1 text-xs ${
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

      {/* Style form */}
      <div className="flex flex-col gap-3 border-t border-[var(--ui-border)] pt-3">
        <h3 className="text-sm font-medium">
          {ELEMENTS.find((e) => e.key === selectedElement)?.label} 스타일
        </h3>

        {/* Typography */}
        <div className="flex flex-col gap-2">
          <ColorPicker
            label="색상"
            value={currentStyle.color || '#000000'}
            onChange={(color) => handleStyleChange({ color })}
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm text-[var(--ui-text-muted)]">폰트</label>
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
            label="폰트 크기"
            value={currentStyle.fontSize || 16}
            onChange={(fontSize) => handleStyleChange({ fontSize })}
            min={8}
            max={72}
            unit="px"
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm text-[var(--ui-text-muted)]">폰트 굵기</label>
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

          <ColorPicker
            label="배경색"
            value={currentStyle.backgroundColor || '#ffffff'}
            onChange={(backgroundColor) => handleStyleChange({ backgroundColor })}
          />
        </div>

        {/* Spacing */}
        <div className="flex flex-col gap-2">
          <h4 className="text-xs font-medium text-[var(--ui-text-muted)] uppercase">여백</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[var(--ui-text-muted)]">상단 여백</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={currentStyle.marginTop ?? ''}
                  onChange={(e) => handleStyleChange({ marginTop: e.target.value ? Number(e.target.value) : undefined })}
                  placeholder="auto"
                  className="w-full rounded border border-[var(--ui-border)] bg-transparent px-2 py-1 text-sm"
                  min={0}
                  max={200}
                />
                <span className="text-xs text-[var(--ui-text-muted)] shrink-0">px</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[var(--ui-text-muted)]">하단 여백</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={currentStyle.marginBottom ?? ''}
                  onChange={(e) => handleStyleChange({ marginBottom: e.target.value ? Number(e.target.value) : undefined })}
                  placeholder="auto"
                  className="w-full rounded border border-[var(--ui-border)] bg-transparent px-2 py-1 text-sm"
                  min={0}
                  max={200}
                />
                <span className="text-xs text-[var(--ui-text-muted)] shrink-0">px</span>
              </div>
            </div>
          </div>
        </div>

        {/* Padding */}
        <div className="flex flex-col gap-2">
          <h4 className="text-xs font-medium text-[var(--ui-text-muted)] uppercase">패딩</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[var(--ui-text-muted)]">상</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={currentStyle.paddingTop ?? ''}
                  onChange={(e) => handleStyleChange({ paddingTop: e.target.value ? Number(e.target.value) : undefined })}
                  placeholder="auto"
                  className="w-full rounded border border-[var(--ui-border)] bg-transparent px-2 py-1 text-sm"
                  min={0}
                  max={100}
                />
                <span className="text-xs text-[var(--ui-text-muted)] shrink-0">px</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[var(--ui-text-muted)]">하</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={currentStyle.paddingBottom ?? ''}
                  onChange={(e) => handleStyleChange({ paddingBottom: e.target.value ? Number(e.target.value) : undefined })}
                  placeholder="auto"
                  className="w-full rounded border border-[var(--ui-border)] bg-transparent px-2 py-1 text-sm"
                  min={0}
                  max={100}
                />
                <span className="text-xs text-[var(--ui-text-muted)] shrink-0">px</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[var(--ui-text-muted)]">좌</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={currentStyle.paddingLeft ?? ''}
                  onChange={(e) => handleStyleChange({ paddingLeft: e.target.value ? Number(e.target.value) : undefined })}
                  placeholder="auto"
                  className="w-full rounded border border-[var(--ui-border)] bg-transparent px-2 py-1 text-sm"
                  min={0}
                  max={100}
                />
                <span className="text-xs text-[var(--ui-text-muted)] shrink-0">px</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[var(--ui-text-muted)]">우</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={currentStyle.paddingRight ?? ''}
                  onChange={(e) => handleStyleChange({ paddingRight: e.target.value ? Number(e.target.value) : undefined })}
                  placeholder="auto"
                  className="w-full rounded border border-[var(--ui-border)] bg-transparent px-2 py-1 text-sm"
                  min={0}
                  max={100}
                />
                <span className="text-xs text-[var(--ui-text-muted)] shrink-0">px</span>
              </div>
            </div>
          </div>
        </div>

        {/* Text indent */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-[var(--ui-text-muted)]">들여쓰기</label>
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={currentStyle.textIndent ?? ''}
              onChange={(e) => handleStyleChange({ textIndent: e.target.value ? Number(e.target.value) : undefined })}
              placeholder="0"
              className="w-full rounded border border-[var(--ui-border)] bg-transparent px-2 py-1 text-sm"
              min={0}
              max={100}
            />
            <span className="text-xs text-[var(--ui-text-muted)] shrink-0">px</span>
          </div>
        </div>

        {/* Page-specific: GlobalStyles fields */}
        {selectedElement === 'page' && (
          <div className="flex flex-col gap-2 border-t border-[var(--ui-border)] pt-3">
            <h4 className="text-xs font-medium text-[var(--ui-text-muted)] uppercase">페이지 전역 설정</h4>
            <Slider
              label="최대 너비"
              value={globalStyles.maxWidth}
              onChange={(maxWidth) => updateGlobalStyles({ maxWidth })}
              min={500}
              max={1200}
              step={50}
              unit="px"
            />
            <Slider
              label="줄 높이"
              value={globalStyles.lineHeight}
              onChange={(lineHeight) => updateGlobalStyles({ lineHeight })}
              min={1.2}
              max={2.5}
              step={0.1}
            />
            <ColorPicker
              label="링크 색상"
              value={globalStyles.linkColor}
              onChange={(linkColor) => updateGlobalStyles({ linkColor })}
            />
            <ColorPicker
              label="코드 배경"
              value={globalStyles.codeBackground}
              onChange={(codeBackground) => updateGlobalStyles({ codeBackground })}
            />
          </div>
        )}

        {/* Reset button */}
        <button
          onClick={() => resetElementStyle(selectedElement)}
          className="mt-2 rounded border border-[var(--ui-border)] px-3 py-1.5 text-xs hover:bg-[var(--ui-bg-hover)]"
        >
          {ELEMENTS.find((e) => e.key === selectedElement)?.label} 스타일 초기화
        </button>
      </div>
    </div>
  );
}

export default ElementStyleEditor;
