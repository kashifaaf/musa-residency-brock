import Image from "next/image";
import Link from "next/link";
import { Calendar, MessageSquare, Shield } from "lucide-react";
import { type User } from "@/types";
import { formatDate } from "@/lib/utils";

interface HostInfoProps {
  host: User;
}

export function HostInfo({ host }: HostInfoProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
      <h2 className="mb-4 text-xl font-semibold">Meet your host</h2>
      
      <div className="flex items-start gap-4">
        <div className="relative h-16 w-16 overflow-hidden rounded-full bg-gray-300">
          {host.profileImage ? (
            <Image
              src={host.profileImage}
              alt={host.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-2xl font-semibold text-gray-600">
              {host.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="mb-1 text-lg font-semibold">{host.name}</h3>
          {host.location && (
            <p className="mb-2 text-sm text-gray-600">{host.location}</p>
          )}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Joined {formatDate(host.createdAt)}</span>
            </div>
            {host.responseRate && (
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>{Math.round(Number(host.responseRate) * 100)}% response rate</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {host.bio && (
        <div className="mt-4">
          <p className="text-gray-700">{host.bio}</p>
        </div>
      )}
      
      {host.workInfo && (
        <div className="mt-4">
          <h4 className="mb-2 font-semibold">Work</h4>
          <p className="text-gray-700">{host.workInfo}</p>
        </div>
      )}
      
      <div className="mt-6 flex items-center gap-2 text-sm text-gray-600">
        <Shield className="h-4 w-4" />
        <span>Identity verified</span>
      </div>
    </div>
  );
}