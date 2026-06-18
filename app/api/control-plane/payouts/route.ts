import { ok, internalError } from '@/lib/http';
import { prisma } from '@/lib/prisma';
import { Prisma, PayoutStatus, RecipientType } from '@/lib/generated/prisma/client';

/** GET /api/control-plane/payouts — Lista paginada de payouts */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);

    const page = Math.max(1, Number(url.searchParams.get('page')) || 1);
    const limit = Math.min(100, Math.max(1, Number(url.searchParams.get('limit')) || 20));
    const status = url.searchParams.get('status') as PayoutStatus | null;
    const recipientType = url.searchParams.get('recipientType') as RecipientType | null;
    const search = url.searchParams.get('search');

    const skip = (page - 1) * limit;

    const where: Prisma.PayoutWhereInput = {};

    if (status && Object.values(PayoutStatus).includes(status)) {
      where.status = status;
    }

    if (recipientType && Object.values(RecipientType).includes(recipientType)) {
      where.recipientType = recipientType;
    }

    if (search) {
      where.OR = [
        { orderId: { contains: search, mode: 'insensitive' } },
        { recipientId: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.payout.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.payout.count({ where }),
    ]);

    return ok({
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('[ControlPlane] Error listing payouts:', error);
    return internalError();
  }
}
