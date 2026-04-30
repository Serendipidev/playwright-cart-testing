export const API_URL = process.env.API_URL || 'https://api.luckycart.com/cart/ticket';

export function getAuthParams() {
  const { AUTH_V, AUTH_KEY, AUTH_TS, AUTH_SIGN } = process.env;
  if (AUTH_V && AUTH_KEY && AUTH_TS && AUTH_SIGN) {
    return { auth_v: AUTH_V, auth_key: AUTH_KEY, auth_ts: AUTH_TS, auth_sign: AUTH_SIGN };
  }
  // Fallback defaults (use only for local/dev runs).
  return {
    auth_v: '2.0',
    auth_key: 'tVIoa1S6',
    auth_ts: '1640991600',
    auth_sign: 'c723c649c389d68d8ab3feb4f53875f7f7eb87d27ec575f1f06a66e3dae4dc30'
  };
}

export function buildPayload(cartId: string, totalAti: number) {
  const auth = getAuthParams();
  return {
    cartId,
    totalAti,
    shopperId: cartId,
    shopperEmail: `${cartId}@luckycart.com`,
    ...auth
  };
}
