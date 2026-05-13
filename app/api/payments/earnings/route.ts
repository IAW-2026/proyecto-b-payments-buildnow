import { ok, badRequest, internalError } from '@/lib/http';
import { getEarningsByRecipient } from '@/modules/earnings';
import { RecipientType } from '@/lib/generated/prisma/client';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);

    const recipientId = url.searchParams.get('recipientId');
    const recipientType = url.searchParams.get('recipientType');

    if (!recipientId || !recipientType) {
      return badRequest('recipientId and recipientType are required');
    }

    if (
      recipientType !== 'SELLER' &&
      recipientType !== 'DELIVERY'
    ) {
      return badRequest(
        'recipientType must be SELLER or DELIVERY'
      );
    }

    const earnings = await getEarningsByRecipient(
      recipientId,
      recipientType as RecipientType
    );

    return ok(earnings);
  } catch (error) {
    console.error('Error getting earnings:', error);
    return internalError();
  }
}