// app/api/control-plane/payments/analytics/rejected-payments/route.ts

import { prisma } from '@/lib/prisma';
import { ok, internalError } from '@/lib/http';
import { PaymentStatus } from '@/lib/generated/prisma/client';

export async function GET() {
    try {
        const items = await prisma.payment.findMany({
            where: {
                status: PaymentStatus.REJECTED,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 10,
            select: {
                id: true,
                orderId: true,
                payerEmail: true,
                amount: true,
                createdAt: true,
            },
        });

        return ok(items);
    } catch (error) {
        console.error(error);
        return internalError();
    }
}