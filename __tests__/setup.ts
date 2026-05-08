// Setup global para Vitest
// Se ejecuta antes de cada archivo de test

import { beforeEach } from 'vitest';
import { resetStore } from '@/lib/db';

// Limpiar el store en memoria antes de cada test
// para evitar contaminación entre tests
beforeEach(() => {
  resetStore();
});
