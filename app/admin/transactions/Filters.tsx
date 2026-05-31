'use client';

import {
  TransactionStatus,
  TransactionType,
} from '@/lib/generated/prisma/client';

import { useRouter, useSearchParams } from 'next/navigation';

interface FiltersProps {
  currentFilters: {
    status?: TransactionStatus;
    type?: TransactionType;
  };
}

export default function Filters({
  currentFilters,
}: FiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilterChange = (
    key: string,
    value: string
  ) => {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    // Reset pagination on filter change
    params.set('page', '1');

    router.push(`?${params.toString()}`);
  };

  const selectStyles = `
    min-w-[160px]
    rounded-lg
    border border-outline-variant
    bg-surface-container-lowest
    px-md py-sm
    text-[14px]
    text-on-surface
    transition-colors
    appearance-none
    focus:border-primary
    focus:outline-none
  `;

  return (
    <div className="flex flex-col gap-md sm:flex-row">

      {/* Status */}
      <div className="space-y-xs">
        <label
          htmlFor="status"
          className="
            block text-[12px]
            uppercase tracking-wide
            text-on-surface-variant
          "
        >
          Status
        </label>

        <select
          id="status"
          value={currentFilters.status || ''}
          onChange={(e) =>
            handleFilterChange(
              'status',
              e.target.value
            )
          }
          className={selectStyles}
        >
          <option value="">All Statuses</option>
          <option value="PENDING">PENDING</option>
          <option value="APPROVED">APPROVED</option>
          <option value="REJECTED">REJECTED</option>
        </select>
      </div>

      {/* Type */}
      <div className="space-y-xs">
        <label
          htmlFor="type"
          className="
            block text-[12px]
            uppercase tracking-wide
            text-on-surface-variant
          "
        >
          Type
        </label>

        <select
          id="type"
          value={currentFilters.type || ''}
          onChange={(e) =>
            handleFilterChange(
              'type',
              e.target.value
            )
          }
          className={selectStyles}
        >
          <option value="">All Types</option>
          <option value="PAYMENT">PAYMENT</option>
          <option value="PAYOUT">PAYOUT</option>
          <option value="COMMISSION">COMMISSION</option>
        </select>
      </div>
    </div>
  );
}