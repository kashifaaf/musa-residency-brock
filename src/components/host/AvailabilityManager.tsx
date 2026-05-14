"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus, Trash2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import { addAvailability, removeAvailability } from '@/actions/home';
import type { Availability } from '@/types';

interface AvailabilityManagerProps {
  homeId: string;
  availability: Availability[];
}

export function AvailabilityManager({ homeId, availability }: AvailabilityManagerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleAddAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates');
      return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      toast.error('End date must be after start date');
      return;
    }

    setIsLoading(true);

    try {
      const result = await addAvailability(
        homeId,
        new Date(startDate),
        new Date(endDate)
      );

      if (result.success) {
        toast.success('Availability period added');
        setStartDate('');
        setEndDate('');
      } else {
        toast.error(result.error || 'Failed to add availability');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveAvailability = async (availabilityId: string) => {
    try {
      const result = await removeAvailability(availabilityId);

      if (result.success) {
        toast.success('Availability period removed');
      } else {
        toast.error(result.error || 'Failed to remove availability');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="space-y-6">
      {/* Add New Availability */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Availability Period
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddAvailability} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="pl-10"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="pl-10"
                    min={startDate || new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
              </div>
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Period'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Current Availability */}
      <Card>
        <CardHeader>
          <CardTitle>Current Availability</CardTitle>
        </CardHeader>
        <CardContent>
          {availability.length === 0 ? (
            <p className="text-gray-600">No availability periods set.</p>
          ) : (
            <div className="space-y-3">
              {availability.map((period) => (
                <div
                  key={period.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>
                      {formatDate(period.startDate, 'PP')} - {formatDate(period.endDate, 'PP')}
                    </span>
                    <Badge variant={period.isAvailable ? 'success' : 'secondary'}>
                      {period.isAvailable ? 'Available' : 'Blocked'}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveAvailability(period.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}