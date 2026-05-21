import { ok, internalError, unauthorized, forbidden } from '@/lib/http';
import { getEarningsByRecipient } from '@/modules/earnings';
import { RecipientType } from '@/lib/generated/prisma/client';
import { requireAuth } from '@/lib/auth';

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

    const earnings = await getEarningsByRecipient(
      userId,
      recipientType
    );

    return ok(earnings);
  } catch (error) {
    console.error(error);
    return internalError();
  }
}