import { ok, internalError } from '@/lib/http';
import { prisma } from '@/lib/prisma';
import { Prisma, TransactionStatus, TransactionType } from '@/lib/generated/prisma/client';

/** GET /api/control-plane/transactions — Lista paginada de transactions */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);

    const page = Math.max(1, Number(url.searchParams.get('page')) || 1);
    const limit = Math.min(100, Math.max(1, Number(url.searchParams.get('limit')) || 20));
    const status = url.searchParams.get('status') as TransactionStatus | null;
    const type = url.searchParams.get('type') as TransactionType | null;
    const search = url.searchParams.get('search');

    const skip = (page - 1) * limit;

    const where: Prisma.TransactionWhereInput = {};

    if (status && Object.values(TransactionStatus).includes(status)) {
      where.status = status;
    }

    if (type && Object.values(TransactionType).includes(type)) {
      where.type = type;
    }

    if (search) {
      where.OR = [
        { orderId: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.transaction.count({ where }),
    ]);

    return ok({
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('[ControlPlane] Error listing transactions:', error);
    return internalError();
  }
}
