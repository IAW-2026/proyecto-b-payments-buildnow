import { ok, notFound, internalError, badRequest } from '@/lib/http';
import { getPaymentById, updatePaymentStatus } from '@/modules/payments';


interface Params {
  params: Promise<{ paymentId: string }>;
}

/** GET /api/payments/:paymentId*/
export async function GET(_request: Request, { params }: Params) {
  try {
    const { paymentId } = await params;

    const payment = await getPaymentById(paymentId);

    if (!payment) {
      return notFound(`Payment ${paymentId} not found`);
    }

    return ok(payment);
  } catch (error) {
    console.error('Error fetching payment:', error);
    return internalError();
  }
}