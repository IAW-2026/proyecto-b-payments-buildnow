// TODO: Reemplazar con autenticación real (e.g. Clerk, NextAuth)
// Mock básico de autenticación para desarrollo inicial

export interface AuthUser {
  id: string;
  email: string;
  role: 'admin' | 'user';
}

/** Mock: siempre retorna un usuario autenticado de prueba */
export async function getCurrentUser(): Promise<AuthUser> {
  // TODO: Implementar autenticación real
  return {
    id: 'user_mock_001',
    email: 'test@example.com',
    role: 'admin',
  };
}

/** Mock: siempre retorna true */
export async function isAuthenticated(): Promise<boolean> {
  // TODO: Implementar verificación real
  return true;
}

/** Mock: verifica si el usuario tiene el rol requerido */
export async function hasRole(requiredRole: AuthUser['role']): Promise<boolean> {
  const user = await getCurrentUser();
  return user.role === requiredRole;
}
