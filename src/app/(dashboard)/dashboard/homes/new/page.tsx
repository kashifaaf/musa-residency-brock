import { CreateHomeForm } from '@/components/forms/create-home-form';

export default function NewHomePage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">List Your Home</h1>
        <p className="text-gray-600">Share your space with fellow creatives from around the world</p>
      </div>
      <CreateHomeForm />
    </div>
  );
}