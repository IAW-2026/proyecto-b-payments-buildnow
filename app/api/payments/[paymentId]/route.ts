// API Route: /api/payments/[paymentId]
// TODO: Implementar lógica real para un pago individual

import { ok, notFound, internalError } from '@/lib/http';

interface Params {
  params: Promise<{ paymentId: string }>;
}

/** GET /api/payments/:paymentId — Obtener un pago por ID */
export async function GET(_request: Request, { params }: Params) {
  try {
    const { paymentId } = await params;
    // TODO: Buscar pago por ID mediante el servicio
    console.log('Fetching payment:', paymentId);
    return notFound(`Payment ${paymentId} not found`);
  } catch (error) {
    console.error('Error fetching payment:', error);
    return internalError();
  }
}

/** PATCH /api/payments/:paymentId — Actualizar un pago */
export async function PATCH(request: Request, { params }: Params) {
  try {
    const { paymentId } = await params;
    const _body = await request.json();
    // TODO: Actualizar pago mediante el servicio
    console.log('Updating payment:', paymentId);
    return ok({ payment: null });
  } catch (error) {
    console.error('Error updating payment:', error);
    return internalError();
  }
}
