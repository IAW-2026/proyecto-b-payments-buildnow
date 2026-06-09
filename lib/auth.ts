import { auth } from '@clerk/nextjs/server';

export type Role =
  | 'admin'
  | 'seller'
  | 'delivery'
  | 'buyer';

export async function requireAuth(
  ...allowedRoles: Role[]
) {
  const { userId, sessionClaims } =
    await auth();

  if (!userId) {
    throw new Error('UNAUTHORIZED');
  }

  const roles = (sessionClaims?.metadata?.role as string[]) || [];

  if (
    allowedRoles.length > 0 &&
    !allowedRoles.some(role =>
      roles.includes(role)
    )
  ) {
    throw new Error('FORBIDDEN');
  }

  return {
    userId,
    roles,
  };
}