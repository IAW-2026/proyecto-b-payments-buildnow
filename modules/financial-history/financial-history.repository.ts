/*import { prisma } from '@/lib/prisma';
import { RecipientType, MovementType, FinancialHistoryStatus, FinancialHistory } from '@/lib/generated/prisma/client';

export async function saveFinancialRecord(
    record: FinancialHistory
): Promise<FinancialHistory> {
    return await prisma.financialHistory.create({
        data: {
            id: record.id,
            orderId: record.orderId,
            recipientId: record.recipientId,
            recipientType: record.recipientType,
            amount: record.amount,
            currency: record.currency,
            movementType: record.movementType,
            status: record.status,
            createdAt: record.createdAt,
            paymentId: record.paymentId
        }
    }) as FinancialHistory;
}

export async function findByRecipient(
    recipientId: string,
    recipientType: RecipientType
): Promise<FinancialHistory[]> {
    return await prisma.financialHistory.findMany({
        where: {
            recipientId,
            recipientType,
        },
        orderBy: {
            createdAt: 'desc',
        },
    }) as FinancialHistory[];
}*/