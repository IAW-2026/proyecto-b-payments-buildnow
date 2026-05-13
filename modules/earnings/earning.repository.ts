import { prisma } from '@/lib/prisma';
import {
  Payout,
  RecipientType,
  PayoutStatus,
} from '@/lib/generated/prisma/client';

/** Obtener payouts completados de un recipient */
export async function findApprovedPayoutsByRecipient(
  recipientId: string,
  recipientType: RecipientType
): Promise<Payout[]> {
  return prisma.payout.findMany({
    where: {
      recipientId,
      recipientType,
      status: PayoutStatus.COMPLETED,
    },
  });
}