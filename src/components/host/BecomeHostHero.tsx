'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { updateUserToHost } from '@/actions/users'
import { Home, Users, Shield, DollarSign } from 'lucide-react'
import { useSession } from 'next-auth/react'

const benefits = [
  {
    icon: DollarSign,
    title: 'Earn from your empty home',
    description: 'Turn your space into income while you travel or work elsewhere.',
  },
  {
    icon: Users,
    title: 'Connect with creative minds',
    description: 'Meet artists and remote workers from around the world.',
  },
  {
    icon: Shield,
    title: 'Secure and simple',
    description: 'We handle payments, provide host protection, and support you 24/7.',
  },
  {
    icon: Home,
    title: 'You\'re in control',
    description: 'Set your availability, prices, and house rules. Approve guests before they book.',
  },
]

export function BecomeHostHero() {
  const router = useRouter()
  const { data: session, update } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleBecomeHost = async () => {
    if (!session) {
      router.push('/auth/signin')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await updateUserToHost()
      if (result.success) {
        await update() // Update the session
        router.push('/host/onboarding')
      } else {
        setError(result.error || 'Failed to update account')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Share your creative space with the world
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Join our community of hosts and earn money by welcoming artists and remote workers into your home.
            </p>
            
            {error && (
              <div className="mb-6 p-4 text-sm text-error-600 bg-error-50 rounded-md max-w-md mx-auto">
                {error}
              </div>
            )}

            <Button
              size="lg"
              onClick={handleBecomeHost}
              disabled={isLoading}
              className="px-8"
            >
              {isLoading ? 'Setting up...' : 'Start Hosting'}
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why host on Musa Residency?</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                    <benefit.icon className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">How it works</h2>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Create your listing</h3>
                  <p className="text-gray-600">Add photos, describe your space, and highlight creative amenities.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Set your availability</h3>
                  <p className="text-gray-600">Choose when your home is available and set your nightly rate.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Review booking requests</h3>
                  <p className="text-gray-600">You have 24 hours to review guest profiles and approve bookings.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Get paid securely</h3>
                  <p className="text-gray-600">We handle payments and transfer your earnings after check-in.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to start hosting?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join our community of creative hosts today.
          </p>
          <Button
            size="lg"
            onClick={handleBecomeHost}
            disabled={isLoading}
            className="px-8"
          >
            {isLoading ? 'Setting up...' : 'Get Started'}
          </Button>
        </div>
      </section>
    </div>
  )
}