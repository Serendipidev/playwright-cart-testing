import { test, expect } from '@playwright/test';
import { API_URL, buildPayload } from './test-utils';

const ELIGIBLE_CART_ID = 'eligible_test_2';

test.describe('Game flow', () => {
  test('returns eligible game and play', async ({ request, page }) => {

    await test.step('Request ticket from API', async () => {
      const payload = buildPayload(ELIGIBLE_CART_ID, 60.0);
      const resp = await request.post(API_URL, { data: payload });

      expect(resp.status()).toBe(200);
      const body = await resp.json();

      expect(body.baseDesktopUrl).toBeTruthy();

      // Navigate to game page
      await page.goto(body.baseDesktopUrl, { waitUntil: 'load' });
    });

    await test.step('Play the game and verify result', async () => {
      const playNowBtn = page.locator('[data-template-config="screens.home.ctaButton"]');
      await expect(playNowBtn).toBeVisible({ timeout: 10000 });
      await playNowBtn.click();

      // Click "Spin the wheel!" to play
      const spinBtn = page.locator('[data-template-config="screens.plugin.ctaButton"]');
      await expect(spinBtn).toBeVisible({ timeout: 10000 });
      await spinBtn.click();

      // Validate result contains "Congrats"
      const congrats = page.getByText(/Congrats/i);
      await expect(congrats).toBeVisible({ timeout: 10000 });
    });
  });
});
