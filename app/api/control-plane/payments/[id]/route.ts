import { ok, notFound, internalError } from '@/lib/http';
import { prisma } from '@/lib/prisma';

/** GET /api/control-plane/payments/:id — Detalle de un payment + transactions */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!payment) {
      return notFound('Payment not found');
    }

    return ok(payment);
  } catch (error) {
    console.error('[ControlPlane] Error fetching payment detail:', error);
    return internalError();
  }
}
