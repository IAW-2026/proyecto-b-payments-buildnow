import { ok, notFound, internalError } from '@/lib/http';
import { prisma } from '@/lib/prisma';

/** GET /api/control-plane/payouts/:id — Detalle de un payout + transactions */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const payout = await prisma.payout.findUnique({
      where: { id },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!payout) {
      return notFound('Payout not found');
    }

    return ok(payout);
  } catch (error) {
    console.error('[ControlPlane] Error fetching payout detail:', error);
    return internalError();
  }
}
