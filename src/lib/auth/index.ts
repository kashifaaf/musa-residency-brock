import { getServerSession } from 'next-auth';
import { getAuthConfig } from './config';

export async function getSession() {
  return getServerSession(getAuthConfig());
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}