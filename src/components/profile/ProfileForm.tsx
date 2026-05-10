"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/actions/profile";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { User, ArtistType } from "@/types";

interface ProfileFormProps {
  user: User;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await updateProfile(formData);

    if (!result.success) {
      setError(result.error);
      setLoading(false);
      return;
    }

    router.refresh();
    setLoading(false);
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          type="text"
          defaultValue={user.name || ""}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={user.email}
          disabled
          className="mt-1"
        />
        {!user.emailVerified && (
          <p className="mt-1 text-sm text-destructive">Email not verified</p>
        )}
      </div>

      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          name="bio"
          rows={4}
          defaultValue={user.bio || ""}
          placeholder="Tell others about yourself..."
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          type="text"
          defaultValue={user.location || ""}
          placeholder="City, Country"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="workInfo">Work Information</Label>
        <Input
          id="workInfo"
          name="workInfo"
          type="text"
          defaultValue={user.workInfo || ""}
          placeholder="Your profession or company"
          className="mt-1"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Artist Information</h3>
        
        <div>
          <Label htmlFor="isArtist">Are you an artist?</Label>
          <Select
            id="isArtist"
            name="isArtist"
            defaultValue={user.isArtist ? "true" : "false"}
            className="mt-1"
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </Select>
        </div>

        <div>
          <Label htmlFor="artistType">Artist Type</Label>
          <Select
            id="artistType"
            name="artistType"
            defaultValue={user.artistType || ""}
            className="mt-1"
          >
            <option value="">Select type...</option>
            {Object.entries(ArtistType).map(([key, value]) => (
              <option key={key} value={value}>
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="portfolioUrl">Portfolio URL</Label>
          <Input
            id="portfolioUrl"
            name="portfolioUrl"
            type="url"
            defaultValue={user.portfolioUrl || ""}
            placeholder="https://yourportfolio.com"
            className="mt-1"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Social Media</h3>
        
        <div>
          <Label htmlFor="instagram">Instagram</Label>
          <Input
            id="instagram"
            name="instagram"
            type="text"
            defaultValue={user.socialMedia?.instagram || ""}
            placeholder="@username"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            name="website"
            type="url"
            defaultValue={user.socialMedia?.website || ""}
            placeholder="https://yourwebsite.com"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input
            id="linkedin"
            name="linkedin"
            type="text"
            defaultValue={user.socialMedia?.linkedin || ""}
            placeholder="linkedin.com/in/username"
            className="mt-1"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}