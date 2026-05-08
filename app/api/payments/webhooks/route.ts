// API Route: /api/payments/webhooks
// TODO: Implementar recepción de webhooks del proveedor de pagos (e.g. Mercado Pago)

import { ok, badRequest, internalError } from '@/lib/http';
import { updatePaymentStatus } from '@/modules/payments';
import { recordTransaction } from '@/modules/transactions';

/** POST /api/payments/webhooks — Recibir notificación de webhook */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { paymentId, status, externalReference } = body;

    if (!paymentId || !status || !externalReference) {
      return badRequest('Invalid webhook payload');
    }

    await updatePaymentStatus(paymentId, status);

    await recordTransaction({ paymentId, orderId: externalReference, status, externalReference });

    // TODO: Validar firma/autenticidad del webhook

    // TODO: Manejar distintos tipos de eventos
    // switch (body.type) {
    //   case 'payment.created':
    //   case 'payment.updated':
    //   default:
    // }

    return ok({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return internalError();
  }
}
