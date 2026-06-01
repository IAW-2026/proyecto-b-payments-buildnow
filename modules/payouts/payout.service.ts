import * as payoutRepository from './payout.repository';
import { Prisma, RecipientType, type Payout, PayoutStatus } from '@/lib/generated/prisma/client';

export interface CreatePayoutInput {
  orderId: string;
  recipientId?: string | null;
  recipientType: RecipientType;
  amount: Prisma.Decimal;
}

export async function createPayout(
  data: CreatePayoutInput
): Promise<Payout> {
  const payout: Payout = {
    id: crypto.randomUUID(),
    orderId: data.orderId,
    recipientId: data.recipientId ?? null,
    recipientType: data.recipientType,
    amount: data.amount,
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
  userId: string,
  recipientType: RecipientType
): Promise<Payout[]> {
  return payoutRepository.findPayoutsByRecipient(
    userId,
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

export async function createPayoutIfNotExists(
  data: CreatePayoutInput
): Promise<Payout> {

  const existing =
    await payoutRepository
      .findPayoutByOrderIdAndRecipientType(
        data.orderId,
        data.recipientType
      );

  if (existing) {

    console.info(
      '[PAYOUT][INFO] Duplicate skipped',
      {
        orderId: data.orderId,
        recipientType: data.recipientType,
      }
    );

    return existing;
  }

  return createPayout(data);
}

export async function claimPayout(
  orderId: string,
  recipientType: RecipientType,
  recipientId: string
) {
  const payout =
    await payoutRepository.findPendingPayoutByOrderIdAndType(
      orderId,
      recipientType
    );

  if (!payout) {
    return null;
  }

  return payoutRepository.completePayout(
    payout.id,
    recipientId
  );
}

