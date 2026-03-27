'use client';

import { useState, useCallback } from 'react';
import { useStyleStore } from '@/stores';
import { showToast } from '@/components/ui/Toast';
import type { GlobalStyles, EditableElement, ElementStyle } from '@/types/style';
import { COLOR_ROLES, getRoleColor, deriveColorRolesFromStyles } from '@/lib/themes/colorRoles';
import type { ColorRole } from '@/lib/themes/colorRoles';
import { useClientDictionary } from '@/hooks/useClientLocale';

export function ColorPresetEditor() {
  const t = useClientDictionary().stylePanel;
  const colorPresets = useStyleStore((state) => state.colorPresets);
  const addColorPreset = useStyleStore((state) => state.addColorPreset);
  const removeColorPreset = useStyleStore((state) => state.removeColorPreset);
  const updateColorPreset = useStyleStore((state) => state.updateColorPreset);
  const globalStyles = useStyleStore((state) => state.globalStyles);
  const elementStyles = useStyleStore((state) => state.elementStyles);
  const updateGlobalStyles = useStyleStore((state) => state.updateGlobalStyles);
  const updateElementStyle = useStyleStore((state) => state.updateElementStyle);

  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('#3b82f6');
  const [confirmDeleteName, setConfirmDeleteName] = useState<string | null>(null);

  const roleNameSet = new Set(COLOR_ROLES.map((r) => r.role));

  /** Apply a single role color change to the actual styles */
  const applyRoleColor = useCallback((role: ColorRole, color: string) => {
    if (role.source === 'global' && role.styleKey) {
      updateGlobalStyles({ [role.styleKey]: color } as Partial<GlobalStyles>);
    } else if (role.source === 'element' && role.elementKey && role.elementProp) {
      const key = role.elementKey as EditableElement;
      const update = { [role.elementProp]: color } as Partial<ElementStyle>;
      updateElementStyle(key, update);
      // For heading: apply to all h1–h6
      if (role.elementKey === 'h1') {
        (['h2', 'h3', 'h4', 'h5', 'h6'] as EditableElement[]).forEach((h) =>
          updateElementStyle(h, update)
        );
      }
    }
  }, [updateGlobalStyles, updateElementStyle]);

  /** Handle color role change — auto-init palette if empty */
  const handleRoleChange = useCallback((role: ColorRole, color: string) => {
    const hasAnyRole = colorPresets.some((p) => roleNameSet.has(p.name));

    if (!hasAnyRole) {
      const derived = deriveColorRolesFromStyles(globalStyles, elementStyles);
      derived.forEach((p) => {
        addColorPreset({ name: p.name, color: p.name === role.role ? color : p.color });
      });
    } else {
      const existing = colorPresets.find((p) => p.name === role.role);
      if (existing) {
        updateColorPreset(role.role, { color });
      } else {
        addColorPreset({ name: role.role, color });
      }
    }

    applyRoleColor(role, color);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- roleNameSet is stable
  }, [colorPresets, globalStyles, elementStyles, addColorPreset, updateColorPreset, applyRoleColor]);

  // Build role list with current values from styles (source of truth)
  const rolePresets = COLOR_ROLES.map((r) => ({
    ...r,
    currentColor: getRoleColor(r, globalStyles, elementStyles),
    preset: colorPresets.find((p) => p.name === r.role),
  }));

  const customPresets = colorPresets.filter((p) => !roleNameSet.has(p.name));

  const handleAdd = useCallback(() => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    if (colorPresets.some((p) => p.name === trimmed)) {
      showToast(t.colorToast.duplicateName, 'error');
      return;
    }
    addColorPreset({ name: trimmed, color: newColor });
    setNewName('');
    setNewColor('#3b82f6');
    setIsAdding(false);
    showToast(t.colorToast.added, 'success');
  }, [newName, newColor, colorPresets, addColorPreset, t]);

  const handleAddKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd();
    if (e.key === 'Escape') { setIsAdding(false); setNewName(''); }
  };

  const handleDelete = (name: string) => {
    if (confirmDeleteName === name) {
      removeColorPreset(name);
      setConfirmDeleteName(null);
      showToast(t.colorToast.removed, 'success');
    } else {
      setConfirmDeleteName(name);
      setTimeout(() => setConfirmDeleteName(null), 3000);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Color Roles */}
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-medium border-b border-[var(--ui-border)] pb-2">{t.colorRoles}</h3>
        <div className="flex flex-col gap-1.5">
          {rolePresets.map((rp) => (
            <div
              key={rp.role}
              className="flex items-center gap-2 rounded-lg border border-[var(--ui-border)] px-3 py-2"
            >
              <input
                type="color"
                value={rp.currentColor}
                onChange={(e) => handleRoleChange(rp, e.target.value)}
                className="h-7 w-7 cursor-pointer rounded border border-[var(--ui-border)] bg-transparent p-0.5 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{rp.role}</div>
                <div className="text-[10px] text-[var(--ui-text-muted)] truncate">{rp.desc}</div>
              </div>
              <span className="text-xs font-mono text-[var(--ui-text-muted)] shrink-0">
                {rp.currentColor}
              </span>
            </div>
          ))}
        </div>
      </div>

      <hr className="border-[var(--ui-border)]" />

      {/* Custom Colors */}
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-medium border-b border-[var(--ui-border)] pb-2">{t.customColors}</h3>

        {customPresets.length > 0 && (
          <div className="flex flex-col gap-1.5">
            {customPresets.map((preset) => (
              <div
                key={preset.name}
                className="flex items-center gap-2 rounded-lg border border-[var(--ui-border)] px-3 py-2"
              >
                <input
                  type="color"
                  value={preset.color}
                  onChange={(e) => updateColorPreset(preset.name, { color: e.target.value })}
                  className="h-7 w-7 cursor-pointer rounded border border-[var(--ui-border)] bg-transparent p-0.5 shrink-0"
                />
                <span className="flex-1 text-sm truncate">{preset.name}</span>
                <span className="text-xs font-mono text-[var(--ui-text-muted)] shrink-0">
                  {preset.color}
                </span>
                <button
                  onClick={() => handleDelete(preset.name)}
                  className={`shrink-0 rounded px-2 py-1 text-xs ${
                    confirmDeleteName === preset.name
                      ? 'bg-red-50 text-red-600 border border-red-300'
                      : 'text-[var(--ui-text-muted)] hover:text-red-500'
                  }`}
                >
                  {confirmDeleteName === preset.name ? t.confirmDelete : t.delete}
                </button>
              </div>
            ))}
          </div>
        )}

        {isAdding ? (
          <div className="flex items-center gap-2 rounded-lg border border-[var(--ui-border)] p-3">
            <input
              type="color"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              className="h-7 w-7 cursor-pointer rounded border border-[var(--ui-border)] bg-transparent p-0.5 shrink-0"
            />
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={handleAddKeyDown}
              placeholder={t.colorName}
              className="flex-1 rounded border border-[var(--ui-border)] bg-transparent px-2 py-1.5 text-sm outline-none focus:border-[var(--printmd-link-color)]"
              autoFocus
            />
            <button
              onClick={handleAdd}
              disabled={!newName.trim()}
              className="rounded bg-[var(--foreground)] px-3 py-1.5 text-sm text-[var(--background)] disabled:opacity-40"
            >
              {t.add}
            </button>
            <button
              onClick={() => { setIsAdding(false); setNewName(''); }}
              className="rounded border border-[var(--ui-border)] px-3 py-1.5 text-sm hover:bg-[var(--ui-bg-hover)]"
            >
              {t.cancel}
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-[var(--ui-border)] p-3 text-sm text-[var(--ui-text-muted)] transition-colors hover:border-[var(--ui-border-hover)] hover:bg-[var(--ui-bg-hover)]"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {t.addCustomColor}
          </button>
        )}
      </div>
    </div>
  );
}

export default ColorPresetEditor;
