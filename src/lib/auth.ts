import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';

const secretKey = process.env.JWT_SECRET || 'fallback-secret-key';
const key = new TextEncoder().encode(secretKey);

export interface JWTPayload {
  userId: string;
  email: string;
  exp?: number;
}

export async function signJWT(payload: Omit<JWTPayload, 'exp'>): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key);
}

export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, key);
    return payload as JWTPayload;
  } catch (error) {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}