import { ok, internalError } from '@/lib/http';
import { prisma } from '@/lib/prisma';
import { Prisma, PaymentStatus } from '@/lib/generated/prisma/client';

/** GET /api/control-plane/payments — Lista paginada de payments */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);

    const page = Math.max(1, Number(url.searchParams.get('page')) || 1);
    const limit = Math.min(100, Math.max(1, Number(url.searchParams.get('limit')) || 20));
    const status = url.searchParams.get('status') as PaymentStatus | null;
    const search = url.searchParams.get('search');

    const skip = (page - 1) * limit;

    const where: Prisma.PaymentWhereInput = {};

    if (status && Object.values(PaymentStatus).includes(status)) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { orderId: { contains: search, mode: 'insensitive' } },
        { payerEmail: { contains: search, mode: 'insensitive' } },
        { mercadopagoId: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.payment.count({ where }),
    ]);

    return ok({
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('[ControlPlane] Error listing payments:', error);
    return internalError();
  }
}
