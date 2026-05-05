import { DashboardNav } from './dashboard-nav';
import { DashboardHeader as TopHeader } from './dashboard-top-header';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopHeader />
      
      <div className="flex">
        <DashboardNav />
        
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}