import { describe, it, expect, vi, beforeEach } from 'vitest';

// ============================
// Payout Service Tests
// ============================
// Mockeamos el repository para aislar la lógica de negocio.

vi.mock('@/modules/payouts/payout.repository', () => ({
  savePayout: vi.fn((payout) => Promise.resolve(payout)),
  findPayoutById: vi.fn(() => Promise.resolve(null)),
  findAllPayouts: vi.fn(() => Promise.resolve([])),
  findPayoutsByRecipient: vi.fn(() => Promise.resolve([])),
}));

import {
  createPayout,
  getPayoutsByRecipient,
} from '@/modules/payouts/payout.service';

import * as repo from '@/modules/payouts/payout.repository';

describe('Payout Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- createPayout ---

  describe('createPayout', () => {
    it('debe crear un payout con status PENDING y persistirlo', async () => {
      const input = {
        orderId: 'order_200',
        recipientId: 'seller_001',
        recipientType: 'SELLER' as const,
        amount: 800,
      };

      const result = await createPayout(input);

      expect(result.id).toBeDefined();
      expect(result.status).toBe('PENDING');
      expect(result.recipientId).toBe('seller_001');
      expect(result.recipientType).toBe('SELLER');
      expect(result.amount).toBe(800);
      expect(new Date(result.createdAt).toString()).not.toBe('Invalid Date');

      expect(repo.savePayout).toHaveBeenCalledOnce();
      expect(repo.savePayout).toHaveBeenCalledWith(
        expect.objectContaining({
          orderId: 'order_200',
          recipientId: 'seller_001',
          recipientType: 'SELLER',
          amount: 800,
          status: 'PENDING',
        })
      );
    });
  });

  // --- getPayoutsByRecipient ---

  describe('getPayoutsByRecipient', () => {
    it('debe delegar al repository con recipientId y recipientType', async () => {
      await getPayoutsByRecipient('seller_001', 'SELLER');

      expect(repo.findPayoutsByRecipient).toHaveBeenCalledWith(
        'seller_001',
        'SELLER'
      );
    });
  });
});
