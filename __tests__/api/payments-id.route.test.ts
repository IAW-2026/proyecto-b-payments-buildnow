import { describe, it, expect, vi, beforeEach } from 'vitest';

// ============================
// API Route Tests: /api/payments/[paymentId]
// ============================
// Testeamos GET y PATCH para un payment individual.
// El handler recibe params como Promise (App Router convention).

vi.mock('@/modules/payments', () => ({
  getPaymentById: vi.fn(),
}));

import { GET, PATCH } from '@/app/api/payments/[paymentId]/route';
import * as paymentModule from '@/modules/payments';

describe('API /api/payments/[paymentId]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- GET /api/payments/:paymentId ---

  describe('GET /api/payments/:paymentId', () => {
    it('debe retornar un payment existente → 200', async () => {
      const mockPayment = {
        id: 'pay_001',
        orderId: 'order_001',
        amount: 1500,
        method: 'credit_card',
        status: 'PENDING',
        createdAt: '2026-01-01T00:00:00.000Z',
      };

      vi.mocked(paymentModule.getPaymentById).mockResolvedValue(
        mockPayment
      );

      const request = new Request(
        'http://localhost/api/payments/pay_001'
      );

      const response = await GET(request, {
        params: Promise.resolve({ paymentId: 'pay_001' }),
      });
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.data.id).toBe('pay_001');
    });

    it('debe retornar 404 si el payment no existe', async () => {
      vi.mocked(paymentModule.getPaymentById).mockResolvedValue(null);

      const request = new Request(
        'http://localhost/api/payments/no_existe'
      );

      const response = await GET(request, {
        params: Promise.resolve({ paymentId: 'no_existe' }),
      });

      expect(response.status).toBe(404);
    });
  });

  // --- PATCH /api/payments/:paymentId ---

  describe('PATCH /api/payments/:paymentId', () => {
    it('debe retornar 200 con body válido', async () => {
      const request = new Request(
        'http://localhost/api/payments/pay_001',
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'APPROVED' }),
        }
      );

      const response = await PATCH(request, {
        params: Promise.resolve({ paymentId: 'pay_001' }),
      });

      // El PATCH actual es un placeholder que siempre retorna 200
      expect(response.status).toBe(200);
    });
  });
});
