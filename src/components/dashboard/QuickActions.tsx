import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Search, Calendar, MessageSquare } from 'lucide-react';

interface QuickActionsProps {
  hasListings: boolean;
}

export function QuickActions({ hasListings }: QuickActionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button asChild className="w-full justify-start" variant="outline">
          <Link href="/listings/new">
            <Plus className="mr-2 h-4 w-4" />
            List a New Space
          </Link>
        </Button>
        
        <Button asChild className="w-full justify-start" variant="outline">
          <Link href="/listings">
            <Search className="mr-2 h-4 w-4" />
            Browse Listings
          </Link>
        </Button>
        
        {hasListings && (
          <Button asChild className="w-full justify-start" variant="outline">
            <Link href="/bookings?tab=host">
              <Calendar className="mr-2 h-4 w-4" />
              Manage Bookings
            </Link>
          </Button>
        )}
        
        <Button asChild className="w-full justify-start" variant="outline">
          <Link href="/messages">
            <MessageSquare className="mr-2 h-4 w-4" />
            Messages
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}