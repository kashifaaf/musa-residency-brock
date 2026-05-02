import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { getDb } from '@/lib/db';

function getGoogleClientId() {
  return process.env.GOOGLE_CLIENT_ID;
}

function getGoogleClientSecret() {
  return process.env.GOOGLE_CLIENT_SECRET;
}

function getNextAuthSecret() {
  return process.env.NEXTAUTH_SECRET;
}

export function getAuthConfig(): NextAuthOptions {
  const googleClientId = getGoogleClientId();
  const googleClientSecret = getGoogleClientSecret();
  const nextAuthSecret = getNextAuthSecret();
  
  if (!googleClientId || !googleClientSecret || !nextAuthSecret) {
    throw new Error('Missing required authentication environment variables');
  }

  return {
    adapter: DrizzleAdapter(getDb()) as any,
    providers: [
      GoogleProvider({
        clientId: googleClientId,
        clientSecret: googleClientSecret,
      }),
    ],
    secret: nextAuthSecret,
    session: {
      strategy: 'jwt',
    },
    callbacks: {
      session: async ({ session, token }) => {
        if (token?.sub && session?.user) {
          session.user.id = token.sub;
        }
        return session;
      },
      jwt: async ({ user, token }) => {
        if (user) {
          token.uid = user.id;
        }
        return token;
      },
    },
  };
}