import { Payment } from './payments.types';
import * as db from '@/lib/db';

/** Guardar un pago en la base de datos */
export async function savePayment(payment: Payment): Promise<Payment> {
  const record = db.insert('payments', payment);
  return record as Payment;
}

/** Buscar un pago por ID en la base de datos */
export async function findPaymentById(id: string): Promise<Payment | null> {
  const record = db.getById('payments', id);
  return record ? (record as Payment) : null;
}

/** Buscar pago por orderId */
export async function findPaymentByOrderId(
  orderId: string
): Promise<Payment | null> {
  const record = db.findBy('payments', 'orderId', orderId);
  return record ? (record as Payment) : null;
}

/** Obtener todos los pagos */
export async function findAllPayments(): Promise<Payment[]> {
  const records = db.getAll('payments');
  return records as Payment[];
}

/**Actualizar un pago */
export async function updatePayment(
  id: string,
  data: Partial<Payment>
): Promise<Payment | null> {
  const record = db.update(
    'payments',
    id,
    data as unknown as Record<string, unknown>
  );

  return record
    ? (record as unknown as Payment)
    : null;
}