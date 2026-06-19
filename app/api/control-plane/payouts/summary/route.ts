import { ok, internalError } from '@/lib/http';
import { prisma } from '@/lib/prisma';

/** GET /api/control-plane/payouts/summary — Contadores por status */
export async function GET() {
  try {
    const [total, pending, approved, rejected] = await Promise.all([
      prisma.payout.count(),
      prisma.payout.count({ where: { status: 'PENDING' } }),
      prisma.payout.count({ where: { status: 'APPROVED' } }),
      prisma.payout.count({ where: { status: 'REJECTED' } }),
    ]);

    return ok({
      total,
      pending,
      approved,
      rejected,
    });
  } catch (error) {
    console.error('[ControlPlane] Error fetching payout summary:', error);
    return internalError();
  }
}
