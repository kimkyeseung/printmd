import type { GlobalStyles, ColorPreset, ElementStyles } from '@/types/style';

export interface ColorRole {
  role: string;
  desc: string;
  /** Where this color lives */
  source: 'global' | 'element';
  /** GlobalStyles key (when source='global') */
  styleKey?: keyof GlobalStyles;
  /** ElementStyles target (when source='element') */
  elementKey?: string;
  elementProp?: string;
}

/** Color roles — mix of GlobalStyles and ElementStyles targets */
export const COLOR_ROLES: ColorRole[] = [
  { role: 'Background', desc: 'Page background', source: 'global', styleKey: 'backgroundColor' },
  { role: 'Text', desc: 'Body text', source: 'global', styleKey: 'textColor' },
  { role: 'Heading', desc: 'Heading text (H1–H6)', source: 'element', elementKey: 'h1', elementProp: 'color' },
  { role: 'Bold', desc: 'Bold / strong text', source: 'element', elementKey: 'strong', elementProp: 'color' },
  { role: 'Link', desc: 'Links & accent', source: 'global', styleKey: 'linkColor' },
  { role: 'Code BG', desc: 'Code block background', source: 'global', styleKey: 'codeBackground' },
  { role: 'Divider', desc: 'Horizontal rule', source: 'element', elementKey: 'hr', elementProp: 'backgroundColor' },
];

/** Derive a role's current color from globalStyles + elementStyles */
export function getRoleColor(role: ColorRole, gs: GlobalStyles, es: ElementStyles): string {
  if (role.source === 'global' && role.styleKey) {
    return gs[role.styleKey] as string;
  }
  if (role.source === 'element' && role.elementKey && role.elementProp) {
    const el = es[role.elementKey as keyof ElementStyles];
    if (el && role.elementProp in el) {
      return (el as Record<string, unknown>)[role.elementProp] as string;
    }
    // Fallback: derive from globalStyles
    if (role.elementKey === 'h1') return gs.textColor;
    if (role.elementKey === 'strong') return gs.textColor;
    if (role.elementKey === 'hr') return 'rgba(0,0,0,0.20)';
  }
  return '#000000';
}

/** Derive ColorPreset[] from current styles */
export function deriveColorRolesFromStyles(gs: GlobalStyles, es?: ElementStyles): ColorPreset[] {
  return COLOR_ROLES.map((r) => ({
    name: r.role,
    color: getRoleColor(r, gs, es || {}),
  }));
}
