"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import { markNotificationAsRead } from '@/actions/notifications';
import type { Notification } from '@/lib/db/schema';

interface RecentActivityProps {
  notifications: Notification[];
}

export function RecentActivity({ notifications }: RecentActivityProps) {
  if (notifications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No recent activity to show.</p>
        </CardContent>
      </Card>
    );
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking_request':
        return '📅';
      case 'booking_approved':
        return '✅';
      case 'booking_declined':
        return '❌';
      case 'booking_cancelled':
        return '🚫';
      case 'payment_success':
        return '💰';
      default:
        return '📢';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                notification.read ? 'opacity-60' : 'bg-secondary'
              }`}
              onClick={() => {
                if (!notification.read) {
                  markNotificationAsRead(notification.id);
                }
              }}
            >
              <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
              <div className="flex-1">
                <p className="font-medium text-sm">{notification.title}</p>
                <p className="text-sm text-muted-foreground">{notification.content}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDate(notification.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}