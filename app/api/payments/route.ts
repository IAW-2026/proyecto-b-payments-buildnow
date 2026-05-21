import { createPayment, getPaymentByOrderIdAndUserId } from '@/modules/payments';
import { ok, created, internalError, forbidden, badRequest, unauthorized } from '@/lib/http';
import { requireAuth } from '@/lib/auth';

/** GET /API/payments?orderId=xx */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const orderId = url.searchParams.get('orderId');

    const { userId, roles } = await requireAuth();

    if (!userId) {
      return unauthorized('Unauthorized');
    }

    const isBuyer = roles.includes('BUYER');

    if (!isBuyer) {
      return forbidden('Requires BUYER role');
    }

    if (!orderId) {
      return badRequest('orderId is required');
    }

    const payment =
      await getPaymentByOrderIdAndUserId(orderId, userId);

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

    const { userId, roles } = await requireAuth();

    if (!userId) {
      return unauthorized('Unauthorized');
    }

    const isBuyer = roles.includes('BUYER');

    if (!isBuyer) {
      return forbidden('Requires BUYER role');
    }

    const { orderId, amount, method } = body;

    if (!orderId || amount == null || !method) {
      return badRequest('Missing required fields');
    }

    const payment = await createPayment({
      orderId,
      amount,
      method,
      userId,
    });

    return created(payment);
  } catch (error) {
    console.error('Error creating payment:', error);
    return internalError();
  }
}