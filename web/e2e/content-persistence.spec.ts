import { test, expect } from '@playwright/test';

const STORAGE_KEY = 'printmd-content';

test.describe('Content Persistence', () => {
  test('typing in editor saves to localStorage', async ({ page }) => {
    await page.goto('/');

    // Wait for the editor to load
    await page.waitForSelector('.cm-editor', { timeout: 10_000 });

    // Type into the CodeMirror editor
    const editor = page.locator('.cm-editor .cm-content');
    await editor.click();
    await page.keyboard.press('Meta+a');
    await page.keyboard.type('# E2E Test Content');

    // Wait for localStorage update (handleContentChange is called on each change)
    await page.waitForTimeout(500);

    // Verify localStorage
    const stored = await page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY);
    expect(stored).toContain('E2E Test Content');
  });

  test('content loads from localStorage after reload', async ({ page }) => {
    const testContent = '# Persisted After Reload';

    // Seed localStorage
    await page.goto('/');
    await page.evaluate(
      ([key, val]) => localStorage.setItem(key, val),
      [STORAGE_KEY, testContent] as const
    );

    // Reload the page
    await page.reload();
    await page.waitForSelector('.cm-editor', { timeout: 10_000 });

    // The preview panel should contain the persisted text
    const preview = page.locator('.preview-content');
    await expect(preview).toContainText('Persisted After Reload');
  });

  test('Save PDF button opens print preview and starts download', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.cm-editor', { timeout: 10_000 });

    // Open print preview (click the print/PDF button in header)
    // The header has a print button that opens PrintPreview
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
