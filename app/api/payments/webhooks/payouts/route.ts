import {
    ok,
    badRequest,
    internalError,
} from '@/lib/http';

import {
    updatePayoutStatus,
    getPayoutById,
} from '@/modules/payouts';

import { recordTransaction } from '@/modules/transactions';

import {
    TransactionType,
    TransactionStatus,
} from '@/lib/generated/prisma/client';

/** POST /api/payments/webhooks/payouts */
export async function POST(request: Request) {
    try {
        const body = await request.json();

        const {
            payoutId,
            status,
        } = body;

        if (!payoutId || !status) {
            return badRequest(
                'Invalid payout webhook payload'
            );
        }

        const allowedStatuses = [
            'PENDING',
            'COMPLETED',
            'REJECTED'
        ];

        if (!allowedStatuses.includes(status)) {
            return badRequest(
                'Invalid payout status'
            );
        }

        const payout = await getPayoutById(
            payoutId
        );

        if (!payout) {
            return badRequest(
                `Payout ${payoutId} not found`
            );
        }

        const updatedPayout = await updatePayoutStatus(payoutId, status);

        let transactionStatus: TransactionStatus;

        switch (status) {
            case 'COMPLETED':
                transactionStatus = TransactionStatus.APPROVED;
                break;

            case 'REJECTED':
                transactionStatus = TransactionStatus.REJECTED;
                break;

            default:
                transactionStatus = TransactionStatus.PENDING;
        }

        await recordTransaction({
            type: TransactionType.PAYOUT,
            orderId: updatedPayout.orderId,
            amount: updatedPayout.amount,
            status: transactionStatus,
            payoutId: updatedPayout.id,
        });

        return ok({
            received: true,
            payout: updatedPayout,
        });

    } catch (error) {

        console.error(
            'Error processing payout webhook:',
            error
        );

        return internalError();
    }
}