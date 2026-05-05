import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { GoogleSignInButton } from "@/components/GoogleSignInButton"

export default async function SignInPage() {
  const session = await auth()

  if (session) {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center">
          <h1 className="text-3xl font-bold text-orange-600">Musa Residency</h1>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Welcome to the creative community
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Join artists worldwide in sharing inspiring spaces
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <GoogleSignInButton />
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Why join Musa Residency?</span>
              </div>
            </div>

            <div className="space-y-4 text-sm text-gray-600">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Connect with verified artists and creatives worldwide</span>
              </div>
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Find inspiring spaces with creative amenities</span>
              </div>
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>24-hour approval process with transparent pricing</span>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-500">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}