import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { CHANGELOG, LATEST_CHANGELOG_DATE, changelogImageSrc } from '../changelog';
import { locales } from '../i18n/config';

// Rules from docs/changelog-guide.md that are cheap to check mechanically.
describe('changelog data', () => {
  it('is newest first with unique, real dates', () => {
    const dates = CHANGELOG.map((e) => e.date);
    expect(dates).toEqual([...dates].sort().reverse());
    expect(new Set(dates).size).toBe(dates.length);
    for (const d of dates) {
      expect(d).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(Date.parse(d))).toBe(false);
    }
    expect(LATEST_CHANGELOG_DATE).toBe(dates[0]);
  });

  it('fills in every locale', () => {
    for (const entry of CHANGELOG) {
      for (const locale of locales) {
        expect(entry.title[locale], `${entry.date} title.${locale}`).toBeTruthy();
        expect(entry.summary[locale], `${entry.date} summary.${locale}`).toBeTruthy();
        for (const change of entry.changes) {
          expect(change.text[locale], `${entry.date} change.${locale}`).toBeTruthy();
        }
      }
      expect(entry.changes.length, entry.date).toBeGreaterThan(0);
    }
  });

  it('points at image files that exist', () => {
    for (const entry of CHANGELOG) {
      for (const image of entry.images ?? []) {
        for (const locale of locales) {
          const file = path.join(process.cwd(), 'public', changelogImageSrc(entry, image, locale));
          expect(existsSync(file), file).toBe(true);
        }
      }
    }
  });
});
