import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { SignInForm } from '@/components/auth/SignInForm'

export const dynamic = 'force-dynamic'

export default async function SignInPage() {
  const session = await auth()

  if (session) {
    redirect('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="mt-2 text-gray-600">
            Sign in to your account to continue
          </p>
        </div>
        <SignInForm />
      </div>
    </div>
  )
}