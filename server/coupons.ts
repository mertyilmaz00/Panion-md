const VALID_COUPONS = new Set([
  'PANION-A9X4L2', 'PANION-HT72QZ', 'PANION-R5J8YP', 'PANION-ME4LQ9',
  'PANION-K29DHF', 'PANION-T7W3XP', 'PANION-Y4V8ZQ', 'PANION-FP6B2R',
  'PANION-JD7C9K', 'PANION-XH35VE', 'PANION-QR8M2T', 'PANION-U9P6LQ',
  'PANION-N3Y7BW', 'PANION-ZK1D8S', 'PANION-G4H9MT', 'PANION-WQ2R5N',
  'PANION-EL7K8X', 'PANION-P9V3YD', 'PANION-S4C1JB', 'PANION-HM6T5Z',
  'PANION-R8L2FX', 'PANION-Y3W9QK', 'PANION-V5D1ZT', 'PANION-T4P7NM',
  'PANION-XJ8L2C', 'PANION-Q9E5HR', 'PANION-L2Y6VB', 'PANION-K7D4MP',
  'PANION-J3R9TX', 'PANION-Z8W5NL', 'PANION-G6Q2HF', 'PANION-M1K8YZ',
  'PANION-P7C9VR', 'PANION-H4T5LD', 'PANION-U8M3QK', 'PANION-R2X9BW',
  'PANION-W3L7ZT', 'PANION-Y6P1FD', 'PANION-E9J4QC', 'PANION-N7V8HK',
  'PANION-X2D5GM', 'PANION-S8L9TP', 'PANION-F3R7WY', 'PANION-K5H1BZ',
  'PANION-T9Q2XE', 'PANION-V6M4DC', 'PANION-J1P8LF', 'PANION-L8Z3RW',
  'PANION-Z5Y7QG', 'PANION-D9H2TX', 'PANION-A7C4KM'
]);

const usedCoupons = new Set<string>();

export function validateCoupon(code: string): boolean {
  const upperCode = code.toUpperCase().trim();
  return VALID_COUPONS.has(upperCode) && !usedCoupons.has(upperCode);
}

export function markCouponAsUsed(code: string): void {
  usedCoupons.add(code.toUpperCase().trim());
}

export function isCouponUsed(code: string): boolean {
  return usedCoupons.has(code.toUpperCase().trim());
}
