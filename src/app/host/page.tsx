import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BecomeHostHero } from '@/components/host/BecomeHostHero'

export const dynamic = 'force-dynamic'

export default async function BecomeHostPage() {
  const session = await auth()

  if (session?.user?.isHost) {
    redirect('/host/dashboard')
  }

  return (
    <>
      <Header />
      <main>
        <BecomeHostHero />
      </main>
      <Footer />
    </>
  )
}