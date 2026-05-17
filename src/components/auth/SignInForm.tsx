'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { FcGoogle } from 'react-icons/fc'

export function SignInForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      setError(null)
      await signIn('google', { callbackUrl: '/' })
    } catch (error) {
      setError('Something went wrong. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow">
      {error && (
        <div className="mb-4 p-4 text-sm text-error-600 bg-error-50 rounded-md">
          {error}
        </div>
      )}

      <Button
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-3"
        variant="outline"
        size="lg"
      >
        <FcGoogle className="h-5 w-5" />
        {isLoading ? 'Signing in...' : 'Continue with Google'}
      </Button>

      <div className="mt-6 text-center text-sm text-gray-600">
        By signing in, you agree to our{' '}
        <a href="/terms" className="text-primary-600 hover:underline">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="/privacy" className="text-primary-600 hover:underline">
          Privacy Policy
        </a>
      </div>
    </div>
  )
}