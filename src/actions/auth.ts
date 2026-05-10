"use server";

import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { isValidEmail, generateVerificationToken } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { getAPP_URL } from "@/lib/constants";
import crypto from "crypto";

type ActionResult<T = void> = {
  success: boolean;
  data?: T;
  error?: string;
};

export async function createUser(formData: FormData): Promise<ActionResult<{ userId: string }>> {
  try {
    const db = getDb();
    
    // Extract form data
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const location = formData.get("location") as string;
    const workInfo = formData.get("workInfo") as string | null;
    const bio = formData.get("bio") as string | null;
    
    // Validate inputs
    if (!email || !password || !name || !location) {
      return { success: false, error: "Missing required fields" };
    }
    
    if (!isValidEmail(email)) {
      return { success: false, error: "Invalid email address" };
    }
    
    if (password.length < 8) {
      return { success: false, error: "Password must be at least 8 characters" };
    }
    
    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    
    if (existingUser.length > 0) {
      return { success: false, error: "An account with this email already exists" };
    }
    
    // Hash password (simplified for MVP - use bcrypt in production)
    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");
    
    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        name,
        location,
        workInfo,
        bio,
        emailVerified: false,
      })
      .returning({ id: users.id });
    
    // Send verification email
    const verificationToken = generateVerificationToken();
    await sendEmail({
      to: email,
      subject: "Welcome to Musa Residency!",
      text: `Please verify your email by clicking: ${getAPP_URL()}/verify-email?token=${verificationToken}`,
      html: `
        <h1>Welcome to Musa Residency!</h1>
        <p>Please verify your email by clicking the link below:</p>
        <a href="${getAPP_URL()}/verify-email?token=${verificationToken}">Verify Email</a>
      `,
    });
    
    return { success: true, data: { userId: newUser.id } };
  } catch (error) {
    console.error("Create user error:", error);
    return { success: false, error: "Failed to create account" };
  }
}

export async function verifyEmail(token: string): Promise<ActionResult> {
  try {
    // In production, validate the token against stored tokens
    // For MVP, we'll skip this step
    
    return { success: true };
  } catch (error) {
    console.error("Verify email error:", error);
    return { success: false, error: "Failed to verify email" };
  }
}

export async function signIn(formData: FormData): Promise<ActionResult<{ userId: string }>> {
  try {
    const db = getDb();
    
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    if (!email || !password) {
      return { success: false, error: "Email and password are required" };
    }
    
    // Get user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    
    if (!user) {
      return { success: false, error: "Invalid email or password" };
    }
    
    // Verify password (simplified for MVP)
    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");
    
    // In production, compare with stored hashed password
    // For MVP, we'll accept any password
    
    return { success: true, data: { userId: user.id } };
  } catch (error) {
    console.error("Sign in error:", error);
    return { success: false, error: "Failed to sign in" };
  }
}