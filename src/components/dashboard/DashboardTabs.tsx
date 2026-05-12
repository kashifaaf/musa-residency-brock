"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GuestBookings } from "./GuestBookings";
import { HostBookings } from "./HostBookings";
import { HostListings } from "./HostListings";
import { ProfileSettings } from "./ProfileSettings";
import type { UserRole } from "@/types";

interface DashboardTabsProps {
  userId: string;
  userRole: UserRole;
}

export function DashboardTabs({ userId, userRole }: DashboardTabsProps) {
  return (
    <Tabs defaultValue="bookings" className="space-y-6">
      <TabsList>
        <TabsTrigger value="bookings">My Trips</TabsTrigger>
        {(userRole === "host" || userRole === "both") && (
          <>
            <TabsTrigger value="hosting">Hosting</TabsTrigger>
            <TabsTrigger value="listings">My Listings</TabsTrigger>
          </>
        )}
        <TabsTrigger value="profile">Profile</TabsTrigger>
      </TabsList>

      <TabsContent value="bookings">
        <GuestBookings userId={userId} />
      </TabsContent>

      {(userRole === "host" || userRole === "both") && (
        <>
          <TabsContent value="hosting">
            <HostBookings userId={userId} />
          </TabsContent>
          
          <TabsContent value="listings">
            <HostListings userId={userId} />
          </TabsContent>
        </>
      )}

      <TabsContent value="profile">
        <ProfileSettings userId={userId} />
      </TabsContent>
    </Tabs>
  );
}