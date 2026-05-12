"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema } from "@/types";
import { updateProfile } from "@/actions/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import toast from "react-hot-toast";
import type { z } from "zod";

type ProfileData = z.infer<typeof profileSchema>;

interface OnboardingFormProps {
  userId: string;
}

export function OnboardingForm({ userId }: OnboardingFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
  });

  const onSubmit = async (data: ProfileData) => {
    try {
      setIsLoading(true);
      const result = await updateProfile(userId, data);
      
      if (result.success) {
        toast.success("Profile updated successfully!");
        router.push("/dashboard");
      } else {
        toast.error(result.error || "Failed to update profile");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="Your full name"
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            {...register("location")}
            placeholder="City, Country"
          />
          {errors.location && (
            <p className="text-sm text-destructive">{errors.location.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">About you</Label>
          <Textarea
            id="bio"
            {...register("bio")}
            placeholder="Tell us about yourself and your creative practice..."
            rows={4}
          />
          {errors.bio && (
            <p className="text-sm text-destructive">{errors.bio.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="workInfo">Work</Label>
          <Input
            id="workInfo"
            {...register("workInfo")}
            placeholder="What do you do?"
          />
          {errors.workInfo && (
            <p className="text-sm text-destructive">{errors.workInfo.message}</p>
          )}
        </div>

        <div className="space-y-4">
          <Label>Social Links (optional)</Label>
          
          <div className="space-y-2">
            <Input
              {...register("socialLinks.website")}
              placeholder="https://yourwebsite.com"
              type="url"
            />
          </div>

          <div className="space-y-2">
            <Input
              {...register("socialLinks.instagram")}
              placeholder="Instagram username"
            />
          </div>

          <div className="space-y-2">
            <Input
              {...register("socialLinks.linkedin")}
              placeholder="LinkedIn profile"
            />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Saving..." : "Complete Profile"}
        </Button>
      </form>
    </Card>
  );
}