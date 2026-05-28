import { Decimal } from '@prisma/client/runtime/wasm-compiler-edge';
import * as transactionRepository from './transaction.repository';
import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from '@/lib/generated/prisma/client';

export interface RecordTransactionInput {
  orderId: string;
  amount: Decimal;
  type: TransactionType;
  status?: TransactionStatus;
  paymentId?: string;
  payoutId?: string;
}

/** Crear una transaction */
export async function recordTransaction(
  data: RecordTransactionInput
): Promise<Transaction> {
  const transaction: Transaction = {
    id: crypto.randomUUID(),
    orderId: data.orderId,
    amount: data.amount,
    type: data.type,
    status: data.status ?? TransactionStatus.PENDING,
    paymentId: data.paymentId ?? null,
    payoutId: data.payoutId ?? null,
    createdAt: new Date(),
  };

  return transactionRepository.saveTransaction(transaction);
}

/**
 * Crear una transaction solo si no existe otra
 * con el mismo paymentId y status (idempotencia).
 * Retorna la transaction existente si ya existe, o la nueva si se creó.
 */
export async function createTransactionIfNotExists(
  data: RecordTransactionInput
): Promise<Transaction> {
  const status = data.status ?? TransactionStatus.PENDING;

  if (data.paymentId) {
    const existing = await transactionRepository
      .findTransactionByPaymentIdAndStatus(
        data.paymentId,
        status
      );

    if (existing) {
      console.info(
        '[TRANSACTION][INFO] Duplicate skipped',
        {
          paymentId: data.paymentId,
          status,
        }
      );
      return existing;
    }
  }

  return recordTransaction(data);
}

/** Buscar transaction por paymentId y status */
export async function getTransactionByPaymentIdAndStatus(
  paymentId: string,
  status: TransactionStatus
): Promise<Transaction | null> {
  return transactionRepository
    .findTransactionByPaymentIdAndStatus(
      paymentId,
      status
    );
}

export async function getTransactionById(
  id: string
): Promise<Transaction | null> {
  return transactionRepository.findTransactionById(id);
}

export async function listTransactions(): Promise<Transaction[]> {
  return transactionRepository.findAllTransactions();
}