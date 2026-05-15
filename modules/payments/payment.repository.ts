import type { Payment } from '@/lib/generated/prisma/client';
import { prisma } from '@/lib/prisma';

/** Guardar un pago*/
export async function savePayment(payment: Payment): Promise<Payment> {
  return prisma.payment.create({
    data: {
      id: payment.id,
      userId: payment.userId,
      orderId: payment.orderId,
      amount: payment.amount,
      method: payment.method,
      status: payment.status,
      createdAt: payment.createdAt
    }
  });
}

/** Buscar un pago por ID en la base de datos */
export async function findPaymentByUserId(
  userId: string
): Promise<Payment[]> {
  return prisma.payment.findMany({
    where: { userId },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

/** Buscar pago por orderId */
export async function findPaymentByOrderIdAndUserId(
  orderId: string,
  userId: string
): Promise<Payment | null> {
  return prisma.payment.findFirst({
    where: {
      orderId,
      userId,
    },
  });
}

/** Obtener todos los pagos */
export async function findAllPayments(): Promise<Payment[]> {
  return prisma.payment.findMany();
}

/**Actualizar un pago */
export async function updatePayment(
  id: string,
  data: Partial<Payment>
): Promise<Payment | null> {
  try {
    return await prisma.payment.update({
      where: { id },
      data
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return null; // Record not found
    }
    throw error;
  }
}