import { ok, internalError, badRequest, forbidden } from '@/lib/http';
import { getEarningsByRecipient } from '@/modules/earnings';
import { RecipientType } from '@/lib/generated/prisma/client';
import { requireAuth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { userId, roles } =
      await requireAuth(
        'seller',
        'delivery'
      );

    const url = new URL(request.url);

    const recipientType =
      url.searchParams.get(
        'recipientType'
      ) as RecipientType | null;

    if (
      recipientType !== 'SELLER' &&
      recipientType !== 'DELIVERY'
    ) {
      return badRequest(
        'Invalid recipientType'
      );
    }

    const roleByRecipientType = {
      SELLER: 'seller',
      DELIVERY: 'delivery',
    } as const;


    if (!roles.includes(roleByRecipientType[recipientType])) {
      return forbidden(
        `User does not have ${recipientType} role`
      );
    }

    const earnings =
      await getEarningsByRecipient(
        userId,
        recipientType
      );

    return ok(earnings);
  } catch (error) {
    console.error(error);
    return internalError();
  }
}