import { cookies } from 'next/headers';
import { verifyJWT, type JWTPayload } from './auth';

export async function getSession(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;
  
  if (!token) return null;
  
  return await verifyJWT(token);
}

export async function requireAuth(): Promise<JWTPayload> {
  const session = await getSession();
  if (!session) {
    throw new Error('Authentication required');
  }
  return session;
}