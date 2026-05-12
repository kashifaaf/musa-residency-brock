"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema } from "@/types";
import { updateProfile, switchToHost } from "@/actions/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import toast from "react-hot-toast";
import type { z } from "zod";

type ProfileData = z.infer<typeof profileSchema>;

interface ProfileSettingsProps {
  userId: string;
}

export function ProfileSettings({ userId }: ProfileSettingsProps) {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchingRole, setIsSwitchingRole] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: session?.user?.name || "",
      bio: session?.user?.bio || "",
      location: session?.user?.location || "",
      workInfo: session?.user?.workInfo || "",
      socialLinks: session?.user?.socialLinks || {},
    },
  });

  const onSubmit = async (data: ProfileData) => {
    try {
      setIsLoading(true);
      const result = await updateProfile(userId, data);
      
      if (result.success) {
        await update(); // Update session
        toast.success("Profile updated successfully!");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update profile");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchToHost = async () => {
    try {
      setIsSwitchingRole(true);
      const result = await switchToHost(userId);
      
      if (result.success) {
        await update(); // Update session
        toast.success("You can now create listings!");
        router.push("/host/listings/new");
      } else {
        toast.error(result.error || "Failed to switch role");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsSwitchingRole(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
        
        <div className="flex items-center gap-6 mb-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src={session?.user?.image || undefined} />
            <AvatarFallback>{session?.user?.name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{session?.user?.email}</p>
            <p className="text-sm text-muted-foreground">
              Member since {new Date(session?.user?.createdAt || Date.now()).getFullYear()}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" {...register("location")} />
            {errors.location && (
              <p className="text-sm text-destructive">{errors.location.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              {...register("bio")}
              rows={4}
              placeholder="Tell others about yourself..."
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
            <Label>Social Links</Label>
            
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

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </Card>

      {session?.user?.role === "guest" && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Become a Host</h2>
          <p className="text-muted-foreground mb-6">
            Start sharing your creative space with other artists and remote workers.
          </p>
          <Button onClick={handleSwitchToHost} disabled={isSwitchingRole}>
            {isSwitchingRole ? "Switching..." : "Become a Host"}
          </Button>
        </Card>
      )}
    </div>
  );
}