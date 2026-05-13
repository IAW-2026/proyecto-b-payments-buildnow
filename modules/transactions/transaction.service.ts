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

export async function getTransactionById(
  id: string
): Promise<Transaction | null> {
  return transactionRepository.findTransactionById(id);
}

export async function listTransactions(): Promise<Transaction[]> {
  return transactionRepository.findAllTransactions();
}