import { createPayout, getPayoutsByRecipient } from '@/modules/payouts';
import { ok, forbidden, created, internalError, badRequest, unauthorized } from '@/lib/http';
import { requireAuth } from '@/lib/auth';
import { RecipientType } from '@/lib/generated/prisma/enums';

/** GET — Listar payouts por recipient */
export async function GET() {
  try {
    const { userId, roles } = await requireAuth();

    if (!userId) {
      return unauthorized('Unauthorized');
    }

    const hasAccess =
      roles.includes('SELLER') ||
      roles.includes('DELIVERY');

    if (!hasAccess) {
      return forbidden(
        'Requires SELLER or DELIVERY role'
      );
    }

    const recipientType: RecipientType =
      roles.includes('SELLER')
        ? 'SELLER'
        : 'DELIVERY';

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

    const { userId, roles } = await requireAuth();

    if (!userId) {
      return unauthorized('Unauthorized');
    }

    const hasAccess =
      roles.includes('SELLER') ||
      roles.includes('DELIVERY');

    if (!hasAccess) {
      return forbidden(
        'Requires SELLER or DELIVERY role'
      );
    }

    const recipientType: RecipientType =
      roles.includes('SELLER')
        ? 'SELLER'
        : 'DELIVERY';

    const { orderId, amount } = body;

    if (!orderId || amount == null) {
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