import { TransactionType } from '@/types/transactions';

export function TypeBadge({
  type,
}: {
  type: TransactionType;
}) {
  const styles = {
    PAYMENT:
      'bg-emerald-900/15 text-emerald-300 border-emerald-800/30',

    PAYOUT_SELLER:
      'bg-violet-900/15 text-violet-300 border-violet-800/30',

    PAYOUT_DELIVERY:
      'bg-cyan-900/15 text-cyan-300 border-cyan-800/30',

    COMMISSION:
      'bg-surface-container-high text-on-surface-variant border-outline-variant',
  };

  const labels = {
    PAYMENT: 'Ingreso',

    PAYOUT_SELLER: 'Pago vendedor',

    PAYOUT_DELIVERY: 'Pago repartidor',

    COMMISSION: 'Comisión',
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-md border
        px-sm py-xs text-[12px] font-medium tracking-wide
        ${styles[type]}
      `}
    >
      {labels[type]}
    </span>
  );
}