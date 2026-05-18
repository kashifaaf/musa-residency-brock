import type { NextAuthOptions } from "next-auth"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import GoogleProvider from "next-auth/providers/google"
import { getDb } from "@/lib/db"

function createAuthOptions(): NextAuthOptions {
  return {
    adapter: DrizzleAdapter(getDb()) as any,
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
    ],
    session: { strategy: "jwt" },
    callbacks: {
      async session({ session, token }) {
        if (session.user && token.sub) {
          session.user.id = token.sub
        }
        return session
      },
      async jwt({ token, user }) {
        if (user) {
          token.sub = user.id
        }
        return token
      },
    },
    pages: {
      signIn: "/login",
    },
  }
}

let _authOptions: NextAuthOptions | null = null

export function getAuthOptions(): NextAuthOptions {
  if (!_authOptions) {
    _authOptions = createAuthOptions()
  }
  return _authOptions
}

// For backward compat — but this is a lazy proxy
export const authOptions: NextAuthOptions = new Proxy({} as NextAuthOptions, {
  get(_target, prop) {
    const opts = getAuthOptions()
    return (opts as any)[prop]
  },
})