import { TransactionType } from '@/lib/generated/prisma/client';

export function TypeBadge({ type }: { type: TransactionType }) {
  const styles = {
    PAYMENT:
      'bg-primary/10 text-primary border-primary/20',

    PAYOUT:
      'bg-secondary/10 text-secondary border-secondary/20',

    COMMISSION:
      'bg-surface-container-high text-on-surface-variant border-outline-variant',
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-md border
        px-sm py-xs text-[12px] font-medium tracking-wide
        ${styles[type]}
      `}
    >
      {type}
    </span>
  );
}