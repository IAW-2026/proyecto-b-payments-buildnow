'use client';

import { TransactionStatus, DashboardTransactionFilter } from '@/types/transactions';
import { useRouter, useSearchParams } from 'next/navigation';

interface FiltersProps {
  currentFilters: {
    status?: TransactionStatus;
    type?: DashboardTransactionFilter;
  };
}

export default function Filters({ currentFilters }: FiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
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
      <div className="space-y-xs">
        <label htmlFor="status" className="block text-[12px] uppercase tracking-wide text-on-surface-variant">
          Estado
        </label>
        <select
          id="status"
          value={currentFilters.status || ''}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className={selectStyles}
        >
          <option value="">Todos</option>
          <option value="PENDING">Pendiente</option>
          <option value="APPROVED">Aprobado</option>
          <option value="REJECTED">Rechazado</option>
        </select>
      </div>

      <div className="space-y-xs">
        <label htmlFor="type" className="block text-[12px] uppercase tracking-wide text-on-surface-variant">
          Tipo
        </label>
        <select
          id="type"
          value={currentFilters.type || ''}
          onChange={(e) => handleFilterChange('type', e.target.value)}
          className={selectStyles}
        >
          <option value="">Todos</option>
          <option value="PAYMENT">Cobros</option>
          <option value="PAYOUT">Pagos emitidos</option>
          <option value="COMMISSION">Comisiones</option>
        </select>
      </div>
    </div>
  );
}