"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { updateProfile } from '@/actions/user';
import { UploadButton } from '@/lib/uploadthing';
import type { User } from '@/types';

interface ProfileFormProps {
  user: User;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(user.profileImage || '');
  const [formData, setFormData] = useState({
    name: user.name || '',
    bio: user.bio || '',
    location: user.location || '',
    workInfo: user.workInfo || '',
    isHost: user.isHost,
    socialLinks: user.socialLinks || {},
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await updateProfile({
        ...formData,
        profileImage,
        socialLinks: formData.socialLinks as any,
      });

      if (result.success) {
        toast.success('Profile updated successfully');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image */}
          <div>
            <Label>Profile Photo</Label>
            <div className="mt-2 flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profileImage} />
                <AvatarFallback>
                  {user.email.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <UploadButton
                endpoint="profileImage"
                onClientUploadComplete={(res) => {
                  if (res?.[0]) {
                    setProfileImage(res[0].url);
                    toast.success('Photo uploaded');
                  }
                }}
                onUploadError={(error: Error) => {
                  toast.error(`Upload failed: ${error.message}`);
                }}
              />
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your name"
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="City, Country"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell us about yourself..."
              rows={4}
            />
          </div>

          {/* Work Info */}
          <div>
            <Label htmlFor="workInfo">Work Information</Label>
            <Textarea
              id="workInfo"
              value={formData.workInfo}
              onChange={(e) => setFormData({ ...formData, workInfo: e.target.value })}
              placeholder="What do you do for work?"
              rows={3}
            />
          </div>

          {/* Social Links */}
          <div>
            <Label>Social Links</Label>
            <div className="space-y-2 mt-2">
              <Input
                placeholder="Website URL"
                value={formData.socialLinks.website || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, website: e.target.value }
                })}
              />
              <Input
                placeholder="Instagram handle"
                value={formData.socialLinks.instagram || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, instagram: e.target.value }
                })}
              />
              <Input
                placeholder="LinkedIn URL"
                value={formData.socialLinks.linkedin || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, linkedin: e.target.value }
                })}
              />
            </div>
          </div>

          {/* Host Toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              id="isHost"
              checked={formData.isHost}
              onCheckedChange={(checked) => setFormData({ ...formData, isHost: checked })}
            />
            <Label htmlFor="isHost" className="cursor-pointer">
              I want to host my home
            </Label>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}