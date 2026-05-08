// API Route: /api/payments/payouts
// TODO: Implementar lógica real de payouts

import { createPayout, getPayoutsByRecipient } from '@/modules/payouts';
import { ok, created, internalError, badRequest } from '@/lib/http';

/** GET — Listar payouts por recipient */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);

    const recipientId = url.searchParams.get('recipientId');
    const recipientType = url.searchParams.get('recipientType');

    if (!recipientId || !recipientType) {
      return badRequest('recipientId and recipientType are required');
    }

    if (recipientType !== 'SELLER' && recipientType !== 'DELIVERY') {
      return badRequest('recipientType must be SELLER or DELIVERY');
    }

    const payouts = await getPayoutsByRecipient(
      recipientId,
      recipientType
    );

    return ok(payouts);
  } catch (error) {
    console.error('Error listing payouts:', error);
    return internalError();
  }
}

/** POST /api/payments/payouts — Crear un nuevo payout */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { orderId, recipientId, recipientType, amount } = body;

    if (!orderId || !recipientId || !recipientType || amount == null) {
      return badRequest('Missing required fields');
    }

    const payout = await createPayout({
      orderId,
      recipientId,
      recipientType,
      amount,
    });

    return created(payout);
  } catch (error) {
    console.error('Error creating payout:', error);
    return internalError();
  }
}
