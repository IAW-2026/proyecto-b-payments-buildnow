// API Route: /api/payments
// TODO: Implementar lógica real de pagos


import { createPayment, getPaymentByOrderId } from '@/modules/payments';
import { ok, created, internalError, badRequest } from '@/lib/http';

/** GET — Obtener pagos por orderId */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const orderId = url.searchParams.get('orderId');

    if (!orderId) {
      return badRequest('orderId is required');
    }

    const payments = await getPaymentByOrderId(orderId);
    return ok(payments);
  } catch (error) {
    console.error('Error listing payments:', error);
    return internalError();
  }
}

/** POST /api/payments — Crear un nuevo pago */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { orderId, amount, method } = body;

    if (!orderId || amount == null || !method) {
      return badRequest('Missing required fields');
    }

    // TODO: Validar datos y crear pago mediante el servicio
    const payment = await createPayment({
      orderId,
      amount,
      method,
    });

    return created(payment);
  } catch (error) {
    console.error('Error creating payment:', error);
    return internalError();
  }
}
