import { ok, badRequest, internalError, unauthorized } from '@/lib/http';
import { getEarningsByRecipient } from '@/modules/earnings';
import { RecipientType } from '@/lib/generated/prisma/client';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);

    const recipientType = url.searchParams.get('recipientType');

    const { userId, sessionClaims } = await auth();
    const role = sessionClaims?.metadata?.role;

    if (!userId) {
      return unauthorized('Unauthorized');
    }


    if (!role) {
      return badRequest('recipientId and recipientType are required');
    }

    if (
      role !== 'SELLER' &&
      role !== 'DELIVERY'
    ) {
      return badRequest(
        'recipientType must be SELLER or DELIVERY'
      );
    }

    const earnings = await getEarningsByRecipient(
      userId,
      role as RecipientType
    );

    return ok(earnings);
  } catch (error) {
    console.error('Error getting earnings:', error);
    return internalError();
  }
}