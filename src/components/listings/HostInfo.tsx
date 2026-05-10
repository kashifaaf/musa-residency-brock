import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getInitials } from '@/lib/utils';
import type { User } from '@/lib/db/schema';

interface HostInfoProps {
  host: User;
}

export function HostInfo({ host }: HostInfoProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-primary flex items-center justify-center text-primary-foreground">
            {host.image ? (
              <Image
                src={host.image}
                alt={host.name || 'Host'}
                fill
                className="object-cover"
              />
            ) : (
              <span className="text-xl font-semibold">{getInitials(host.name)}</span>
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold">Hosted by {host.name || 'Anonymous'}</h3>
            {host.location && (
              <p className="text-sm text-muted-foreground">{host.location}</p>
            )}
            
            {host.bio && (
              <p className="mt-3 text-sm">{host.bio}</p>
            )}
            
            {host.workInfo && (
              <div className="mt-3">
                <p className="text-sm font-medium">Work</p>
                <p className="text-sm text-muted-foreground">{host.workInfo}</p>
              </div>
            )}
            
            <div className="mt-4">
              <Button asChild variant="outline" size="sm">
                <Link href={`/profile/${host.id}`}>View Profile</Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}