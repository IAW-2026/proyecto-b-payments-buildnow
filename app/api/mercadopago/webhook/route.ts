import { Payment } from 'mercadopago';
import { mpClient } from '@/lib/mercadopago';

import * as paymentService from '@/modules/payments/payment.service';
import * as payoutService from '@/modules/payouts/payout.service';
import * as transactionService from '@/modules/transactions/transaction.service';
import { TransactionType } from '@/lib/generated/prisma/client';

import {
    validateMercadoPagoSignature,
} from '@/modules/mercadopago/mercadopago-signature';

export async function POST(request: Request) {

    try {

        const body = await request.json();

        console.log(
            '[MP WEBHOOK BODY]',
            JSON.stringify(body, null, 2)
        );

        /**
         * Ignorar eventos que no sean payment
         */

        const eventType = body?.type || body?.topic;
        if (eventType !== 'payment') {

            console.info(
                '[MP WEBHOOK][INFO] Ignored event',
                {
                    type: body?.type,
                    topic: body?.topic,
                }
            );

            return Response.json({
                ignored: true,
            });
        }

        /**
         * Obtener payment id
         */
        const url = new URL(request.url);

        const dataId =
            url.searchParams.get('data.id') ||
            body?.data?.id;

        if (!dataId) {

            console.warn(
                '[MP WEBHOOK][WARN] Missing payment id'
            );

            return Response.json(
                {
                    error: 'Missing data.id',
                },
                {
                    status: 400,
                }
            );
        }


        /**
         * Validar firma HMAC
         * 
        if (process.env.NODE_ENV === 'production') {

            const isValid =
                validateMercadoPagoSignature(
                    request,
                    dataId
                );

            if (!isValid) {

                console.warn(
                    '[MP WEBHOOK][WARN] Invalid signature',
                    {
                        dataId,
                    }
                );

                return Response.json(
                    {
                        error: 'Invalid signature',
                    },
                    {
                        status: 401,
                    }
                );
            }

            console.info(
                '[MP WEBHOOK][INFO] Signature verified',
                {
                    dataId,
                }
            );
        }
        else {
            console.info(
                '[MP WEBHOOK][DEV] Signature validation skipped'
            );
        }
            */

        console.info(
            '[MP WEBHOOK][DEV] Signature validation skipped'
        );
        /**
         * Buscar pago real en MercadoPago
         */
        const paymentClient =
            new Payment(mpClient);


        console.log('la ide es: ', { dataId });
        const paymentInfo =
            await paymentClient.get({
                id: dataId,
            });

        console.info(
            '[MP PAYMENT INFO]',
            {
                id: paymentInfo.id,
                status: paymentInfo.status,
                externalReference:
                    paymentInfo.external_reference,
            }
        );

        const mercadopagoId =
            String(paymentInfo.id);

        const mercadopagoStatus =
            paymentInfo.status;

        const externalReference =
            paymentInfo.external_reference;

        if (!externalReference) {

            console.warn(
                '[MP WEBHOOK][WARN] Missing external reference',
                {
                    dataId,
                }
            );

            return Response.json({
                ok: true,
            });
        }

        /**
         * Mapear estado MP → interno
         */
        const status =
            mapMercadoPagoStatus(
                mercadopagoStatus
            );

        /**
         * Actualizar payment local
         */
        const updatedPayment =
            await paymentService
                .updatePaymentStatusByOrderId(
                    externalReference,
                    {
                        status,

                        method:
                            paymentInfo.payment_method_id ?? null,

                        mercadopagoId,

                        statusDetail:
                            paymentInfo.status_detail ?? null,

                        payerEmail:
                            paymentInfo.payer?.email ?? null,

                        paidAt:
                            paymentInfo.date_approved
                                ? new Date(
                                    paymentInfo.date_approved
                                )
                                : null,
                    }
                );

        console.info(
            '[MP WEBHOOK][INFO] Payment updated',
            {
                externalReference,
                status,
                mercadopagoId,
                updated: !!updatedPayment,
            }
        );

        /**
         * Registrar transaction para el nuevo estado
         * (idempotente: no duplica si ya existe)
         */
        if (updatedPayment) {
            await transactionService
                .createTransactionIfNotExists({
                    paymentId: updatedPayment.id,
                    orderId: updatedPayment.orderId,
                    amount: updatedPayment.amount,
                    type: TransactionType.PAYMENT,
                    status,
                });

            if (status === 'APPROVED') {

                const sellerAmount =
                    updatedPayment.amount.mul(0.90);

                const deliveryAmount =
                    updatedPayment.amount.mul(0.05);

                const platformAmount =
                    updatedPayment.amount.mul(0.05);

                await payoutService
                    .createPayoutIfNotExists({
                        orderId: updatedPayment.orderId,
                        recipientType: 'SELLER',
                        amount: sellerAmount,
                    });

                await payoutService
                    .createPayoutIfNotExists({
                        orderId: updatedPayment.orderId,
                        recipientType: 'DELIVERY',
                        amount: deliveryAmount,
                    });

                await transactionService.createTransactionIfNotExists({
                    paymentId: updatedPayment.id,
                    orderId: updatedPayment.orderId,
                    amount: platformAmount,
                    type: TransactionType.COMMISSION,
                    status: 'APPROVED',
                });

                await transactionService.createTransactionIfNotExists({
                    paymentId: updatedPayment.id,
                    orderId: updatedPayment.orderId,
                    amount: deliveryAmount,

                    type: TransactionType.PAYOUT_DELIVERY,

                    status: 'PENDING',
                });

                await transactionService.createTransactionIfNotExists({
                    paymentId: updatedPayment.id,
                    orderId: updatedPayment.orderId,
                    amount: sellerAmount,

                    type: TransactionType.PAYOUT_SELLER,

                    status: 'PENDING',
                });


                await notifyOrderStatus(
                    updatedPayment.orderId,
                    'CONFIRMED'
                );
            }


            if (status === 'REJECTED') {

                await notifyOrderStatus(
                    updatedPayment.orderId,
                    'CANCELLED'
                );
            }
        }

        /**
         * devolver 200 para que MP
         * no reintente el webhook
         */
        return Response.json({
            ok: true,
        });

    } catch (error) {

        console.error(
            '[MP WEBHOOK][ERROR]',
            error
        );

        return Response.json(
            {
                error:
                    'Webhook processing failed',
            },
            {
                status: 500,
            }
        );
    }
}


function mapMercadoPagoStatus(
    status?: string | null
) {

    switch (status) {
        case 'approved':
            return 'APPROVED';

        case 'rejected':
        case 'cancelled':
            return 'REJECTED';

        case 'pending':
        case 'in_process':
        default:
            return 'PENDING';
    }
}

async function notifyOrderStatus(orderId: string, status: string) {
    if (process.env.ENABLE_EXTERNAL_INTEGRATIONS !== 'true') {
        console.info(
            '[INTEGRATION][SKIPPED] Order confirmation integration disabled',
            { orderId }
        );
        return;
    }

    try {
        const response = await fetch(
            `${process.env.SELLER_API_URL}/api/orders/${orderId}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',

                    'x-internal-api-key':
                        process.env.INTERNAL_API_KEY!,
                },
                body: JSON.stringify({
                    status: status,
                }),
            }
        );

        if (!response.ok) {
            console.error(
                '[INTEGRATION][ERROR] Failed to confirm order',
                {
                    orderId,
                    status: response.status,
                }
            );
        }
    } catch (error) {
        console.error(
            '[INTEGRATION][ERROR] Order confirmation request failed',
            {
                orderId,
                error,
            }
        );
    }
}