import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        
        <div>
          <h1 className="text-3xl font-bold">Check your email</h1>
          <p className="mt-2 text-gray-600">
            We've sent a verification link to your email address. 
            Please click the link to verify your account.
          </p>
        </div>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Didn't receive the email? Check your spam folder or{" "}
            <button className="font-medium text-primary-600 hover:text-primary-500">
              resend verification email
            </button>
          </p>
          
          <Link
            href="/login"
            className="block w-full rounded-lg bg-primary-600 py-3 text-white hover:bg-primary-700"
          >
            Continue to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}