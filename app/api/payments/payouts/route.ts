import {
  claimPayout,
  getPayoutsByRecipient,
} from '@/modules/payouts';

import {
  ok,
  forbidden,
  created,
  internalError,
  badRequest,
} from '@/lib/http';

import { requireAuth } from '@/lib/auth';

import { RecipientType } from '@/lib/generated/prisma/enums';

import * as transactionService from '@/modules/transactions/transaction.service';

import { TransactionType } from '@/lib/generated/prisma/client';

/** GET — Listar payouts por recipient */
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

    const payouts =
      await getPayoutsByRecipient(
        userId,
        prismaRecipientType
      );

    return ok(payouts);
  } catch (error) {
    console.error(
      'Error listing payouts:',
      error
    );

    return internalError();
  }
}

/** POST — Crear payout */
export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const { userId, roles } =
      await requireAuth(
        'seller',
        'delivery'
      );

    const orderId =
      body.orderId;

    const recipientType =
      body.recipientType?.toLowerCase();

    if (!orderId) {
      return badRequest(
        'orderId is required'
      );
    }

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

    const payout =
      await claimPayout(
        orderId,
        prismaRecipientType,
        userId
      );

    if (!payout) {
      return badRequest(
        'Payout not found'
      );
    }

    const transactionType =
      prismaRecipientType ===
        RecipientType.SELLER
        ? TransactionType.PAYOUT_SELLER
        : TransactionType.PAYOUT_DELIVERY;

    await transactionService.createTransactionIfNotExists(
      {
        payoutId: payout.id,
        orderId: payout.orderId,
        amount: payout.amount,
        type: transactionType,
        status: 'APPROVED',
      }
    );

    return created(payout);
  } catch (error) {
    console.error(
      'Error creating payout:',
      error
    );

    return internalError();
  }
}