import { test, expect } from '@playwright/test';

const API_URL = 'https://api.luckycart.com/cart/ticket';

const ELIGIBLE_CART_ID = 'eligible_test_2';


test.describe('Game flow', () => {
  test('returns eligible game and play', async ({ request, page }) => {
    const cartId = ELIGIBLE_CART_ID;
    const payload = {
      cartId,
      totalAti: 60.0,
      shopperId: cartId,
      shopperEmail: `${cartId}@luckycart.com`,
      auth_v: '2.0',
      auth_key: 'tVIoa1S6',
      auth_ts: '1640991600',
      auth_sign: 'c723c649c389d68d8ab3feb4f53875f7f7eb87d27ec575f1f06a66e3dae4dc30'
    };

    const resp = await request.post(API_URL, { data: payload });
    expect(resp.status()).toBe(200);
    const body = await resp.json();

    if (!body.ticket || !body.baseDesktopUrl) {
      throw new Error('API response missing ticket or baseDesktopUrl: ' + JSON.stringify(body));
    }

    expect(body.ticket).toBeTruthy();
    expect(body.baseDesktopUrl).toBeTruthy();

    // Navigate to game page
    await page.goto(body.baseDesktopUrl, { waitUntil: 'load' });

    try {
      const playNow = page.getByText(/Play now/i);
      await expect(playNow).toBeVisible();
      await playNow.click();
    } catch (err) {
      throw new Error('Failed to click Play now: ' + String(err));
    }

    // Click "Spin the wheel!" to play
    try {
      const spin = page.getByText(/Spin the wheel/i);
      await expect(spin).toBeVisible();
      await spin.click();
    } catch (err) {
      throw new Error('Failed to click Spin the wheel: ' + String(err));
    }

    // Validate result contains "Congrats"
    const congrats = page.getByText(/Congrats/i);
    await expect(congrats).toBeVisible();
  });
});
