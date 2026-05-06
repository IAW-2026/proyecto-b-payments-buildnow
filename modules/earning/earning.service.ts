import * as financialHistoryService from '../financial-history';

export interface EarningsSummary {
  recipientId: string;
  recipientType: 'SELLER' | 'DELIVERY';
  totalEarnings: number;
  currency: string;
}

export async function getEarnings(
  recipientId: string,
  recipientType: 'SELLER' | 'DELIVERY'
): Promise<EarningsSummary> {
  const history =
    await financialHistoryService.getFinancialHistoryByRecipient(
      recipientId,
      recipientType
    );

  const totalEarnings = history
    .filter((record) => record.status === 'COMPLETED')
    .reduce((sum, record) => sum + record.amount, 0);

  return {
    recipientId,
    recipientType,
    totalEarnings,
    currency: 'ARS',
  };
}