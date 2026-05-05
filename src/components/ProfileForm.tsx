"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { updateProfile } from "@/app/actions/profile"
import type { User } from "@/lib/db/schema"

interface ProfileFormProps {
  user: User
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setMessage("")

    const result = await updateProfile(formData)

    if (result.success) {
      setMessage("Profile updated successfully!")
      router.refresh()
    } else {
      setMessage(result.error)
    }

    setIsLoading(false)
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            defaultValue={user.name}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            defaultValue={user.email}
            disabled
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500"
          />
        </div>
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
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
        />
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
          placeholder="Tell us about yourself..."
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
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
          placeholder="What do you do for work? How do you work remotely?"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
        />
      </div>

      <div className="border-t pt-6">
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="isArtist"
            name="isArtist"
            defaultChecked={user.isArtist || false}
            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
          />
          <label htmlFor="isArtist" className="ml-2 block text-sm font-medium text-gray-700">
            I am an artist or creative professional
          </label>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="medium" className="block text-sm font-medium text-gray-700">
              Creative Medium(s)
            </label>
            <input
              type="text"
              id="medium"
              name="medium"
              defaultValue={user.artistInfo?.medium?.join(", ") || ""}
              placeholder="e.g., Painting, Photography, Writing"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div>
            <label htmlFor="portfolio" className="block text-sm font-medium text-gray-700">
              Portfolio URL
            </label>
            <input
              type="url"
              id="portfolio"
              name="portfolio"
              defaultValue={user.artistInfo?.portfolio || ""}
              placeholder="https://..."
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="artistStatement" className="block text-sm font-medium text-gray-700">
            Artist Statement
          </label>
          <textarea
            id="artistStatement"
            name="artistStatement"
            rows={3}
            defaultValue={user.artistInfo?.statement || ""}
            placeholder="Describe your artistic practice and vision..."
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <div className="mt-4">
          <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
            Experience & Background
          </label>
          <textarea
            id="experience"
            name="experience"
            rows={3}
            defaultValue={user.artistInfo?.experience || ""}
            placeholder="Your creative background, exhibitions, publications, etc."
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-md ${
            message.includes("success")
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  )
}