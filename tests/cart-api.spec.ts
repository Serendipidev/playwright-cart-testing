import { test, expect } from '@playwright/test';

const API_URL = 'https://api.luckycart.com/cart/ticket';

const WRONG_AUTH_CART_ID = 'wrong_auth_test';
const NOT_ELIGIBLE_CART_ID = 'not_eligible_test_101';
const ELIGIBLE_CART_ID = 'eligible_test_101';

test.describe('Cart API testing', () => {
  test('returns 401 if wrong authentication parameters', async ({ request }) => {
    const payload = {
      cartId: WRONG_AUTH_CART_ID,
      totalAti: 30.0,
      shopperId: WRONG_AUTH_CART_ID,
      shopperEmail: `${WRONG_AUTH_CART_ID}@luckycart.com`,
      auth_v: '2.0',
      auth_key: 'tVIoa1S6',
      auth_ts: '1640991600',
      auth_sign: WRONG_AUTH_CART_ID
    };

    const resp = await request.post(API_URL, { data: payload });
    expect(resp.status()).toBe(401);
    const body = await resp.json().catch(() => ({}));
    expect(body.error || body.status).toBeDefined();
  });

  test('returns 200 and empty body for cart (totalAti < 50)', async ({ request }) => {
    const payload = {
      cartId: NOT_ELIGIBLE_CART_ID,
      totalAti: 30.0,
      shopperId: NOT_ELIGIBLE_CART_ID,
      shopperEmail: `${NOT_ELIGIBLE_CART_ID}@luckycart.com`,
      auth_v: '2.0',
      auth_key: 'tVIoa1S6',
      auth_ts: '1640991600',
      auth_sign: 'c723c649c389d68d8ab3feb4f53875f7f7eb87d27ec575f1f06a66e3dae4dc30'
    };

    const resp = await request.post(API_URL, { data: payload });
    expect(resp.status()).toBe(200);
    const body = await resp.json().catch(() => ({}));
    expect(Object.keys(body).length).toBe(0);
  });

  test('returns 200 with game info for eligible cart (totalAti >= 50)', async ({ request }) => {
    const payload = {
      cartId: ELIGIBLE_CART_ID,
      totalAti: 60.0,
      shopperId: ELIGIBLE_CART_ID,
      shopperEmail: `${ELIGIBLE_CART_ID}@luckycart.com`,
      auth_v: '2.0',
      auth_key: 'tVIoa1S6',
      auth_ts: '1640991600',
      auth_sign: 'c723c649c389d68d8ab3feb4f53875f7f7eb87d27ec575f1f06a66e3dae4dc30'
    };

    const resp = await request.post(API_URL, { data: payload });
    expect(resp.status()).toBe(200);
    const body = await resp.json().catch(() => ({}));

    expect(body.game || body.gameInfo).toBeDefined();
    expect(typeof body.totalAti).toBe('number');
    expect(body.totalAti).toBeGreaterThan(50);
  });
});
