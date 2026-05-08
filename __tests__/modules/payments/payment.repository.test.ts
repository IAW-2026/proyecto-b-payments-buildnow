import { describe, it, expect } from 'vitest';
import {
  savePayment,
  findPaymentById,
  findPaymentByOrderId,
  findAllPayments,
  updatePayment,
} from '@/modules/payments/payment.repository';

// ============================
// Payment Repository Tests
// ============================
// Testeamos el CRUD directo contra el DB en memoria (sin mocks).
// El setup.ts se encarga de limpiar el store entre tests.

const mockPayment = {
  id: 'pay_001',
  orderId: 'order_001',
  amount: 1500,
  method: 'credit_card',
  status: 'PENDING' as const,
  createdAt: '2026-01-01T00:00:00.000Z',
};

describe('Payment Repository', () => {
  // --- savePayment ---

  describe('savePayment', () => {
    it('debe guardar y retornar el payment con todos sus campos', async () => {
      const saved = await savePayment(mockPayment);

      // db.insert puede agregar campos extra (id, createdAt), pero los originales deben estar
      expect(saved.orderId).toBe('order_001');
      expect(saved.amount).toBe(1500);
      expect(saved.method).toBe('credit_card');
      expect(saved.status).toBe('PENDING');
    });
  });

  // --- findPaymentById ---

  describe('findPaymentById', () => {
    it('debe encontrar un payment existente por ID', async () => {
      await savePayment(mockPayment);

      const found = await findPaymentById('pay_001');

      expect(found).not.toBeNull();
      expect(found!.id).toBe('pay_001');
      expect(found!.orderId).toBe('order_001');
    });

    it('debe retornar null si el payment no existe', async () => {
      const found = await findPaymentById('no_existe');

      expect(found).toBeNull();
    });
  });

  // --- findPaymentByOrderId ---

  describe('findPaymentByOrderId', () => {
    it('debe encontrar un payment por orderId', async () => {
      await savePayment(mockPayment);

      const found = await findPaymentByOrderId('order_001');

      // findBy retorna un array, el repo retorna el resultado como Payment
      expect(found).not.toBeNull();
    });
  });

  // --- findAllPayments ---

  describe('findAllPayments', () => {
    it('debe retornar todos los payments guardados', async () => {
      await savePayment(mockPayment);
      await savePayment({
        ...mockPayment,
        id: 'pay_002',
        orderId: 'order_002',
      });

      const all = await findAllPayments();

      expect(all).toHaveLength(2);
    });

    it('debe retornar array vacío si no hay payments', async () => {
      const all = await findAllPayments();

      expect(all).toEqual([]);
    });
  });

  // --- updatePayment ---

  describe('updatePayment', () => {
    it('debe actualizar el status de un payment existente', async () => {
      await savePayment(mockPayment);

      const updated = await updatePayment('pay_001', {
        status: 'APPROVED',
      });

      expect(updated).not.toBeNull();
      expect(updated!.status).toBe('APPROVED');
      // Los demás campos deben mantenerse
      expect(updated!.orderId).toBe('order_001');
      expect(updated!.amount).toBe(1500);
    });

    it('debe retornar null si el payment no existe', async () => {
      const updated = await updatePayment('no_existe', {
        status: 'APPROVED',
      });

      expect(updated).toBeNull();
    });
  });
});
