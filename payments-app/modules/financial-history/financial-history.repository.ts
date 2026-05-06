import * as db from '@/lib/db';
import type { FinancialHistoryRecord } from './financial-history.service';

/** Guardar movimiento */
export async function saveFinancialRecord(
    record: FinancialHistoryRecord
): Promise<FinancialHistoryRecord> {
    const saved = db.insert('financial_history', record);
    return saved as FinancialHistoryRecord;
}

/** Buscar por recipient */
export async function findByRecipient(
    recipientId: string,
    recipientType: string
): Promise<FinancialHistoryRecord[]> {
    const records = db.getAll('financial_history') as FinancialHistoryRecord[];

    return records.filter(
        (record) =>
            record.recipientId === recipientId &&
            record.recipientType === recipientType
    );
}