import { getDb } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatRelativeDate } from '@/lib/utils';
import { Bell } from 'lucide-react';

interface RecentActivityProps {
  userId: string;
}

export async function RecentActivity({ userId }: RecentActivityProps) {
  const db = getDb();
  
  const notifications = await db.query.notifications.findMany({
    where: (notifications, { eq }) => eq(notifications.userId, userId),
    orderBy: (notifications, { desc }) => desc(notifications.createdAt),
    limit: 10,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <p className="text-gray-500">No recent activity</p>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 rounded-lg ${
                  notification.isRead ? 'bg-gray-50' : 'bg-primary-50'
                }`}
              >
                <h4 className="font-medium text-sm">{notification.title}</h4>
                <p className="text-sm text-gray-600 mt-1">
                  {notification.message}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatRelativeDate(notification.createdAt)}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}