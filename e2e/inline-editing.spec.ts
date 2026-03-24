import { test, expect } from '@playwright/test';

test.describe('Preview Inline Editing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.cm-editor', { timeout: 10_000 });

    // Set known content via CodeMirror
    const editor = page.locator('.cm-editor .cm-content');
    await editor.click();
    await page.keyboard.press('Meta+a');
    await page.keyboard.type('# Test Heading\n\nParagraph text here');
    await page.waitForTimeout(500);
  });

  test('double-click on heading opens textarea with original markdown', async ({ page }) => {
    const preview = page.locator('.preview-content');
    const heading = preview.locator('h1');
    await expect(heading).toContainText('Test Heading');

    await heading.dblclick();

    const textarea = page.locator('.preview-container textarea');
    await expect(textarea).toBeVisible({ timeout: 3_000 });
    await expect(textarea).toHaveValue('# Test Heading');
  });

  test('double-click on paragraph opens textarea', async ({ page }) => {
    const preview = page.locator('.preview-content');
    const paragraph = preview.locator('p').first();
    await expect(paragraph).toContainText('Paragraph text here');

    await paragraph.dblclick();

    const textarea = page.locator('.preview-container textarea');
    await expect(textarea).toBeVisible({ timeout: 3_000 });
    await expect(textarea).toHaveValue('Paragraph text here');
  });

  test('Escape cancels editing without changing content', async ({ page }) => {
    const preview = page.locator('.preview-content');
    const heading = preview.locator('h1');

    await heading.dblclick();
    const textarea = page.locator('.preview-container textarea');
    await expect(textarea).toBeVisible();

    // Type something then press Escape
    await textarea.fill('# Changed Heading');
    await page.keyboard.press('Escape');

    // Textarea should disappear
    await expect(textarea).not.toBeVisible();

    // Original content should remain
    await expect(heading).toContainText('Test Heading');
  });

  test('Meta+Enter confirms editing and updates content', async ({ page }) => {
    const preview = page.locator('.preview-content');
    const heading = preview.locator('h1');

    await heading.dblclick();
    const textarea = page.locator('.preview-container textarea');
    await expect(textarea).toBeVisible();

    await textarea.fill('# Updated Heading');
    await page.keyboard.press('Meta+Enter');

    // Textarea should disappear
    await expect(textarea).not.toBeVisible();

    // Preview should show updated content
    await expect(preview.locator('h1')).toContainText('Updated Heading');
  });

  test('blur confirms editing', async ({ page }) => {
    const preview = page.locator('.preview-content');
    const heading = preview.locator('h1');

    await heading.dblclick();
    const textarea = page.locator('.preview-container textarea');
    await expect(textarea).toBeVisible();

    await textarea.fill('# Blur Updated');
    // Click outside the textarea to trigger blur
    await page.locator('.preview-container').click({ position: { x: 5, y: 5 } });

    await expect(textarea).not.toBeVisible();
    await expect(preview.locator('h1')).toContainText('Blur Updated');
  });

  test('plain Enter confirms editing on heading (single-line block)', async ({ page }) => {
    const preview = page.locator('.preview-content');
    const heading = preview.locator('h1');

    await heading.dblclick();
    const textarea = page.locator('.preview-container textarea');
    await expect(textarea).toBeVisible();

    await textarea.fill('# Enter Confirmed');
    await page.keyboard.press('Enter');

    await expect(textarea).not.toBeVisible();
    await expect(preview.locator('h1')).toContainText('Enter Confirmed');
  });

  test('plain Enter does NOT confirm on paragraph (allows newline)', async ({ page }) => {
    const preview = page.locator('.preview-content');
    const paragraph = preview.locator('p').first();

    await paragraph.dblclick();
    const textarea = page.locator('.preview-container textarea');
    await expect(textarea).toBeVisible();

    // Plain Enter should not close the textarea for paragraphs
    await page.keyboard.press('Enter');
    await expect(textarea).toBeVisible();
  });

  test('checkbox click still works without opening editor', async ({ page }) => {
    // Set content with a task list
    const editor = page.locator('.cm-editor .cm-content');
    await editor.click();
    await page.keyboard.press('Meta+a');
    await page.keyboard.type('- [ ] Task item');
    await page.waitForTimeout(500);

    const preview = page.locator('.preview-content');
    const checkbox = preview.locator('input[type="checkbox"]');
    await expect(checkbox).toBeVisible();

    // Dispatch click on the checkbox via JS (disabled inputs need manual dispatch)
    await checkbox.dispatchEvent('click');
    await page.waitForTimeout(500);

    // Should not open a textarea
    const textarea = page.locator('.preview-container textarea');
    await expect(textarea).not.toBeVisible();

    // The checkbox should be toggled — verify via preview re-render
    await expect(preview.locator('input[type="checkbox"]')).toBeChecked({ timeout: 5_000 });
  });
});
