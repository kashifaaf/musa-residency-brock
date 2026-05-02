import NextAuth from 'next-auth';
import { getAuthConfig } from '@/lib/auth/config';

const handler = NextAuth(getAuthConfig());

export { handler as GET, handler as POST };