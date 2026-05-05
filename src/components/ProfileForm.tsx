"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { User } from "@/lib/db/schema"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { updateProfile } from "@/app/actions/profile"

interface ProfileFormProps {
  user: User
}

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  
  const [formData, setFormData] = useState({
    name: user.name || "",
    bio: user.bio || "",
    location: user.location || "",
    workInfo: user.workInfo || "",
    socialMediaUrl: user.socialMediaUrl || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")
    
    try {
      const result = await updateProfile(formData)
      
      if (result.success) {
        setSuccess("Profile updated successfully!")
        router.refresh()
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center space-x-6">
        {user.image ? (
          <img
            src={user.image}
            alt={user.name || "User"}
            className="w-20 h-20 rounded-full"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-2xl text-gray-500">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{user.email}</h3>
          <p className="text-sm text-gray-500">Profile photo from Google account</p>
        </div>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name *
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
          Location
        </label>
        <Input
          id="location"
          name="location"
          type="text"
          placeholder="e.g., San Francisco, CA"
          value={formData.location}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
          Bio
        </label>
        <Textarea
          id="bio"
          name="bio"
          placeholder="Tell other artists about yourself, your work, and what you're looking for in a creative space..."
          rows={4}
          value={formData.bio}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="workInfo" className="block text-sm font-medium text-gray-700 mb-1">
          Work Information
        </label>
        <Textarea
          id="workInfo"
          name="workInfo"
          placeholder="What type of artistic work do you do? Are you able to work remotely?"
          rows={3}
          value={formData.workInfo}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="socialMediaUrl" className="block text-sm font-medium text-gray-700 mb-1">
          Portfolio/Social Media URL
        </label>
        <Input
          id="socialMediaUrl"
          name="socialMediaUrl"
          type="url"
          placeholder="https://..."
          value={formData.socialMediaUrl}
          onChange={handleChange}
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      {success && (
        <div className="text-green-600 text-sm">{success}</div>
      )}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-red-500 hover:bg-red-600"
      >
        {isLoading ? "Updating..." : "Update Profile"}
      </Button>
    </form>
  )
}