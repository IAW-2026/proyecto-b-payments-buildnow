import { prisma } from '@/lib/prisma';
import { ok, internalError } from '@/lib/http';
import { PaymentStatus, TransactionType } from '@/lib/generated/prisma/client';

export async function GET() {
    try {
        const [
            revenue,
            approvedCount,
            payouts,
            commissions
        ] = await Promise.all([
            prisma.payment.aggregate({
                where: { status: PaymentStatus.APPROVED },
                _sum: { amount: true },
            }),

            prisma.payment.count({
                where: { status: PaymentStatus.APPROVED },
            }),

            prisma.transaction.aggregate({
                where: {
                    type: {
                        in: [
                            TransactionType.PAYOUT_DELIVERY,
                            TransactionType.PAYOUT_SELLER,
                        ],
                    },
                },
                _sum: { amount: true },
            }),

            prisma.transaction.aggregate({
                where: {
                    type: TransactionType.COMMISSION,
                },
                _sum: { amount: true },
            }),
        ]);

        return ok({
            totalRevenue: Number(revenue._sum.amount ?? 0),
            approvedPayments: approvedCount,
            totalPayouts: Number(payouts._sum.amount ?? 0),
            platformCommissions: Number(commissions._sum.amount ?? 0),
        });
    } catch (error) {
        console.error(error);
        return internalError();
    }
}