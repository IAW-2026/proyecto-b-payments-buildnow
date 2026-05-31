import { TransactionStatus, TransactionType } from '@/lib/generated/prisma/client';
import { fetchTransactionsAction } from '@/modules/transactions/transaction.actions';
import TransactionsClient from './TransactionsClient';

interface TransactionsPageProps {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}

const VALID_STATUSES: TransactionStatus[] = [
  'PENDING',
  'APPROVED',
  'REJECTED',
];

const VALID_TYPES: TransactionType[] = [
  'PAYMENT',
  'PAYOUT',
  'COMMISSION',
];

export default async function TransactionsPage({
  searchParams,
}: TransactionsPageProps) {
  const params = await searchParams;

  // Search validation
  const search = typeof params.search === 'string' ? params.search : undefined;

  // Page validation
  const rawPage =
    typeof params.page === 'string'
      ? parseInt(params.page, 10)
      : 1;

  const page =
    !isNaN(rawPage) && rawPage > 0
      ? rawPage
      : 1;

  // Status validation
  const status =
    typeof params.status === 'string' &&
      VALID_STATUSES.includes(
        params.status as TransactionStatus
      )
      ? (params.status as TransactionStatus)
      : undefined;

  // Type validation
  const type =
    typeof params.type === 'string' &&
      VALID_TYPES.includes(
        params.type as TransactionType
      )
      ? (params.type as TransactionType)
      : undefined;

  const limit = 10;

  const data = await fetchTransactionsAction({
    page,
    limit,
    status,
    type,
    search,
  });

  return (
    <TransactionsClient
      transactions={data.transactions}
      pagination={data.pagination}
      filters={{ status, type, search }}
    />
  );
}