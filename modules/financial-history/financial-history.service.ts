/*import { RecipientType, MovementType, FinancialHistoryStatus, FinancialHistory } from '@/lib/generated/prisma/client';
import * as repository from './financial-history.repository';
import { Decimal } from '@prisma/client/runtime/wasm-compiler-edge';

export interface CreateFinancialRecordInput {
    orderId: string;
    recipientId: string;
    recipientType: RecipientType;
    amount: Decimal;
    currency?: string;
    movementType: MovementType;
    paymentId: string;
}

export async function createFinancialRecord(
    data: CreateFinancialRecordInput
): Promise<FinancialHistory> {
    const record: FinancialHistory = {
        id: crypto.randomUUID(),
        orderId: data.orderId,
        recipientId: data.recipientId,
        recipientType: data.recipientType,
        amount: data.amount,
        currency: data.currency ?? 'USD',
        movementType: data.movementType,
        status: FinancialHistoryStatus.PENDING,
        createdAt: new Date(),
        paymentId: data.paymentId,
    };

    return repository.saveFinancialRecord(record);
}

export async function getFinancialHistoryByRecipient(
    recipientId: string,
    recipientType: RecipientType
): Promise<FinancialHistory[]> {
    return repository.findByRecipient(
        recipientId,
        recipientType
    );
}*/