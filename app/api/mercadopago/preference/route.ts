import { Preference } from "mercadopago";
import { mpClient } from "@/lib/mercadopago";
import * as paymentService from "@/modules/payments/payment.service";
import { Prisma } from '@/lib/generated/prisma/client';

export const runtime = "nodejs";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function POST() {
    try {

        //MOCK BODY **BUYER**
        const body = {
            orderId: crypto.randomUUID(),

            buyerId: 'buyer-456',

            items: [
                {
                    id: 'product-1',
                    title: 'Hamburguesa',
                    quantity: 2,
                    unit_price: 500,
                },
            ],

            totalAmount: 1000,
        };

        const orderId = body.orderId;
        const externalReference = orderId;
        const amount = new Prisma.Decimal(body.totalAmount);

        const preference = new Preference(mpClient);

        const result = await preference.create({
            body: {
                items: body.items,

                external_reference: externalReference,

                notification_url: `${SITE_URL}/api/mercadopago/webhook`,

                back_urls: {
                    success: `${SITE_URL}/success`,
                    failure: `${SITE_URL}/failure`,
                    pending: `${SITE_URL}/pending`,
                },

                auto_return: "approved",
            },
        });

        await paymentService.createPayment({
            userId: body.buyerId,

            orderId,

            amount,

            method: "mercadopago",

            preferenceId: result.id!,
            externalReference,
        });

        console.log(
            "[MercadoPago Preference] Created successfully:",
            result.id
        );

        return Response.json({
            id: result.id,
            init_point: result.init_point,
            sandbox_init_point: result.sandbox_init_point,
        });
    } catch (error: unknown) {
        console.error(
            "[MercadoPago Preference] Error creating preference:",
            error
        );

        const message =
            error instanceof Error
                ? error.message
                : "Unknown error creating preference";

        return Response.json(
            {
                error: "Failed to create preference",
                details: message,
            },
            { status: 500 }
        );
    }
}