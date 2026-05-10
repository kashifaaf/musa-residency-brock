import { cookies } from "next/headers";
import { cache } from "react";
import { getLucia } from "./index";
import type { Session, AuthUser } from "@/types/auth";

export const validateRequest = cache(
  async (): Promise<
    { user: AuthUser; session: Session } | { user: null; session: null }
  > => {
    const lucia = getLucia();
    const sessionId = (await cookies()).get(lucia.sessionCookieName)?.value ?? null;
    
    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    const result = await lucia.validateSession(sessionId);
    
    try {
      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        (await cookies()).set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        (await cookies()).set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
    } catch {
      // Next.js throws when setting cookies in some cases
    }
    
    return result;
  }
);

export async function createSession(userId: string) {
  const lucia = getLucia();
  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  
  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  
  return session;
}

export async function invalidateSession() {
  const lucia = getLucia();
  const { session } = await validateRequest();
  
  if (!session) {
    return;
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  (await cookies()).set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
}