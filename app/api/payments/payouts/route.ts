import { createPayout, getPayoutsByRecipient } from '@/modules/payouts';
import { ok, created, internalError, badRequest, unauthorized } from '@/lib/http';
import { auth } from '@clerk/nextjs/server';

/** GET — Listar payouts por recipient */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);

    const recipientType = url.searchParams.get('recipientType');

    const { userId } = await auth();

    if (!userId) {
      return unauthorized('Unauthorized');
    }

    if (!recipientType) {
      return badRequest('recipientType are required');
    }

    if (recipientType !== 'SELLER' && recipientType !== 'DELIVERY') {
      return badRequest('recipientType must be SELLER or DELIVERY');
    }

    const payouts = await getPayoutsByRecipient(
      userId,
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

    const { userId } = await auth();

    if (!userId) {
      return unauthorized('Unauthorized');
    }

    const { orderId, recipientType, amount } = body;

    if (!orderId || !recipientType || amount == null) {
      return badRequest('Missing required fields');
    }

    const payout = await createPayout({
      orderId,
      userId,
      recipientType,
      amount,
    });

    return created(payout);
  } catch (error) {
    console.error('Error creating payout:', error);
    return internalError();
  }
}
