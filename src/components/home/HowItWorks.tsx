import { Search, Calendar, Home } from 'lucide-react'

const steps = [
  {
    icon: Search,
    title: 'Find Your Perfect Space',
    description: 'Browse creative homes and studios from artists around the world. Filter by location, dates, and amenities.',
  },
  {
    icon: Calendar,
    title: 'Request to Book',
    description: 'Send a booking request with your travel dates. Hosts have 24 hours to review and respond.',
  },
  {
    icon: Home,
    title: 'Exchange & Create',
    description: 'Once approved, complete your payment and start planning your creative residency.',
  },
]

export function HowItWorks() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-gray-600">
            Start your creative journey in three simple steps
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-600 mb-4">
                <step.icon className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-xl mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}