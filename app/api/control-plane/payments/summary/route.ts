import { ok, internalError } from '@/lib/http';
import { prisma } from '@/lib/prisma';

/** GET /api/control-plane/payments/summary — Contadores por status */
export async function GET() {
  try {
    const [total, approved, pending, rejected] = await Promise.all([
      prisma.payment.count(),
      prisma.payment.count({ where: { status: 'APPROVED' } }),
      prisma.payment.count({ where: { status: 'PENDING' } }),
      prisma.payment.count({ where: { status: 'REJECTED' } }),
    ]);

    return ok({
      total,
      approved,
      pending,
      rejected,
    });
  } catch (error) {
    console.error('[ControlPlane] Error fetching payment summary:', error);
    return internalError();
  }
}
