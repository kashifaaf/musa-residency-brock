"use server";

import { signIn, signOut } from '@/lib/auth/config';
import { AuthError } from 'next-auth';

type ActionResult<T> = { success: true; data: T } | { success: false; error: string };

export async function authenticate(
  email: string,
  password: string
): Promise<ActionResult<void>> {
  try {
    await signIn('credentials', {
      email,
      password,
      action: 'login',
      redirect: false,
    });
    
    return { success: true, data: undefined };
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, error: 'Invalid credentials' };
    }
    return { success: false, error: 'An error occurred during authentication' };
  }
}

export async function registerUser(
  email: string,
  password: string,
  name: string
): Promise<ActionResult<void>> {
  try {
    await signIn('credentials', {
      email,
      password,
      name,
      action: 'signup',
      redirect: false,
    });
    
    return { success: true, data: undefined };
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, error: 'User already exists or invalid data' };
    }
    return { success: false, error: 'An error occurred during registration' };
  }
}

export async function logout(): Promise<ActionResult<void>> {
  try {
    await signOut({ redirect: false });
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, error: 'An error occurred during logout' };
  }
}