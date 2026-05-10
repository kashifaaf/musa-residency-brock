import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Calendar, Bell } from 'lucide-react';

interface DashboardStatsProps {
  listingsCount: number;
  upcomingBookingsCount: number;
  unreadNotificationsCount: number;
}

export function DashboardStats({
  listingsCount,
  upcomingBookingsCount,
  unreadNotificationsCount,
}: DashboardStatsProps) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
          <Home className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{listingsCount}</div>
          <p className="text-xs text-muted-foreground">
            {listingsCount === 1 ? 'Space available' : 'Spaces available'}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Upcoming Stays</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{upcomingBookingsCount}</div>
          <p className="text-xs text-muted-foreground">
            {upcomingBookingsCount === 1 ? 'Booking scheduled' : 'Bookings scheduled'}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Notifications</CardTitle>
          <Bell className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{unreadNotificationsCount}</div>
          <p className="text-xs text-muted-foreground">
            {unreadNotificationsCount === 1 ? 'Unread notification' : 'Unread notifications'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}