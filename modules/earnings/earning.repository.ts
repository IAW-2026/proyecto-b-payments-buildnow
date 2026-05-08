// TODO: Implementar repositorio de earnings

import type { Earnings } from './earnings.types';
import * as db from '@/lib/db';

/** Guardar un earning */
export async function saveEarning(earnings: Earnings): Promise<Earnings> {
  const record = db.insert('earnings', earnings);
  return record as Earnings;
}

/** Buscar un earning por ID */
export async function findEarningById(id: string): Promise<Earnings | null> {
  const record = db.getById('earnings', id);
  return record ? (record as Earnings) : null;
}

/** Obtener todos los earnings */
export async function findAllEarnings(): Promise<Earnings[]> {
  const records = db.getAll('earnings');
  return records as Earnings[];
}

export async function findEarningsByRecipient(
  recipientId: string,
  recipientType: string
): Promise<Earnings[]> {
  const records = db.findBy('earnings', 'recipientId', recipientId);
  return records as Earnings[];
}
