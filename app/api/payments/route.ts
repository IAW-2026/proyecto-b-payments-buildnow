import { createPayment, getPaymentByOrderIdAndUserId } from '@/modules/payments';
import { ok, created, internalError, badRequest, unauthorized } from '@/lib/http';
import { auth } from '@clerk/nextjs/server';
import { Prisma } from '@/lib/generated/prisma/client';
import * as mercadopagoService from '@/modules/mercadopago/mercadopago.service';


/** GET /API/payments?orderId=xx */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const orderId = url.searchParams.get('orderId');

    const { userId } = await auth();

    if (!userId) {
      return unauthorized('Unauthorized');
    }

    if (!orderId) {
      return badRequest('orderId is required');
    }

    const payment = await getPaymentByOrderIdAndUserId(orderId, userId);

    return ok(payment);
  } catch (error) {
    console.error('Error listing payments:', error);
    return internalError();
  }
}

/** POST /api/payments */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (process.env.NODE_ENV === 'production') {
      const { userId } = await auth();
      if (!userId) {
        return unauthorized('Unauthorized');
      }
    }
    /**UserID para pruebas */
    const userId = 'prueba-1';

    const { orderId, items, totalAmount } = body;

    if (!orderId) {
      return badRequest('orderId is required');
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return badRequest('items is required');
    }

    if (totalAmount == null) {
      return badRequest('totalAmount is required');
    }

    const mpItems = items.map((item: any) => ({
      title: item.title,
      quantity: item.quantity,
      unit_price: Number(item.unit_price),
      currency_id: 'ARS'
    }));

    /** 1. Crear Preference MP */
    const preference =
      await mercadopagoService.createPreference({
        items,
        externalReference: orderId,
      });

    /** 2. Crear Payment local */
    const payment = await createPayment({
      userId,
      orderId,
      amount: new Prisma.Decimal(totalAmount),
      method: 'mercadopago',
      preferenceId: preference.preferenceId,
      externalReference: orderId,
    });

    /** 3. Response */
    return created({
      payment,
      preferenceId: preference.preferenceId,
      initPoint: preference.initPoint,
      sandboxInitPoint: preference.sandboxInitPoint,
    });

  } catch (error) {
    console.error('Error creating payment:', error);
    return internalError();
  }
}
