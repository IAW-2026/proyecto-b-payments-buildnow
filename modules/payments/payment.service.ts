import type { Payment } from '@/lib/generated/prisma/client';
import { PaymentStatus } from '@/lib/generated/prisma/client';
import * as paymentRepository from './payment.repository';

/** Crear un nuevo pago */
export async function createPayment(
  data: Pick<Payment, 'orderId' | 'amount' | 'method' | 'userId'>
): Promise<Payment> {
  const payment: Payment = {
    id: crypto.randomUUID(),
    userId: data.userId,
    orderId: data.orderId,
    amount: data.amount,
    method: data.method,
    status: 'PENDING',
    createdAt: new Date(),
  };

  return paymentRepository.savePayment(payment);
}

/** Obtener pagos por userId */
export async function getPaymentsByUserId(
  id: string
): Promise<Payment[]> {
  return paymentRepository.findPaymentByUserId(id);
}

/** Obtener un pago por OrderID y userId */
export async function getPaymentByOrderIdAndUserId(
  orderId: string,
  userId: string
): Promise<Payment | null> {
  return paymentRepository.findPaymentByOrderIdAndUserId(orderId, userId);
}

/** Listar todos los pagos */
export async function listPayments(): Promise<Payment[]> {
  return paymentRepository.findAllPayments();
}

/**Actualizar un pago */
export async function updatePaymentStatus(
  id: string,
  status: PaymentStatus
) {
  return paymentRepository.updatePayment(id, { status });
}
