import { describe, it, expect, vi, beforeEach } from 'vitest';

// ============================
// Payment Service Tests
// ============================
// Mockeamos el repository para aislar la lógica de negocio del service.
// Validamos que el service construye los datos correctos y delega al repo.

// Mock del repository — intercepta todas las funciones exportadas
vi.mock('@/modules/payments/payment.repository', () => ({
  savePayment: vi.fn((payment) => Promise.resolve(payment)),
  findPaymentById: vi.fn(() => Promise.resolve(null)),
  findPaymentByOrderId: vi.fn(() => Promise.resolve(null)),
  findAllPayments: vi.fn(() => Promise.resolve([])),
  updatePayment: vi.fn(() => Promise.resolve(null)),
}));

import {
  createPayment,
  getPaymentById,
  getPaymentByOrderId,
  listPayments,
  updatePaymentStatus,
} from '@/modules/payments/payment.service';

import * as repo from '@/modules/payments/payment.repository';

describe('Payment Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- createPayment ---

  describe('createPayment', () => {
    it('debe crear un payment con status PENDING y llamar a savePayment', async () => {
      const input = {
        orderId: 'order_100',
        amount: 2500,
        method: 'debit_card',
      };

      const result = await createPayment(input);

      // Verifica que el service generó un ID y puso PENDING
      expect(result.id).toBeDefined();
      expect(result.status).toBe('PENDING');
      expect(result.orderId).toBe('order_100');
      expect(result.amount).toBe(2500);
      expect(new Date(result.createdAt).toString()).not.toBe('Invalid Date');

      // Verifica que llamó al repo con los datos correctos
      expect(repo.savePayment).toHaveBeenCalledOnce();
      expect(repo.savePayment).toHaveBeenCalledWith(
        expect.objectContaining({
          orderId: 'order_100',
          amount: 2500,
          method: 'debit_card',
          status: 'PENDING',
        })
      );
    });
  });

  // --- getPaymentById ---

  describe('getPaymentById', () => {
    it('debe delegar al repository', async () => {
      await getPaymentById('pay_001');

      expect(repo.findPaymentById).toHaveBeenCalledWith('pay_001');
    });
  });

  // --- getPaymentByOrderId ---

  describe('getPaymentByOrderId', () => {
    it('debe delegar al repository con el orderId correcto', async () => {
      await getPaymentByOrderId('order_001');

      expect(repo.findPaymentByOrderId).toHaveBeenCalledWith('order_001');
    });
  });

  // --- listPayments ---

  describe('listPayments', () => {
    it('debe delegar al repository', async () => {
      await listPayments();

      expect(repo.findAllPayments).toHaveBeenCalledOnce();
    });
  });

  // --- updatePaymentStatus ---

  describe('updatePaymentStatus', () => {
    it('debe llamar a updatePayment con solo el campo status', async () => {
      await updatePaymentStatus('pay_001', 'APPROVED');

      expect(repo.updatePayment).toHaveBeenCalledWith('pay_001', {
        status: 'APPROVED',
      });
    });
  });
});
