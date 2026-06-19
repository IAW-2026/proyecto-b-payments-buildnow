import { TransactionStatus } from '@/lib/generated/prisma/client';

export function StatusBadge({
  status,
}: {
  status: TransactionStatus;
}) {
  const styles = {
    APPROVED:
      'bg-green-900/30 text-green-400 border-green-800/50',

    PENDING:
      'bg-amber-900/30 text-amber-400 border-amber-800/50',

    REJECTED:
      'bg-red-900/30 text-red-400 border-red-800/50',
  };

  const labels = {
    APPROVED: 'APROBADO',
    PENDING: 'PENDIENTE',
    REJECTED: 'RECHAZADO',
  };

  return (
    <span
      className={`
        rounded-md border px-2 py-1
        text-xs font-medium
        ${styles[status]}
      `}
    >
      {labels[status]}
    </span>
  );
}