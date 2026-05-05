"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/Textarea"
import { approveBooking, rejectBooking } from "@/app/actions/booking"
import { Check, X } from "lucide-react"

interface BookingActionsProps {
  bookingId: string
}

export function BookingActions({ bookingId }: BookingActionsProps) {
  const router = useRouter()
  const [showResponse, setShowResponse] = useState(false)
  const [responseMessage, setResponseMessage] = useState("")
  const [action, setAction] = useState<"approve" | "reject" | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleAction = async (actionType: "approve" | "reject") => {
    if (showResponse && action === actionType) {
      // Submit the action with message
      setIsLoading(true)
      setError("")
      
      try {
        const result = actionType === "approve" 
          ? await approveBooking(bookingId, responseMessage || undefined)
          : await rejectBooking(bookingId, responseMessage || undefined)
        
        if (result.success) {
          router.refresh()
        } else {
          setError(result.error)
        }
      } catch (err) {
        setError("Something went wrong. Please try again.")
      } finally {
        setIsLoading(false)
      }
    } else {
      // Show response form
      setAction(actionType)
      setShowResponse(true)
      setError("")
    }
  }

  const handleCancel = () => {
    setShowResponse(false)
    setAction(null)
    setResponseMessage("")
    setError("")
  }

  return (
    <div className="space-y-4">
      {!showResponse ? (
        <div className="flex space-x-3">
          <Button
            onClick={() => handleAction("approve")}
            className="bg-green-600 hover:bg-green-700"
            disabled={isLoading}
          >
            <Check size={16} className="mr-2" />
            Approve
          </Button>
          
          <Button
            onClick={() => handleAction("reject")}
            variant="outline"
            className="border-red-300 text-red-600 hover:bg-red-50"
            disabled={isLoading}
          >
            <X size={16} className="mr-2" />
            Decline
          </Button>
        </div>
      ) : (
        <div className="space-y-4 bg-gray-50 rounded-lg p-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {action === "approve" ? "Welcome message (optional)" : "Reason for declining (optional)"}
            </label>
            <Textarea
              value={responseMessage}
              onChange={(e) => setResponseMessage(e.target.value)}
              placeholder={
                action === "approve" 
                  ? "Welcome! I'm excited to host you. Here are some things you should know..."
                  : "I'm sorry, but I need to decline your request because..."
              }
              rows={3}
            />
          </div>
          
          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}
          
          <div className="flex space-x-3">
            <Button
              onClick={() => handleAction(action!)}
              className={action === "approve" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : (action === "approve" ? "Approve Booking" : "Decline Booking")}
            </Button>
            
            <Button
              onClick={handleCancel}
              variant="outline"
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}