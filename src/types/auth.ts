import type { User } from "@/types";

declare module "next-auth" {
  interface Session {
    user: User & {
      id: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "guest" | "host" | "both";
  }
}