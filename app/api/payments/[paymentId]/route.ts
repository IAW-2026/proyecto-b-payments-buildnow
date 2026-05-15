import { ok, internalError, unauthorized } from '@/lib/http';
import { getPaymentsByUserId } from '@/modules/payments';
import { auth } from '@clerk/nextjs/server';


export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return unauthorized('Unauthorized');
    }

    const payments = await getPaymentsByUserId(userId);

    return ok(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    return internalError();
  }
}