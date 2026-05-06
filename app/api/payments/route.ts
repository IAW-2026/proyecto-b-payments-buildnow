// API Route: /api/payments
// TODO: Implementar lógica real de pagos

import { ok, created, internalError, badRequest } from '@/lib/http';

/** GET — Obtener pagos por orderId */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const orderId = url.searchParams.get('orderId');

    if (!orderId) {
      return badRequest('orderId is required');
    }
    // TODO: Obtener pagos desde el servicio
    return ok([]);
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

    if (!orderId || !amount || !method) {
      return badRequest('Missing required fields');
    }

    // TODO: Validar datos y crear pago mediante el servicio
    return created({
      id: 'mock-id',
      orderId,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    return internalError();
  }
}
