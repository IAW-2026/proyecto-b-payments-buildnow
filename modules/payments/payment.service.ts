import type { Payment } from '@/lib/generated/prisma/client';
import {
  PaymentStatus,
  TransactionType,
} from '@/lib/generated/prisma/client';
import { TransactionStatus } from '@/lib/generated/prisma/client';
import * as paymentRepository from './payment.repository';
import * as transactionService from '@/modules/transactions/transaction.service';

type CreatePaymentInput = Pick<
  Payment,
  | 'orderId'
  | 'amount'
  | 'method'
  | 'userId'
  | 'preferenceId'
  | 'externalReference'
>;

type UpdatePaymentInput = {
  status?: PaymentStatus;
  mercadopagoId?: string | null;
  preferenceId?: string | null;
  externalReference?: string | null;
  statusDetail?: string | null;
  payerEmail?: string | null;
  paidAt?: Date | null;
};

/** Crear un nuevo pago */
export async function createPayment(
  data: CreatePaymentInput
): Promise<Payment> {

  const payment: Payment = {
    id: crypto.randomUUID(),

    userId: data.userId,
    orderId: data.orderId,

    amount: data.amount,
    method: data.method,

    status: PaymentStatus.PENDING,

    statusDetail: null,
    payerEmail: null,
    paidAt: null,

    mercadopagoId: null,

    preferenceId:
      data.preferenceId ?? null,

    externalReference:
      data.externalReference ?? null,

    createdAt: new Date(),
  };

  const savedPayment = await paymentRepository
    .savePayment(payment);

  /** Registrar transaction inicial PENDING */
  await transactionService.createTransactionIfNotExists({
    paymentId: savedPayment.id,
    orderId: savedPayment.orderId,
    amount: savedPayment.amount,
    type: TransactionType.PAYMENT,
    status: TransactionStatus.PENDING,
  });

  return savedPayment;
}

/** Obtener pagos por userId */
export async function getPaymentsByUserId(
  id: string
): Promise<Payment[]> {

  return paymentRepository
    .findPaymentByUserId(id);
}

/** Obtener un pago por OrderID y userId */
export async function getPaymentByOrderIdAndUserId(
  orderId: string,
  userId: string
): Promise<Payment | null> {

  return paymentRepository
    .findPaymentByOrderIdAndUserId(
      orderId,
      userId
    );
}

/** Listar todos los pagos */
export async function listPayments(): Promise<Payment[]> {

  return paymentRepository
    .findAllPayments();
}

/** Actualizar un pago */
export async function updatePaymentStatus(
  id: string,
  status: PaymentStatus
) {

  return paymentRepository.updatePayment(
    id,
    { status }
  );
}

/** Actualizar payment por orderId */
export async function updatePaymentByOrderId(
  orderId: string,
  data: UpdatePaymentInput
): Promise<Payment | null> {

  return paymentRepository
    .updatePaymentByOrderId(
      orderId,
      data
    );
}

/** Obtener payment por orderId */
export async function getPaymentByOrderId(
  orderId: string
): Promise<Payment | null> {

  return paymentRepository
    .findPaymentByOrderId(orderId);
}