import { TransactionStatus } from '@/types/transactions';
import { DashboardTransactionFilter } from '@/types/transactions';
import { fetchTransactionsAction } from '@/modules/transactions/transaction.actions';
import TransactionsClient from './TransactionsClient';

interface TransactionsPageProps {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}

const VALID_STATUSES: TransactionStatus[] = ['PENDING', 'APPROVED', 'REJECTED'];

const VALID_TYPES: DashboardTransactionFilter[] = ['PAYMENT', 'PAYOUT', 'COMMISSION'];

export default async function TransactionsPage({ searchParams }: TransactionsPageProps) {
  
  const params = await searchParams;

  const search = typeof params.search === 'string' ? params.search : undefined;

  const rawPage = typeof params.page === 'string' ? parseInt(params.page, 10) : 1;
  const page = !isNaN(rawPage) && rawPage > 0 ? rawPage : 1;

  const status =
    typeof params.status === 'string' &&
    VALID_STATUSES.includes(params.status as TransactionStatus)
      ? (params.status as TransactionStatus)
      : undefined;

  const type =
    typeof params.type === 'string' &&
    VALID_TYPES.includes(params.type as DashboardTransactionFilter)
      ? (params.type as DashboardTransactionFilter)
      : undefined;

  const limit = 10;

  const data = await fetchTransactionsAction({ page, limit, status, type, search });

  return (
    <TransactionsClient
      transactions={data.transactions}
      pagination={data.pagination}
      filters={{ status, type, search }}
    />
  );
}