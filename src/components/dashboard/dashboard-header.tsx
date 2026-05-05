import { getSession } from '@/lib/session';

export async function DashboardHeader() {
  const session = await getSession();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="text-gray-600">Welcome back, {session?.email}</p>
    </div>
  );
}