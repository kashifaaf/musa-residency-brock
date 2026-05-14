"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { createHome } from '@/actions/home';
import { UploadButton } from '@/lib/uploadthing';
import Image from 'next/image';
import { X } from 'lucide-react';

interface CreateHomeFormProps {
  hostId: string;
}

export function CreateHomeForm({ hostId }: CreateHomeFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    city: '',
    state: '',
    country: '',
    houseRules: '',
    amenities: {
      bedrooms: 1,
      bathrooms: 1,
      workspace: false,
      wifi: false,
      kitchen: false,
      parking: false,
      artStudio: false,
      instruments: false,
      other: [] as string[],
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (images.length === 0) {
      toast.error('Please upload at least one photo');
      return;
    }

    setIsLoading(true);

    try {
      const result = await createHome({
        ...formData,
        images,
      });

      if (result.success && result.data) {
        toast.success('Home created successfully!');
        router.push('/host');
      } else {
        toast.error(result.error || 'Failed to create home');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>List Your Home</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Cozy Artist Loft in Brooklyn"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your space, the neighborhood, and what makes it special..."
                rows={5}
                required
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="font-semibold">Location</h3>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="123 Main Street"
                required
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Brooklyn"
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">State/Province</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="NY"
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="USA"
                  required
                />
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="space-y-4">
            <h3 className="font-semibold">Amenities</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  min="1"
                  value={formData.amenities.bedrooms}
                  onChange={(e) => setFormData({
                    ...formData,
                    amenities: { ...formData.amenities, bedrooms: Number(e.target.value) }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  min="1"
                  step="0.5"
                  value={formData.amenities.bathrooms}
                  onChange={(e) => setFormData({
                    ...formData,
                    amenities: { ...formData.amenities, bathrooms: Number(e.target.value) }
                  })}
                />
              </div>
            </div>

            <div className="space-y-2">
              {Object.entries(formData.amenities).map(([key, value]) => {
                if (key === 'bedrooms' || key === 'bathrooms' || key === 'other') return null;
                return (
                  <div key={key} className="flex items-center space-x-2">
                    <Switch
                      id={key}
                      checked={value as boolean}
                      onCheckedChange={(checked) => setFormData({
                        ...formData,
                        amenities: { ...formData.amenities, [key]: checked }
                      })}
                    />
                    <Label htmlFor={key} className="cursor-pointer capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>

          {/* House Rules */}
          <div>
            <Label htmlFor="houseRules">House Rules (optional)</Label>
            <Textarea
              id="houseRules"
              value={formData.houseRules}
              onChange={(e) => setFormData({ ...formData, houseRules: e.target.value })}
              placeholder="No smoking, no parties, quiet hours after 10pm..."
              rows={3}
            />
          </div>

          {/* Images */}
          <div className="space-y-4">
            <Label>Photos</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <Image
                    src={image}
                    alt={`Home photo ${index + 1}`}
                    width={200}
                    height={150}
                    className="rounded-lg object-cover w-full h-32"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <UploadButton
              endpoint="homeImages"
              onClientUploadComplete={(res) => {
                if (res) {
                  const urls = res.map(file => file.url);
                  setImages([...images, ...urls]);
                  toast.success(`${res.length} photos uploaded`);
                }
              }}
              onUploadError={(error: Error) => {
                toast.error(`Upload failed: ${error.message}`);
              }}
            />
            <p className="text-sm text-gray-600">
              Upload up to 10 photos. The first photo will be your main image.
            </p>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Creating...' : 'Create Listing'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}