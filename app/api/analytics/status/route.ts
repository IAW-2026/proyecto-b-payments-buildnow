import { prisma } from '@/lib/prisma';
import { ok, internalError } from '@/lib/http';
import { PaymentStatus } from '@/lib/generated/prisma/client';

export async function GET() {
    try {
        const [approved, pending, rejected] = await Promise.all([
            prisma.payment.count({
                where: { status: PaymentStatus.APPROVED },
            }),
            prisma.payment.count({
                where: { status: PaymentStatus.PENDING },
            }),
            prisma.payment.count({
                where: { status: PaymentStatus.REJECTED },
            }),
        ]);

        return ok({
            approved,
            pending,
            rejected,
        });
    } catch (error) {
        console.error(error);
        return internalError();
    }
}