import Image from "next/image";
import Link from "next/link";
import { Edit, Calendar, Eye, Pause, Play, Trash } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

interface ListingManagementCardProps {
  listing: any;
}

export function ListingManagementCard({ listing }: ListingManagementCardProps) {
  const getStatusBadge = () => {
    switch (listing.status) {
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "published":
        return <Badge variant="default" className="bg-green-600">Published</Badge>;
      case "paused":
        return <Badge variant="outline">Paused</Badge>;
      case "archived":
        return <Badge variant="destructive">Archived</Badge>;
    }
  };

  return (
    <Card className="p-6">
      <div className="flex gap-6">
        <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={listing.photos[0]?.url || "/placeholder.jpg"}
            alt={listing.title}
            fill
            className="object-cover"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold truncate">{listing.title}</h3>
            {getStatusBadge()}
          </div>
          
          <p className="text-sm text-muted-foreground mb-3">
            {listing.city}, {listing.country} • {formatCurrency(Number(listing.pricePerNight))}/night
          </p>
          
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={`/listings/${listing.id}`}>
                <Eye className="h-4 w-4 mr-2" />
                View
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="sm">
              <Link href={`/host/listings/${listing.id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="sm">
              <Link href={`/host/listings/${listing.id}/calendar`}>
                <Calendar className="h-4 w-4 mr-2" />
                Calendar
              </Link>
            </Button>
            
            {listing.status === "published" && (
              <Button variant="outline" size="sm">
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
            )}
            
            {listing.status === "paused" && (
              <Button variant="outline" size="sm">
                <Play className="h-4 w-4 mr-2" />
                Publish
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}