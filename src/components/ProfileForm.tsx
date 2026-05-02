'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { Card } from './ui/Card';
import { ImageUpload } from './ImageUpload';
import { User } from '@/lib/db/schema';
import { updateProfile } from '@/app/actions/profile';

interface ProfileFormProps {
  user: User;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || '',
    bio: user.bio || '',
    location: user.location || '',
    workInfo: user.workInfo || '',
    socialMedia: user.socialMedia || '',
    profilePhoto: user.profilePhoto || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await updateProfile(formData);
      if (result.success) {
        router.refresh();
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (urls: string[]) => {
    if (urls.length > 0) {
      setFormData(prev => ({ ...prev, profilePhoto: urls[0] }));
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-4">
            Profile Photo
          </label>
          <ImageUpload
            onUpload={handleImageUpload}
            existingImages={formData.profilePhoto ? [formData.profilePhoto] : []}
            maxImages={1}
          />
        </div>

        <Input
          label="Full Name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
        />

        <Input
          label="Location"
          value={formData.location}
          onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
          placeholder="City, Country"
        />

        <Textarea
          label="Bio"
          value={formData.bio}
          onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
          placeholder="Tell hosts about yourself..."
          rows={4}
        />

        <Textarea
          label="Work Information"
          value={formData.workInfo}
          onChange={(e) => setFormData(prev => ({ ...prev, workInfo: e.target.value }))}
          placeholder="What do you do for work? Are you remote-capable?"
          rows={3}
        />

        <Input
          label="Social Media"
          value={formData.socialMedia}
          onChange={(e) => setFormData(prev => ({ ...prev, socialMedia: e.target.value }))}
          placeholder="Instagram, LinkedIn, or website URL"
        />

        <Button
          type="submit"
          loading={loading}
          className="w-full"
        >
          Save Profile
        </Button>
      </form>
    </Card>
  );
}