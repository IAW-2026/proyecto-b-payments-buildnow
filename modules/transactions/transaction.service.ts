import * as transactionRepository from './transaction.repository';
import { Transaction } from './transaction.type';

export interface RecordTransactionInput {
  paymentId: string;
  orderId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  externalReference: string;
}

export async function recordTransaction(
  data: RecordTransactionInput
): Promise<Transaction> {
  const transaction: Transaction = {
    id: crypto.randomUUID(),
    paymentId: data.paymentId,
    orderId: data.orderId,
    status: data.status,
    externalReference: data.externalReference,
    createdAt: new Date().toISOString(),
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