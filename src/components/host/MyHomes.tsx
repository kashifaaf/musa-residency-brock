"use client";

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Eye, Calendar } from 'lucide-react';
import type { Home } from '@/types';

interface MyHomesProps {
  homes: Home[];
}

export function MyHomes({ homes }: MyHomesProps) {
  return (
    <div className="grid gap-6">
      {homes.map((home) => (
        <Card key={home.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{home.title}</CardTitle>
                <p className="text-sm text-gray-600 flex items-center mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  {home.city}, {home.country}
                </p>
              </div>
              <Badge variant={home.isActive ? 'success' : 'secondary'}>
                {home.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  Visibility: {home.visibilityScore}%
                </span>
              </div>
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/host/${home.id}/availability`}>
                    <Calendar className="h-4 w-4 mr-1" />
                    Availability
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/homes/${home.id}`}>View</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href={`/host/${home.id}/edit`}>Edit</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}