import { describe, it, expect, vi, beforeEach } from 'vitest';

// ============================
// API Route Tests: /api/payments/payouts
// ============================

vi.mock('@/modules/payouts', () => ({
  createPayout: vi.fn((data) =>
    Promise.resolve({
      id: 'payout_mock_001',
      ...data,
      status: 'PENDING',
      createdAt: '2026-01-01T00:00:00.000Z',
    })
  ),
  getPayoutsByRecipient: vi.fn(() => Promise.resolve([])),
}));

import { POST, GET } from '@/app/api/payments/payouts/route';

describe('API /api/payments/payouts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/payments/payouts', () => {
    it('debe crear un payout con datos válidos → 201', async () => {
      const request = new Request('http://localhost/api/payments/payouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: 'order_001',
          recipientId: 'seller_001',
          recipientType: 'SELLER',
          amount: 800,
        }),
      });

      const response = await POST(request);
      const body = await response.json();

      expect(response.status).toBe(201);
      expect(body.success).toBe(true);
      expect(body.data.recipientId).toBe('seller_001');
      expect(body.data.status).toBe('PENDING');
    });

    it('debe retornar 400 si faltan campos requeridos', async () => {
      const request = new Request('http://localhost/api/payments/payouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: 'order_001' }),
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/payments/payouts', () => {
    it('debe retornar payouts por recipient → 200', async () => {
      const request = new Request(
        'http://localhost/api/payments/payouts?recipientId=seller_001&recipientType=SELLER'
      );

      const response = await GET(request);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.success).toBe(true);
    });

    it('debe retornar 400 si faltan query params', async () => {
      const request = new Request('http://localhost/api/payments/payouts');
      const response = await GET(request);
      expect(response.status).toBe(400);
    });

    it('debe retornar 400 si recipientType es inválido', async () => {
      const request = new Request(
        'http://localhost/api/payments/payouts?recipientId=seller_001&recipientType=INVALID'
      );

      const response = await GET(request);
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.error.message).toContain('recipientType must be SELLER or DELIVERY');
    });
  });
});
