'use server';

import { TransactionStatus, TransactionType } from '@/lib/generated/prisma/client';
import { getTransactionsPaginated } from './transaction.service';

export interface FetchTransactionsActionParams {
  page: number;
  limit: number;
  status?: TransactionStatus;
  type?: TransactionType;
  search?: string;
}

export async function fetchTransactionsAction(params: FetchTransactionsActionParams) {
  // TODO: Validate admin permissions here
  // e.g. const session = await auth(); if (!session.user.isAdmin) throw new Error('Unauthorized');

  const { transactions, pagination } = await getTransactionsPaginated(params);

  // Serialize Prisma Decimal to string for Server Actions/Client Components
  const serializedTransactions = transactions.map((t) => ({
    ...t,
    amount: t.amount.toString(),
  }));

  return {
    transactions: serializedTransactions,
    pagination,
  };
}
