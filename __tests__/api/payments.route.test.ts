import { describe, it, expect, vi, beforeEach } from 'vitest';

// ============================
// API Route Tests: /api/payments
// ============================
// Testeamos POST y GET llamando directamente a los handlers exportados.
// Mockeamos el módulo de payments para aislar del DB.

vi.mock('@/modules/payments', () => ({
  createPayment: vi.fn((data) =>
    Promise.resolve({
      id: 'pay_mock_001',
      ...data,
      status: 'PENDING',
      createdAt: '2026-01-01T00:00:00.000Z',
    })
  ),
  getPaymentByOrderId: vi.fn(() =>
    Promise.resolve({
      id: 'pay_mock_001',
      orderId: 'order_001',
      amount: 1500,
      method: 'credit_card',
      status: 'PENDING',
      createdAt: '2026-01-01T00:00:00.000Z',
    })
  ),
}));

import { POST, GET } from '@/app/api/payments/route';

describe('API /api/payments', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- POST /api/payments ---

  describe('POST /api/payments', () => {
    it('debe crear un payment con datos válidos → 201', async () => {
      const request = new Request('http://localhost/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: 'order_001',
          amount: 1500,
          method: 'credit_card',
        }),
      });

      const response = await POST(request);
      const body = await response.json();

      expect(response.status).toBe(201);
      expect(body.success).toBe(true);
      expect(body.data.orderId).toBe('order_001');
      expect(body.data.status).toBe('PENDING');
    });

    it('debe retornar 400 si falta orderId', async () => {
      const request = new Request('http://localhost/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 1500,
          method: 'credit_card',
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
    });

    it('debe retornar 400 si falta amount', async () => {
      const request = new Request('http://localhost/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: 'order_001',
          method: 'credit_card',
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
    });
  });

  // --- GET /api/payments?orderId=... ---

  describe('GET /api/payments', () => {
    it('debe retornar payment por orderId → 200', async () => {
      const request = new Request(
        'http://localhost/api/payments?orderId=order_001'
      );

      const response = await GET(request);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.success).toBe(true);
    });

    it('debe retornar 400 si falta orderId', async () => {
      const request = new Request('http://localhost/api/payments');

      const response = await GET(request);

      expect(response.status).toBe(400);
    });
  });
});
