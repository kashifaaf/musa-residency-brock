import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/signin')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Welcome back!</h2>
          <p className="text-gray-600">
            Hello, {session.user.name || session.user.email}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Your Bookings</h3>
          <p className="text-gray-600">Manage your property bookings</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Your Properties</h3>
          <p className="text-gray-600">List and manage your properties</p>
        </div>
      </div>
    </div>
  )
}