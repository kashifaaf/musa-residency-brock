import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { getDb } from '@/lib/db';
import { users, accounts, sessions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(getDb(), {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
  }),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        const db = getDb();
        const user = await db.query.users.findFirst({
          where: eq(users.email, session.user.email!),
        });
        
        if (user) {
          session.user = {
            ...session.user,
            id: user.id,
            role: user.role,
            isHost: user.isHost,
          };
        }
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  events: {
    createUser: async ({ user }) => {
      // Ensure user has an id (for manual user creation)
      if (!user.id) {
        const db = getDb();
        await db
          .update(users)
          .set({ id: nanoid() })
          .where(eq(users.email, user.email!));
      }
    },
  },
});

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      role: 'user' | 'admin';
      isHost: boolean;
    };
  }
}