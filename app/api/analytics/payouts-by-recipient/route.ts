// app/api/control-plane/payments/analytics/payouts-by-recipient/route.ts

import { prisma } from '@/lib/prisma';
import { ok, internalError } from '@/lib/http';
import { RecipientType } from '@/lib/generated/prisma/client';

export async function GET() {
    try {
        const [seller, delivery] = await Promise.all([
            prisma.payout.aggregate({
                where: {
                    recipientType: RecipientType.SELLER,
                },
                _sum: {
                    amount: true,
                },
            }),

            prisma.payout.aggregate({
                where: {
                    recipientType: RecipientType.DELIVERY,
                },
                _sum: {
                    amount: true,
                },
            }),
        ]);

        return ok({
            sellers: Number(seller._sum.amount ?? 0),
            delivery: Number(delivery._sum.amount ?? 0),
        });
    } catch (error) {
        console.error(error);
        return internalError();
    }
}