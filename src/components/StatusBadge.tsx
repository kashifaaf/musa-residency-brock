import { cn } from "@/lib/utils"
import type { BookingStatus } from "@/types"

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  approved: "bg-blue-50 text-blue-700 border-blue-200",
  paid: "bg-green-50 text-green-700 border-green-200",
  active: "bg-primary-50 text-primary-700 border-primary-200",
  completed: "bg-gray-50 text-gray-700 border-gray-200",
  declined: "bg-red-50 text-red-700 border-red-200",
  expired: "bg-orange-50 text-orange-700 border-orange-200",
  cancelled: "bg-gray-50 text-gray-500 border-gray-200",
}

export function StatusBadge({ status }: { status: BookingStatus | string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
        statusStyles[status] || "bg-gray-50 text-gray-700 border-gray-200"
      )}
    >
      {status}
    </span>
  )
}