import {
  ok,
  internalError,
  badRequest,
  forbidden,
} from '@/lib/http';

import {
  getEarningsByRecipient,
} from '@/modules/earnings';

import {
  RecipientType,
} from '@/lib/generated/prisma/client';

import { requireAuth } from '@/lib/auth';

export async function GET(
  request: Request
) {
  try {
    const { userId, roles } =
      await requireAuth(
        'seller',
        'delivery'
      );

    const url = new URL(request.url);

    const recipientType =
      url.searchParams
        .get('recipientType')
        ?.toLowerCase();

    if (
      recipientType !== 'seller' &&
      recipientType !== 'delivery'
    ) {
      return badRequest(
        'Invalid recipientType'
      );
    }

    if (
      !roles.includes(
        recipientType
      )
    ) {
      return forbidden(
        `User does not have ${recipientType} role`
      );
    }

    const prismaRecipientType =
      recipientType ===
        'seller'
        ? RecipientType.SELLER
        : RecipientType.DELIVERY;

    const earnings =
      await getEarningsByRecipient(
        userId,
        prismaRecipientType
      );

    return ok(earnings);
  } catch (error) {
    console.error(error);

    return internalError();
  }
}