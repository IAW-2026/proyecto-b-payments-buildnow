import { ok, internalError, badRequest } from '@/lib/http';

/** GET /api/payments/earnings?recipientId=&recipientType= */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);

    const recipientId = url.searchParams.get('recipientId');
    const recipientType = url.searchParams.get('recipientType');

    if (!recipientId || !recipientType) {
      return badRequest('recipientId and recipientType are required');
    }

    console.log('Fetching earnings for:', recipientId, recipientType);

    // TODO: Integrar con earning.service
    return ok({
      recipientId,
      recipientType,
      totalEarnings: 0,
      currency: 'ARS'
    });

  } catch (error) {
    console.error('Error listing earnings:', error);
    return internalError();
  }
}