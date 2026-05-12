import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";

// Force dynamic rendering since this page requires authentication
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <DashboardTabs userId={session.user.id} userRole={session.user.role} />
    </div>
  );
}