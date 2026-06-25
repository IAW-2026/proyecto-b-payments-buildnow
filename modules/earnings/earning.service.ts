import * as earningsRepository from './earning.repository';
import {
  RecipientType,
  Prisma,
} from '@/lib/generated/prisma/client';

export interface EarningsSummary {
  userId: string;
  recipientType: RecipientType;
  totalEarnings: Prisma.Decimal;
  payoutsCount: number;
}

export async function getEarningsByRecipient(
  userId: string,
  recipientType: RecipientType
): Promise<EarningsSummary> {
  const payouts =
    await earningsRepository.findApprovedPayoutsByRecipient(
      userId,
      recipientType
    );

  let totalEarnings = new Prisma.Decimal(0);

  for (const payout of payouts) {
    totalEarnings = totalEarnings.plus(payout.amount);
  }

  return {
    userId,
    recipientType,
    totalEarnings,
    payoutsCount: payouts.length,
  };
}