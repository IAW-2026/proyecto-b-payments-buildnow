// TODO: Reemplazar con una conexión real a base de datos (e.g. Prisma, Drizzle)
// Mock simple en memoria para desarrollo inicial

const store: Record<string, Record<string, unknown>[]> = {
  payments: [],
  payouts: [],
  earnings: [],
  transactions: [],
};

/** Obtener todos los registros de una colección */
export function getAll(collection: string): Record<string, unknown>[] {
  return store[collection] ?? [];
}

/** Obtener un registro por ID */
export function getById(collection: string, id: string): Record<string, unknown> | undefined {
  return getAll(collection).find((item) => item.id === id);
}

/** Insertar un registro en una colección */
export function insert(collection: string, data: Record<string, unknown>): Record<string, unknown> {
  const record = { ...data, id: data.id ?? crypto.randomUUID(), createdAt: new Date().toISOString() };
  if (!store[collection]) {
    store[collection] = [];
  }
  store[collection].push(record);
  return record;
}

/** Eliminar un registro por ID */
export function remove(collection: string, id: string): boolean {
  const col = store[collection];
  if (!col) return false;
  const index = col.findIndex((item) => item.id === id);
  if (index === -1) return false;
  col.splice(index, 1);
  return true;
}

export function update(
  collection: string,
  id: string,
  data: Record<string, unknown>
) {
  const col = store[collection];
  if (!col) return null;

  const index = col.findIndex((item) => (item as any).id === id);
  if (index === -1) return null;

  const updated = {
    ...col[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  col[index] = updated;
  return updated;
}

export function findBy(
  collection: string,
  key: string,
  value: unknown
) {
  return getAll(collection).filter(
    (item) => (item as any)[key] === value
  );
}

/** Limpiar todas las colecciones (solo para tests) */
export function resetStore() {
  for (const key of Object.keys(store)) {
    store[key] = [];
  }
}
