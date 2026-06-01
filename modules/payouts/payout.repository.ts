import { RecipientType, type Payout } from '@/lib/generated/prisma/client';
import { prisma } from '@/lib/prisma';

export async function savePayout(payout: Payout): Promise<Payout> {
  return prisma.payout.create({
    data: {
      id: payout.id,
      orderId: payout.orderId,
      recipientId: payout.recipientId,
      recipientType: payout.recipientType,
      amount: payout.amount,
      status: payout.status,
      createdAt: payout.createdAt
    },
  });
}

export async function findPayoutById(id: string): Promise<Payout | null> {
  return prisma.payout.findUnique({
    where: { id }
  });
}

export async function findAllPayouts(): Promise<Payout[]> {
  return prisma.payout.findMany();
}

export async function findPayoutsByRecipient(
  recipientId: string,
  recipientType: RecipientType
): Promise<Payout[]> {
  return prisma.payout.findMany({
    where: {
      recipientId,
      recipientType
    }
  });
}

export async function updatePayout(
  id: string,
  data: Partial<Payout>
): Promise<Payout> {
  return prisma.payout.update({
    where: { id },
    data,
  });
}

export async function findPayoutByOrderIdAndRecipientType(
  orderId: string,
  recipientType: RecipientType
): Promise<Payout | null> {
  return prisma.payout.findFirst({
    where: {
      orderId,
      recipientType,
    },
  });
}

export async function findPendingPayoutByOrderIdAndType(
  orderId: string,
  recipientType: RecipientType
): Promise<Payout | null> {
  return prisma.payout.findFirst({
    where: {
      orderId,
      recipientType,
      status: 'PENDING',
    },
  });
}

export async function completePayout(
  payoutId: string,
  recipientId: string
): Promise<Payout> {
  return prisma.payout.update({
    where: {
      id: payoutId,
    },
    data: {
      recipientId,
      status: 'APPROVED',
    },
  });
}

