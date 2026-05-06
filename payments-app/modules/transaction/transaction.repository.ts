import type { Transaction } from './transaction.service';
import * as db from '@/lib/db';

/** Guardar una transacción */
export async function saveTransaction(
  transaction: Transaction
): Promise<Transaction> {
  const record = db.insert('transactions', transaction);
  return record as unknown as Transaction;
}

/** Buscar una transacción por ID */
export async function findTransactionById(
  id: string
): Promise<Transaction | null> {
  const record = db.getById('transactions', id);
  return record ? (record as unknown as Transaction) : null;
}

/** Obtener todas las transacciones */
export async function findAllTransactions(): Promise<Transaction[]> {
  const records = db.getAll('transactions');
  return records as unknown as Transaction[];
}

/**búsqueda por paymentId*/
export async function findTransactionByPaymentId(
  paymentId: string
): Promise<Transaction | null> {
  const record = db.findBy(
    'transactions',
    'paymentId',
    paymentId
  );

  return record ? (record as unknown as Transaction) : null;
}