import type { Payout } from './payout.service';
import * as db from '@/lib/db';

/** Guardar un payout */
export async function savePayout(payout: Payout): Promise<Payout> {
  const record = db.insert('payouts', payout);
  return record as unknown as Payout;
}

/** Buscar un payout por ID */
export async function findPayoutById(id: string): Promise<Payout | null> {
  const record = db.getById('payouts', id);
  return record ? (record as unknown as Payout) : null;
}

/** Obtener todos los payouts */
export async function findAllPayouts(): Promise<Payout[]> {
  const records = db.getAll('payouts');
  return records as unknown as Payout[];
}

/** Buscar payouts por recipient */
export async function findPayoutsByRecipient(
  recipientId: string,
  recipientType: string
): Promise<Payout[]> {
  const records = db.getAll('payouts') as unknown as Payout[];

  return records.filter(
    (payout) =>
      payout.recipientId === recipientId &&
      payout.recipientType === recipientType
  );
}