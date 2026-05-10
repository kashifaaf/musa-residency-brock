"use client";

import { ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // Add any client-side providers here (e.g., Stripe, analytics, etc.)
  // For now, just pass through children
  return <>{children}</>;
}