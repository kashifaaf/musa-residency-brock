"use server";

import { hash, verify } from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { createSession } from "@/lib/auth/session";
import { eq } from "drizzle-orm";
import type { ActionResponse } from "@/types";

const ARGON2_OPTIONS = {
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
};

export async function signUp(formData: FormData): Promise<ActionResponse<{ id: string }>> {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    if (!email || !password || !name) {
      return { success: false, error: "All fields are required" };
    }

    if (password.length < 8) {
      return { success: false, error: "Password must be at least 8 characters" };
    }

    const db = getDb();

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (existingUser.length > 0) {
      return { success: false, error: "Email already registered" };
    }

    const userId = generateIdFromEntropySize(10);
    const hashedPassword = await hash(password, ARGON2_OPTIONS);

    await db.insert(users).values({
      id: userId,
      email: email.toLowerCase(),
      hashedPassword,
      name,
    });

    await createSession(userId);

    return { success: true, data: { id: userId } };
  } catch (error) {
    console.error("SignUp error:", error);
    return { success: false, error: "Failed to create account" };
  }
}

export async function signIn(formData: FormData): Promise<ActionResponse<{ id: string }>> {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return { success: false, error: "Email and password are required" };
    }

    const db = getDb();

    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (user.length === 0 || !user[0].hashedPassword) {
      return { success: false, error: "Invalid email or password" };
    }

    const validPassword = await verify(user[0].hashedPassword, password, ARGON2_OPTIONS);

    if (!validPassword) {
      return { success: false, error: "Invalid email or password" };
    }

    await createSession(user[0].id);

    return { success: true, data: { id: user[0].id } };
  } catch (error) {
    console.error("SignIn error:", error);
    return { success: false, error: "Failed to sign in" };
  }
}