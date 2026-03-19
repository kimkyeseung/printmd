import { test, expect } from '@playwright/test';

const STYLE_STORAGE_KEY = 'printmd-styles';

test.describe('Custom Preset Save / Load / Delete', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate((key) => localStorage.removeItem(key), STYLE_STORAGE_KEY);
    await page.reload();
    await page.waitForSelector('.cm-editor', { timeout: 10_000 });
  });

  async function openPresetTab(page: import('@playwright/test').Page) {
    const styleBtn = page.getByRole('button', { name: /style settings/i });
    await styleBtn.click();
    await expect(page.getByText('Style Settings')).toBeVisible({ timeout: 5_000 });
    const presetTab = page.getByRole('tab', { name: 'Preset' });
    await presetTab.click();
  }

  async function savePreset(page: import('@playwright/test').Page, name: string) {
    await page.getByRole('button', { name: /Save Current Style/i }).click();
    const input = page.getByPlaceholder('Preset name');
    await expect(input).toBeVisible();
    await input.fill(name);
    await page.getByRole('button', { name: 'Save', exact: true }).click();
  }

  test('save a custom preset and see it in the list', async ({ page }) => {
    await openPresetTab(page);
    await savePreset(page, 'My Custom');
    await expect(page.getByText('My Custom')).toBeVisible();
  });

  test('load a custom preset restores styles', async ({ page }) => {
    await openPresetTab(page);

    // Select dark preset
    await page.getByText('다크 (Dark)').click();

    // Save as custom
    await savePreset(page, 'Dark Custom');

    // Switch to default
    await page.getByText('기본 (Default)').click();

    // Load the custom preset via "Load" button inside the Dark Custom card
    const presetCard = page.locator('.flex.flex-col', { hasText: 'Dark Custom' }).first();
    await presetCard.getByRole('button', { name: 'Load', exact: true }).click();
    await page.waitForTimeout(300);

    // Verify via localStorage
    const stored = await page.evaluate((key) => {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    }, STYLE_STORAGE_KEY);

    expect(stored?.state?.globalStyles?.textColor).toBe('#e0e0e0');
  });

  test('delete a custom preset removes it from the list', async ({ page }) => {
    await openPresetTab(page);
    await savePreset(page, 'To Delete');
    await expect(page.getByText('To Delete')).toBeVisible();

    // Click Delete then Confirm inside the preset card
    const deleteCard = page.locator('.flex.flex-col', { hasText: 'To Delete' }).first();
    await deleteCard.getByRole('button', { name: 'Delete', exact: true }).click();
    await deleteCard.getByRole('button', { name: 'Confirm?', exact: true }).click();
    await expect(page.getByText('To Delete')).not.toBeVisible();
  });

  test('custom preset persists after reload', async ({ page }) => {
    await openPresetTab(page);
    await savePreset(page, 'Persistent');
    await expect(page.getByText('Persistent')).toBeVisible();

    await page.reload();
    await page.waitForSelector('.cm-editor', { timeout: 10_000 });
    await openPresetTab(page);
    await expect(page.getByText('Persistent')).toBeVisible();
  });
});
