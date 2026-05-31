'use client';

import { TransactionStatus, TransactionType, DashboardTransactionFilter } from '@/types/transactions';
import Filters from './Filters';
import Pagination from './Pagination';
import SearchInput from './SearchInput';
import { StatusBadge } from '@/components/ui/badges/StatusBadge';
import { TypeBadge } from '@/components/ui/badges/TypeBadge';
import { formatDate } from '@/lib/dates/formatDate';

type SerializedTransaction = {
  id: string;
  type: TransactionType;
  orderId: string;
  amount: string;
  status: TransactionStatus;
  createdAt: Date;
  paymentId: string | null;
  payoutId: string | null;
};

interface TransactionsClientProps {
  transactions: SerializedTransaction[];
  pagination: {
    page: number;
    totalPages: number;
    totalItems: number;
  };
  filters: {
    status?: TransactionStatus;
    type?: DashboardTransactionFilter;
    search?: string;
  };
}

export default function TransactionsClient({
  transactions,
  pagination,
  filters,
}: TransactionsClientProps) {

  return (
    <div className="flex flex-col gap-lg pb-lg">

      {/* Search + Filters */}
      <section className="industrial-card rounded-xl p-md">
        <div className="flex flex-col gap-md xl:flex-row xl:items-end">
          <div className="flex-1 min-w-[280px]">
            <label className="mb-xs block text-[12px] uppercase text-on-surface-variant">
              Search
            </label>
            <SearchInput initialSearch={filters.search} />
          </div>
          <div className="flex flex-col gap-md sm:flex-row">
            <Filters currentFilters={filters} />
          </div>
        </div>
      </section>

      {/* Table */}
      <section className="industrial-card overflow-hidden rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed border-collapse text-left">
            <colgroup>
              <col className="w-[280px]" />
              <col className="w-[120px]" />
              <col className="w-[180px]" />
              <col className="w-[130px]" />
              <col className="w-[130px]" />
              <col className="w-[120px]" />
            </colgroup>
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-high">
                <th className="px-md py-sm text-[12px] uppercase tracking-widest text-on-surface-variant">
                  Transaction ID
                </th>
                <th className="px-md py-sm text-[12px] uppercase tracking-widest text-on-surface-variant">
                  Type
                </th>
                <th className="px-md py-sm text-[12px] uppercase tracking-widest text-on-surface-variant">
                  Order ID
                </th>
                <th className="px-md py-sm text-[12px] uppercase tracking-widest text-on-surface-variant">
                  Status
                </th>
                <th className="px-md py-sm text-right text-[12px] uppercase tracking-widest text-on-surface-variant">
                  Amount
                </th>
                <th className="px-md py-sm text-[12px] uppercase tracking-widest text-on-surface-variant">
                  Created At
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-outline-variant">
              {transactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-md py-lg text-center text-on-surface-variant"
                  >
                    No transactions found.
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="transition-colors hover:bg-surface-container-highest"
                  >
                    <td className="truncate px-md py-md text-[12px] text-on-surface-variant">
                      {transaction.id}
                    </td>
                    <td className="px-md py-md">
                      <TypeBadge type={transaction.type} />
                    </td>
                    <td className="truncate px-md py-md text-[14px] text-on-surface">
                      {transaction.orderId}
                    </td>
                    <td className="px-md py-md">
                      <StatusBadge status={transaction.status} />
                    </td>
                    <td className="px-md py-md text-right text-[16px] font-semibold text-primary whitespace-nowrap">
                      ${Number(transaction.amount).toFixed(2)}
                    </td>
                    <td className="px-md py-md pr-lg text-[12px] text-on-surface-variant whitespace-nowrap">
                      {formatDate(transaction.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-md border-t border-outline-variant bg-surface-container-low px-md py-md sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[14px] text-on-surface-variant">
            Showing{' '}
            <span className="font-bold text-on-surface">
              {transactions.length}
            </span>{' '}
            of{' '}
            <span className="font-bold text-on-surface">
              {pagination.totalItems}
            </span>{' '}
            transactions
          </p>
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
          />
        </div>
      </section>
    </div>
  );
}