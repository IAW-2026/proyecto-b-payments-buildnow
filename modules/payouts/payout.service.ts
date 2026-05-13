import * as payoutRepository from './payout.repository';
import { Prisma, RecipientType, type Payout, PayoutStatus } from '@/lib/generated/prisma/client';

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
    amount: new Prisma.Decimal(data.amount),
    status: 'PENDING',
    createdAt: new Date(),
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
  recipientType: RecipientType
): Promise<Payout[]> {
  return payoutRepository.findPayoutsByRecipient(
    recipientId,
    recipientType
  );
}

export async function updatePayoutStatus(
  id: string,
  status: PayoutStatus
): Promise<Payout> {
  return payoutRepository.updatePayout(id, {
    status,
  });
}