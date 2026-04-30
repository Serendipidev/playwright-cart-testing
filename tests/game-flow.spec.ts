import { test, expect } from '@playwright/test';
import { API_URL, buildPayload } from './test-utils';

const ELIGIBLE_CART_ID = 'eligible_test_2';


test.describe('Game flow', () => {
  test('returns eligible game and play', async ({ request, page }) => {
    const cartId = ELIGIBLE_CART_ID;

    await test.step('Request ticket from API', async () => {
      const payload = buildPayload(cartId, 60.0);
      const resp = await request.post(API_URL, { data: payload });
      expect(resp.ok()).toBeTruthy();
      const body = await resp.json();

      expect(body.ticket).toBeTruthy();
      expect(body.baseDesktopUrl).toBeTruthy();

      // Navigate to game page
      await page.goto(body.baseDesktopUrl, { waitUntil: 'load' });
    });

    await test.step('Play the game and verify result', async () => {
      const playNow = page.getByRole('button', { name: /Play now/i });
      await expect(playNow).toBeVisible({ timeout: 10000 });
      await playNow.click();

      // Click "Spin the wheel!" to play
      const spin = page.getByRole('button', { name: /Spin the wheel/i });
      await expect(spin).toBeVisible({ timeout: 10000 });
      await spin.click();

      // Validate result contains "Congrats"
      const congrats = page.getByText(/Congrats/i);
      await expect(congrats).toBeVisible({ timeout: 10000 });
    });
  });
});
