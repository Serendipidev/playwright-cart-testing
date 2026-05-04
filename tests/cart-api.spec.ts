import { test, expect } from '@playwright/test';
import { API_URL, buildPayload, getAuthParams } from './test-utils';

const WRONG_AUTH_CART_ID = 'wrong_auth_test';
const NOT_ELIGIBLE_CART_ID = 'not_eligible_test_101';
const ELIGIBLE_CART_ID = 'eligible_test_101';

test.describe('Cart API testing', () => {
  test('returns 401 if wrong authentication parameters', async ({ request }) => {
    await test.step('Post with wrong auth', async () => {
      const auth = getAuthParams();
      const payload = {
        cartId: WRONG_AUTH_CART_ID,
        totalAti: 30.0,
        shopperId: WRONG_AUTH_CART_ID,
        shopperEmail: `${WRONG_AUTH_CART_ID}@luckycart.com`,
        ...auth,
        auth_sign: WRONG_AUTH_CART_ID
      };

      const resp = await request.post(API_URL, { data: payload });
      expect(resp.status()).toBe(401);
      const body = await resp.json().catch(() => ({}));
      expect(body.error || body.status).toBeDefined();
    });
  });

  test('returns 200 and empty body for cart (totalAti < 50)', async ({ request }) => {
    await test.step('Post with small totalAti', async () => {
      const payload = buildPayload(NOT_ELIGIBLE_CART_ID, 30.0);

      const resp = await request.post(API_URL, { data: payload });
      expect(resp.ok()).toBeTruthy();
      const body = await resp.json().catch(() => ({}));
      expect(Object.keys(body || {}).length).toBe(0);
    });
  });

  test('returns 200 with game info for eligible cart (totalAti >= 50)', async ({ request }) => {
    await test.step('Post with eligible totalAti', async () => {
      const payload = buildPayload(ELIGIBLE_CART_ID, 60.0);

      const resp = await request.post(API_URL, { data: payload });
      expect(resp.ok()).toBeTruthy();
      const body = await resp.json().catch(() => ({}));

      expect(body.ticket).toBeDefined();
      expect(body.baseDesktopUrl).toBeDefined();
      expect(typeof body.ticket).toBe('string');
      expect(typeof body.baseDesktopUrl).toBe('string');
    });
  });
});
