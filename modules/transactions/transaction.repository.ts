import { Transaction } from '@/lib/generated/prisma/client';
import { prisma } from '@/lib/prisma';

export async function saveTransaction(
  transaction: Transaction
): Promise<Transaction> {
  return prisma.transaction.create({
    data: transaction,
  });
}

export async function findTransactionById(
  id: string
): Promise<Transaction | null> {
  return prisma.transaction.findUnique({
    where: { id },
  });
}

export async function findAllTransactions(): Promise<Transaction[]> {
  return prisma.transaction.findMany();
}

export async function findTransactionsByPaymentId(
  paymentId: string
): Promise<Transaction[]> {
  return prisma.transaction.findMany({
    where: { paymentId },
  });
}

export async function findTransactionByOrderId(
  orderId: string
): Promise<Transaction[]> {
  return prisma.transaction.findMany({
    where: { orderId },
  });
}