import Link from "next/link";
import { Plus, Home, Calendar, MessageSquare, User } from "lucide-react";
import { redirect } from "next/navigation";

export default function DashboardPage() {
  // Redirect to avoid duplicate routes - this will be handled by the route group
  redirect("/dashboard/overview");
}