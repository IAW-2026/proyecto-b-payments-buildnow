import * as payoutRepository from './payout.repository';

export interface Payout {
  id: string;
  orderId: string;
  recipientId: string;
  recipientType: 'SELLER' | 'DELIVERY';
  amount: number;
  status: 'PENDING' | 'COMPLETED';
  createdAt: string;
}

export interface CreatePayoutInput {
  orderId: string;
  recipientId: string;
  recipientType: 'SELLER' | 'DELIVERY';
  amount: number;
}

export async function createPayout(
  data: CreatePayoutInput
): Promise<Payout> {
  const payout: Payout = {
    id: crypto.randomUUID(),
    orderId: data.orderId,
    recipientId: data.recipientId,
    recipientType: data.recipientType,
    amount: data.amount,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  };

  return payoutRepository.savePayout(payout);
}

export async function getPayoutById(
  id: string
): Promise<Payout | null> {
  return payoutRepository.findPayoutById(id);
}

export async function listPayouts(): Promise<Payout[]> {
  return payoutRepository.findAllPayouts();
}

export async function getPayoutsByRecipient(
  recipientId: string,
  recipientType: 'SELLER' | 'DELIVERY'
): Promise<Payout[]> {
  return payoutRepository.findPayoutsByRecipient(
    recipientId,
    recipientType
  );
}