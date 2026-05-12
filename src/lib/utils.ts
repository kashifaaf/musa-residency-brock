import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatDate(date: Date | string, format: "short" | "long" = "short"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  
  if (format === "short") {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(d);
  }
  
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

export function getDaysFromNow(date: Date | string): number {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffTime = Math.abs(d.getTime() - now.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getResponseDeadline(createdAt: Date | string): Date {
  const d = typeof createdAt === "string" ? new Date(createdAt) : createdAt;
  const deadline = new Date(d);
  deadline.setHours(deadline.getHours() + 24);
  return deadline;
}

export function isWithin24Hours(createdAt: Date | string): boolean {
  const deadline = getResponseDeadline(createdAt);
  return deadline > new Date();
}

export function generateBookingCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}