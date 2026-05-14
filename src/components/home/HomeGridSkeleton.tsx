"use client";

import { Card, CardContent } from '@/components/ui/card';

export function HomeGridSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <div className="h-48 bg-gray-200 animate-pulse" />
          <CardContent className="p-4">
            <div className="h-6 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3 mb-2" />
            <div className="flex justify-between items-center">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3" />
              <div className="h-5 bg-gray-200 rounded animate-pulse w-1/4" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}