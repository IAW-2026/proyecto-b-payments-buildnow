// TODO: Implementar servicio de pagos
// Este módulo manejará la lógica de negocio relacionada con pagos

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: 'CARD';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

import * as paymentRepository from './payment.repository';

/** Crear un nuevo pago */
export async function createPayment(
  data: Pick<Payment, 'orderId' | 'amount' | 'method'>
): Promise<Payment> {
  const payment: Payment = {
    id: crypto.randomUUID(),
    orderId: data.orderId,
    amount: data.amount,
    method: data.method,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  };

  return paymentRepository.savePayment(payment);
}

/** Obtener un pago por ID */
export async function getPaymentById(
  id: string
): Promise<Payment | null> {
  return paymentRepository.findPaymentById(id);
}

/** Obtener un pago por OrderID */
export async function getPaymentByOrderId(
  orderId: string
): Promise<Payment | null> {
  return paymentRepository.findPaymentByOrderId(orderId);
}


/** Listar todos los pagos */
export async function listPayments(): Promise<Payment[]> {
  return paymentRepository.findAllPayments();
}
