export interface FinancialHistoryRecord {
    id: string;
    orderId: string;
    paymentId: string;
    recipientId: string;
    recipientType: 'SELLER' | 'DELIVERY';
    amount: number;
    currency: string;
    movementType: 'PAYOUT' | 'COMMISSION' | 'REFUND';
    status: 'PENDING' | 'COMPLETED';
    createdAt: string;
}

import * as repository from './financial-history.repository';

/** Registrar movimiento financiero */
export async function createFinancialRecord(
    data: FinancialHistoryRecord
): Promise<FinancialHistoryRecord> {
    return repository.saveFinancialRecord(data);
}

/** Obtener movimientos por recipient */
export async function getFinancialHistoryByRecipient(
    recipientId: string,
    recipientType: 'SELLER' | 'DELIVERY'
): Promise<FinancialHistoryRecord[]> {
    return repository.findByRecipient(recipientId, recipientType);
}