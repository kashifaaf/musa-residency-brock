import { SignUpForm } from "@/components/auth/SignUpForm";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create your account</h1>
          <p className="mt-2 text-gray-600">
            Join our community of remote workers
          </p>
        </div>
        
        <SignUpForm />
        
        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/auth/signin" className="font-medium text-primary-600 hover:text-primary-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}