import type {
  Payment,
  Prisma,
} from '@/lib/generated/prisma/client';

import { prisma } from '@/lib/prisma';

/** Guardar un pago */
export async function savePayment(
  payment: Payment
): Promise<Payment> {

  return prisma.payment.create({
    data: {
      id: payment.id,

      userId: payment.userId,
      orderId: payment.orderId,

      amount: payment.amount,
      method: payment.method,

      status: payment.status,

      statusDetail: payment.statusDetail,
      payerEmail: payment.payerEmail,
      paidAt: payment.paidAt,

      mercadopagoId:
        payment.mercadopagoId,

      preferenceId:
        payment.preferenceId,

      externalReference:
        payment.externalReference,

      createdAt: payment.createdAt,
    },
  });
}

/** Buscar pagos por userId */
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

/** Actualizar un pago */
export async function updatePayment(
  id: string,
  data: Prisma.PaymentUpdateInput
): Promise<Payment | null> {

  try {

    return await prisma.payment.update({
      where: { id },
      data,
    });

  } catch (error: any) {

    if (error.code === 'P2025') {
      return null;
    }

    throw error;
  }
}

/** Actualizar pago por orderId */
export async function updatePaymentByOrderId(
  orderId: string,
  data: Prisma.PaymentUpdateInput
): Promise<Payment | null> {

  try {

    return await prisma.payment.update({
      where: {
        orderId,
      },

      data,
    });

  } catch (error: any) {

    if (error.code === 'P2025') {
      return null;
    }

    throw error;
  }
}

/** Buscar pago por orderId */
export async function findPaymentByOrderId(
  orderId: string
): Promise<Payment | null> {

  return prisma.payment.findUnique({
    where: {
      orderId,
    },
  });
}