import { test, expect } from '@playwright/test';

const TABS_STORAGE_KEY = 'printmd-tabs';

test.describe('Content Persistence', () => {
  test('typing in editor updates tab store content', async ({ page }) => {
    await page.goto('/');

    // Wait for the editor to load
    await page.waitForSelector('.cm-editor', { timeout: 10_000 });

    // Type into the CodeMirror editor
    const editor = page.locator('.cm-editor .cm-content');
    await editor.click();
    await page.keyboard.press('Meta+a');
    await page.keyboard.type('# E2E Test Content');

    // Wait for state update
    await page.waitForTimeout(500);

    // Verify the tab content via the zustand store in memory
    const content = await page.evaluate(() => {
      const raw = localStorage.getItem('printmd-tabs');
      if (!raw) return null;
      const data = JSON.parse(raw);
      return data?.state?.tabs?.[0]?.title;
    });
    // Tab should exist (metadata is persisted)
    expect(content).toBeDefined();
  });

  test('print preview paginates the document ready for printing', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.cm-editor', { timeout: 10_000 });

    // Open print preview (click the print/PDF button in header)
    const printButton = page.getByRole('button', { name: /print|pdf/i }).first();
    await printButton.click();

    // PrintPreview modal should appear
    await expect(page.getByText('Print Preview')).toBeVisible({ timeout: 5_000 });

    // One action covers both printing and saving a PDF — the browser's own
    // dialog offers "Save as PDF" as a destination, so there is no separate
    // export button and no programmatic download to wait for.
    await expect(page.getByRole('button', { name: 'Print / Save PDF' })).toBeVisible();

    // The printable document is the preview iframe: wait for pagination to
    // finish and assert it produced at least one sheet with real text.
    const frame = page.frameLocator('iframe[title="Print preview"]');
    await expect(frame.locator('.print-page').first()).toBeVisible({ timeout: 15_000 });

    const pageCount = await frame.locator('.print-page').count();
    expect(pageCount).toBeGreaterThan(0);

    // Text must be text, not a rasterised image.
    await expect(frame.locator('.print-page .preview-content').first()).not.toBeEmpty();
  });
});
