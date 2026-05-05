import { requireAuth } from '@/lib/session';
import { DashboardLayout } from '@/components/layout/dashboard-layout';

export default async function DashboardLayoutPage({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth(); // This will throw if not authenticated

  return <DashboardLayout>{children}</DashboardLayout>;
}