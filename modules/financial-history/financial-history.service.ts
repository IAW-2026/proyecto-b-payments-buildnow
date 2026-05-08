import { FinancialHistoryRecord } from './financial-history.types';
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