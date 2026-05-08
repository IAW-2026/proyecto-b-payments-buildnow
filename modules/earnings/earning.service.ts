import * as financialHistoryService from '../financial-history';
import { Earnings } from './earnings.types';

export async function getEarnings(
  recipientId: string,
  recipientType: 'SELLER' | 'DELIVERY'
): Promise<Earnings> {
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