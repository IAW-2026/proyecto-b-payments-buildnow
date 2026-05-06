// API Route: /api/payments/webhooks
// TODO: Implementar recepción de webhooks del proveedor de pagos (e.g. Mercado Pago)

import { ok, badRequest, internalError } from '@/lib/http';

/** POST /api/payments/webhooks — Recibir notificación de webhook */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // TODO: Validar firma/autenticidad del webhook
    // TODO: Procesar el evento según su tipo
    console.log('Webhook received:', body);

    if (!body || !body.type) {
      return badRequest('Invalid webhook payload');
    }

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
