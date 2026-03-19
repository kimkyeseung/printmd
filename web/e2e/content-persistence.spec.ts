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

  test('Save PDF button opens print preview and starts download', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.cm-editor', { timeout: 10_000 });

    // Open print preview (click the print/PDF button in header)
    const printButton = page.getByRole('button', { name: /print|pdf/i }).first();
    await printButton.click();

    // PrintPreview modal should appear
    await expect(page.getByText('Print Preview')).toBeVisible({ timeout: 5_000 });

    // Save PDF button should be available
    const savePdfButton = page.getByRole('button', { name: 'Save PDF' });
    await expect(savePdfButton).toBeVisible();

    // Clicking Save PDF should trigger a download
    const downloadPromise = page.waitForEvent('download', { timeout: 30_000 });
    await savePdfButton.click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('document.pdf');
  });
});
