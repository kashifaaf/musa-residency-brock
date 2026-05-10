import { User } from "./index";

export interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  emailVerified: boolean;
}

export type SafeUser = Omit<User, "hashedPassword">;

export interface SignUpInput {
  email: string;
  password: string;
  name: string;
}

export interface SignInInput {
  email: string;
  password: string;
}

export interface ResetPasswordInput {
  token: string;
  password: string;
}

export interface UpdateProfileInput {
  name?: string;
  bio?: string;
  location?: string;
  workInfo?: string;
  socialMedia?: {
    instagram?: string;
    website?: string;
    linkedin?: string;
  };
  isArtist?: boolean;
  artistType?: string;
  portfolioUrl?: string;
}