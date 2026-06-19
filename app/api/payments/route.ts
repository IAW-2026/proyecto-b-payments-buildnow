import {
  createPayment,
  getPaymentByOrderIdAndUserId,
} from '@/modules/payments';

import {
  ok,
  created,
  internalError,
  badRequest,
  unauthorized,
} from '@/lib/http';

import { Prisma } from '@/lib/generated/prisma/client';

import * as mercadopagoService from '@/modules/mercadopago/mercadopago.service';

import { requireAuth } from '@/lib/auth';

/** GET /api/payments?orderId=xx */
export async function GET(
  request: Request
) {
  try {
    const url = new URL(request.url);

    const orderId =
      url.searchParams.get(
        'orderId'
      );

    const { userId } =
      await requireAuth(
        'buyer'
      );

    if (!userId) {
      return unauthorized(
        'Unauthorized'
      );
    }

    if (!orderId) {
      return badRequest(
        'orderId is required'
      );
    }

    const payment =
      await getPaymentByOrderIdAndUserId(
        orderId,
        userId
      );

    return ok(payment);
  } catch (error) {
    console.error(
      'Error listing payments:',
      error
    );

    return internalError();
  }
}

/** POST /api/payments */
export async function POST(
  request: Request
) {
  try {
    const { userId } =
      await requireAuth(
        'buyer'
      );

    const body =
      await request.json();

    const {
      orderId,
      items,
      totalAmount,
    } = body;

    if (!orderId) {
      return badRequest(
        'orderId is required'
      );
    }

    if (
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return badRequest(
        'items is required'
      );
    }

    if (
      totalAmount == null
    ) {
      return badRequest(
        'totalAmount is required'
      );
    }

    /** 1. Crear Preference MP */
    const preference =
      await mercadopagoService.createPreference(
        {
          items,
          externalReference:
            orderId,
        }
      );

    /** 2. Crear Payment local */
    const payment =
      await createPayment({
        userId,
        orderId,
        amount:
          new Prisma.Decimal(
            totalAmount
          ),
        method: null,
        preferenceId:
          preference.preferenceId,
        externalReference:
          orderId,
      });

    /** 3. Response */
    return created({
      payment,
      initPoint:
        preference.initPoint
    });
  } catch (error) {
    console.error(
      'Error creating payment:',
      error
    );

    return internalError();
  }
}