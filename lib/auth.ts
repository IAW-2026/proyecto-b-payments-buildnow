import { auth } from '@clerk/nextjs/server';

type Role =
  | 'ADMIN'
  | 'SELLER'
  | 'DELIVERY'
  | 'BUYER';


export async function requireAuth() {
  const { userId, sessionClaims } = await auth();

  const roles =
    (sessionClaims?.metadata?.roles as Role[]) || [];

  return {
    userId,
    roles,
  };
}