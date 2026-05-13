import * as earningsRepository from './earning.repository';
import {
  RecipientType,
  Prisma,
} from '@/lib/generated/prisma/client';

export interface EarningsSummary {
  recipientId: string;
  recipientType: RecipientType;
  totalEarnings: Prisma.Decimal;
  payoutsCount: number;
}

export async function getEarningsByRecipient(
  recipientId: string,
  recipientType: RecipientType
): Promise<EarningsSummary> {
  const payouts =
    await earningsRepository.findApprovedPayoutsByRecipient(
      recipientId,
      recipientType
    );

  let totalEarnings = new Prisma.Decimal(0);

  for (const payout of payouts) {
    totalEarnings = totalEarnings.plus(payout.amount);
  }

  return {
    recipientId,
    recipientType,
    totalEarnings,
    payoutsCount: payouts.length,
  };
}