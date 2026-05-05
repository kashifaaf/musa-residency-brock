import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { SignInForm } from "@/components/SignInForm"

export default async function SignInPage() {
  const session = await auth()
  
  if (session) {
    redirect("/")
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Musa Residency</h1>
          <p className="text-gray-600">Sign in to start your creative journey</p>
        </div>
        
        <SignInForm />
        
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>By signing in, you agree to our Terms of Service and Privacy Policy.</p>
        </div>
      </div>
    </div>
  )
}