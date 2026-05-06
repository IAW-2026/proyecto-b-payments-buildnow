// API Route: /api/payments/payouts
// TODO: Implementar lógica real de payouts

import { ok, created, internalError, badRequest } from '@/lib/http';

/** GET — Listar payouts por recipient */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);

    const recipientId = url.searchParams.get('recipientId');
    const recipientType = url.searchParams.get('recipientType');

    if (!recipientId || !recipientType) {
      return badRequest('recipientId and recipientType are required');
    }

    console.log('Fetching payouts for:', recipientId, recipientType);

    // TODO: Integrar con payout.service
    return ok([]);

  } catch (error) {
    console.error('Error listing payouts:', error);
    return internalError();
  }
}

/** POST /api/payments/payouts — Crear un nuevo payout */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { orderId, recipientId, recipientType, amount } = body;

    if (!orderId || !recipientId || !recipientType || !amount) {
      return badRequest('Missing required fields');
    }

    console.log('Creating payout:', body);

    // TODO: Integrar con payout.service
    return created({
      id: 'mock-id',
      status: 'PENDING',
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error creating payout:', error);
    return internalError();
  }
}
