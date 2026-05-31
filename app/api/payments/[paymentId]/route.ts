import { ok, internalError, unauthorized } from '@/lib/http';
import { getPaymentsByUserId } from '@/modules/payments';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const { userId } = await requireAuth('buyer');

    const payments = await getPaymentsByUserId(userId);

    return ok(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    return internalError();
  }
}