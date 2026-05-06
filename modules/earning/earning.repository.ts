// TODO: Implementar repositorio de earnings

import type { Earning } from './earning.service';
import * as db from '@/lib/db';

/** Guardar un earning */
export async function saveEarning(earning: Earning): Promise<Earning> {
  const record = db.insert('earnings', earning);
  return record as Earning;
}

/** Buscar un earning por ID */
export async function findEarningById(id: string): Promise<Earning | null> {
  const record = db.getById('earnings', id);
  return record ? (record as Earning) : null;
}

/** Obtener todos los earnings */
export async function findAllEarnings(): Promise<Earning[]> {
  const records = db.getAll('earnings');
  return records as Earning[];
}

export async function findEarningsByRecipient(
  recipientId: string,
  recipientType: string
): Promise<Earning[]> {
  const records = db.findBy('earnings', 'recipientId', recipientId);
  return records as Earning[];
}
