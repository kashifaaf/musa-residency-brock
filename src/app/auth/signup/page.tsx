import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth/session";
import { SignUpForm } from "@/components/auth/SignUpForm";
import Link from "next/link";

export default async function SignUpPage() {
  const { user } = await validateRequest();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Or{" "}
            <Link
              href="/auth/signin"
              className="font-medium text-primary hover:text-primary/80"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>
        <SignUpForm />
      </div>
    </div>
  );
}