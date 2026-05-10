import { Lucia } from "lucia";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { getDb, schema } from "@/lib/db";
import type { AuthUser } from "@/types/auth";

let lucia: Lucia<Record<never, never>, { user: AuthUser }> | null = null;

export function getLucia() {
  if (!lucia) {
    const db = getDb();
    const adapter = new DrizzlePostgreSQLAdapter(
      db,
      schema.sessions,
      schema.users
    );

    lucia = new Lucia(adapter, {
      sessionCookie: {
        attributes: {
          secure: process.env.NODE_ENV === "production",
        },
      },
      getUserAttributes: (attributes) => {
        return {
          id: attributes.id,
          email: attributes.email,
          name: attributes.name,
          emailVerified: attributes.emailVerified,
        };
      },
    });
  }

  return lucia;
}

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  id: string;
  email: string;
  name: string | null;
  emailVerified: boolean;
}

export { Lucia };