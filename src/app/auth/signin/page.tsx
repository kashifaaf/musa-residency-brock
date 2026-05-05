import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { SignInForm } from "@/components/auth/SignInForm"

export default async function SignInPage() {
  const session = await auth()
  
  if (session) {
    redirect("/")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to Musa Residency
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to start your creative journey
          </p>
        </div>
        <SignInForm />
      </div>
    </div>
  )
}