'use server';

import { TransactionStatus } from '@/lib/generated/prisma/client';
import { DashboardTransactionFilter } from '@/types/transactions';
import { requireAuth } from '@/lib/auth';
import { getTransactionsPaginated } from './transaction.service';

export interface FetchTransactionsActionParams {
  page: number;
  limit: number;
  status?: TransactionStatus;
  type?: DashboardTransactionFilter;
  search?: string;
}

export async function fetchTransactionsAction(params: FetchTransactionsActionParams) {
  await requireAuth('admin');

  const { transactions, pagination } = await getTransactionsPaginated(params);

  const serializedTransactions = transactions.map((t) => ({
    ...t,
    amount: t.amount.toString(),
  }));

  return {
    transactions: serializedTransactions,
    pagination,
  };
}