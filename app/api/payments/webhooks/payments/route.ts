import { ok, badRequest, internalError } from '@/lib/http';
import { updatePaymentStatus } from '@/modules/payments';
import { recordTransaction } from '@/modules/transactions';
import {
    TransactionType,
    Prisma,
} from '@/lib/generated/prisma/client';

/** POST /api/payments/webhooks/payments — Recibir notificación de webhook de tipo payment*/
export async function POST(request: Request) {
    try {
        const body = await request.json();

        const { paymentId, status, externalReference } = body;

        if (!paymentId || !status || !externalReference) {
            return badRequest('Invalid webhook payload');
        }

        const allowedStatuses = ['PENDING', 'APPROVED', 'REJECTED'];

        if (!allowedStatuses.includes(status)) {
            return badRequest('Invalid payment status');
        }

        const updatedPayment = await updatePaymentStatus(paymentId, status);

        if (!updatedPayment) {
            return badRequest(`Payment ${paymentId} not found`);
        }

        await recordTransaction({
            paymentId,
            orderId: updatedPayment.orderId,
            amount: updatedPayment.amount,
            type: TransactionType.PAYMENT,
            status,
        });

        if (status === 'APPROVED') {
            const commissionAmount = new Prisma.Decimal(updatedPayment.amount)
                .mul(0.1);

            await recordTransaction({
                paymentId,
                orderId: updatedPayment.orderId,
                amount: commissionAmount,
                type: TransactionType.COMMISSION,
                status: 'APPROVED',
            });
        }

        return ok({ received: true });
    } catch (error) {
        console.error('Error processing webhook:', error);
        return internalError();
    }
}