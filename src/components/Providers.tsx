"use client";

import { ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // Add client-side providers here as needed (e.g., theme provider, modals, etc.)
  return <>{children}</>;
}