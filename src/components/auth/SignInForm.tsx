"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Github, Mail } from "lucide-react";
import toast from "react-hot-toast";

interface SignInFormProps {
  callbackUrl?: string;
  error?: string;
}

export function SignInForm({ callbackUrl = "/dashboard", error }: SignInFormProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleSignIn = async (provider: string) => {
    try {
      setIsLoading(provider);
      await signIn(provider, { callbackUrl });
    } catch (error) {
      toast.error("Failed to sign in");
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <Card className="p-8">
      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-6">
          {error === "OAuthAccountNotLinked"
            ? "This email is already associated with another account."
            : "An error occurred during sign in. Please try again."}
        </div>
      )}

      <div className="space-y-4">
        <Button
          onClick={() => handleSignIn("google")}
          variant="outline"
          className="w-full"
          disabled={isLoading !== null}
        >
          <Mail className="mr-2 h-4 w-4" />
          {isLoading === "google" ? "Signing in..." : "Continue with Google"}
        </Button>

        <Button
          onClick={() => handleSignIn("github")}
          variant="outline"
          className="w-full"
          disabled={isLoading !== null}
        >
          <Github className="mr-2 h-4 w-4" />
          {isLoading === "github" ? "Signing in..." : "Continue with GitHub"}
        </Button>
      </div>

      <Separator className="my-6" />

      <p className="text-center text-sm text-muted-foreground">
        By signing in, you agree to our Terms of Service and Privacy Policy
      </p>
    </Card>
  );
}