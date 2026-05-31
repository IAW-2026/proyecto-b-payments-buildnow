import { TransactionType } from '@/types/transactions';

export function TypeBadge({
  type,
}: {
  type: TransactionType;
}) {

  const styles = {
    PAYMENT:
      'bg-primary/10 text-primary border-primary/20',

    PAYOUT_SELLER:
      'bg-secondary/10 text-secondary border-secondary/20',

    PAYOUT_DELIVERY:
      'bg-secondary/10 text-secondary border-secondary/20',

    COMMISSION:
      'bg-surface-container-high text-on-surface-variant border-outline-variant',
  };

  const label =
  type === 'PAYOUT_SELLER' || type === 'PAYOUT_DELIVERY'
    ? 'PAYOUT'
    : type;

  return (
    <span
      className={`
        inline-flex items-center rounded-md border
        px-sm py-xs text-[12px] font-medium tracking-wide
        ${styles[type]}
      `}
    >
      {label}
    </span>
  );
}