import { Transaction, TransactionStatus, TransactionType, Prisma } from '@/lib/generated/prisma/client';
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

/** Buscar transaction por paymentId y status (para idempotencia) */
export async function findTransactionByPaymentIdAndStatus(
  paymentId: string,
  status: TransactionStatus
): Promise<Transaction | null> {
  return prisma.transaction.findFirst({
    where: {
      paymentId,
      status,
    },
  });
}

/** Buscar transaction por paymentId, type y status (para idempotencia) */
export async function findTransactionByPaymentIdTypeAndStatus(
  paymentId: string,
  type: TransactionType,
  status: TransactionStatus
): Promise<Transaction | null> {
  return prisma.transaction.findFirst({
    where: {
      paymentId,
      type,
      status,
    },
  });
}

export type DashboardTransactionFilter =
  | 'ALL'
  | 'PAYMENT'
  | 'PAYOUT'
  | 'COMMISSION';

export interface PaginatedTransactionsParams {
  page: number;
  limit: number;

  status?: TransactionStatus;
  type?: DashboardTransactionFilter;

  search?: string;
}

export async function findTransactionsPaginated({
  page,
  limit,
  status,
  type,
  search,
}: PaginatedTransactionsParams) {
  const skip = (page - 1) * limit;

  const where: Prisma.TransactionWhereInput = {};

  if (status) where.status = status;
    if (type) {
      switch (type) {
        case 'PAYMENT':
          where.type = TransactionType.PAYMENT;
          break;

        case 'COMMISSION':
          where.type = TransactionType.COMMISSION;
          break;

        case 'PAYOUT':
          where.type = {
            in: [
              TransactionType.PAYOUT_SELLER,
              TransactionType.PAYOUT_DELIVERY,
            ],
          };
          break;

        case 'ALL':
          default:
            break;
      }
    }

  if (search) {
    where.OR = [
      {
        orderId: {
          contains: search,
          mode: 'insensitive',
        },
      },
    ];
  }

  const [transactions, totalItems] = await Promise.all([
    prisma.transaction.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.transaction.count({ where }),
  ]);

  return {
    transactions,
    pagination: {
      page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
    },
  };
}