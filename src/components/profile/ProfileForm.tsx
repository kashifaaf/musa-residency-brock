"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { updateProfile } from "@/actions/profile"
import type { User } from "@/types"

interface ProfileFormProps {
  user: User
}

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    setError("")

    const result = await updateProfile(formData)
    
    if (result.success) {
      router.refresh()
    } else {
      setError(result.error)
    }
    
    setIsLoading(false)
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={user.name || ""}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            defaultValue={user.location || ""}
            placeholder="City, Country"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          defaultValue={user.bio || ""}
          placeholder="Tell us about yourself and your artistic practice..."
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
        />
      </div>

      <div>
        <label htmlFor="workInfo" className="block text-sm font-medium text-gray-700">
          Work Information
        </label>
        <textarea
          id="workInfo"
          name="workInfo"
          rows={3}
          defaultValue={user.workInfo || ""}
          placeholder="What do you do for work? How does it support your creative practice?"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
        />
      </div>

      <div>
        <label htmlFor="socialMedia" className="block text-sm font-medium text-gray-700">
          Social Media / Portfolio
        </label>
        <input
          type="text"
          id="socialMedia"
          name="socialMedia"
          defaultValue={user.socialMedia || ""}
          placeholder="Instagram, website, portfolio links..."
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary-500 focus:outline-none focus:ring-primary-500"
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  )
}