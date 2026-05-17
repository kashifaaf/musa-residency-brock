import type { NextAuthOptions, DefaultSession } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { getDb } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { getServerSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      isHost: boolean
    } & DefaultSession["user"]
  }

  interface User {
    isHost?: boolean
  }
}

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(getDb()) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token?.sub && session.user) {
        const db = getDb()
        const user = await db.query.users.findFirst({
          where: eq(users.id, token.sub),
        })

        if (user) {
          session.user.id = user.id
          session.user.isHost = user.isHost
        }
      }

      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.isHost = (user as any).isHost
      }
      return token
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
}

export async function auth() {
  return getServerSession(authOptions)
}