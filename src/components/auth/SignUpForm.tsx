"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, MapPin, Briefcase } from "lucide-react";
import { createUser } from "@/actions/auth";

export function SignUpForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await createUser(formData);
      
      if (!result.success) {
        setError(result.error || "Failed to create account");
        return;
      }
      
      // Redirect to email verification page
      router.push("/verify-email");
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
          Full name
        </label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 focus:border-primary-500 focus:outline-none"
            placeholder="John Doe"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
          Email address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 focus:border-primary-500 focus:outline-none"
            placeholder="john@example.com"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 focus:border-primary-500 focus:outline-none"
            placeholder="••••••••"
          />
        </div>
        <p className="mt-1 text-sm text-gray-600">
          Must be at least 8 characters
        </p>
      </div>
      
      <div>
        <label htmlFor="location" className="mb-1 block text-sm font-medium text-gray-700">
          Location
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            id="location"
            name="location"
            type="text"
            required
            className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 focus:border-primary-500 focus:outline-none"
            placeholder="San Francisco, CA"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="workInfo" className="mb-1 block text-sm font-medium text-gray-700">
          What do you do?
        </label>
        <div className="relative">
          <Briefcase className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            id="workInfo"
            name="workInfo"
            type="text"
            className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 focus:border-primary-500 focus:outline-none"
            placeholder="Product Designer at Acme Inc"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="bio" className="mb-1 block text-sm font-medium text-gray-700">
          Tell us about yourself
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={3}
          className="w-full rounded-lg border border-gray-300 py-3 px-3 focus:border-primary-500 focus:outline-none"
          placeholder="I love exploring new cities and meeting fellow remote workers..."
        />
      </div>
      
      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-primary-600 py-3 text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {isLoading ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}