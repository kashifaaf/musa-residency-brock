import { Button } from "@/components/ui/Button"
import { SearchForm } from "@/components/SearchForm"
import { FeaturedHomes } from "@/components/FeaturedHomes"
import Link from "next/link"
import { Palette, Users, Globe } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-pink-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Creative Home Exchange
            <br />
            <span className="text-orange-600">for Artists</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Connect with fellow artists worldwide. Exchange homes, studios, and creative spaces 
            for authentic cultural immersion and artistic inspiration.
          </p>
          
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6 mb-8">
            <SearchForm />
          </div>
          
          <div className="flex justify-center space-x-4">
            <Link href="/search">
              <Button size="lg">Start Exploring</Button>
            </Link>
            <Link href="/host">
              <Button variant="outline" size="lg">List Your Space</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Designed for Creative Minds
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Palette className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Artist-First Design
              </h3>
              <p className="text-gray-600">
                Spaces designed with creative work in mind. Find studios, inspiring environments, 
                and homes that understand an artist's needs.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Creative Community
              </h3>
              <p className="text-gray-600">
                Connect with like-minded artists. Share portfolios, collaborate, 
                and build lasting relationships across the globe.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Cultural Exchange
              </h3>
              <p className="text-gray-600">
                Immerse yourself in local art scenes. Get insider knowledge 
                from fellow creatives about galleries, studios, and communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Homes */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Featured Creative Spaces
          </h2>
          <FeaturedHomes />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Creative Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join our community of artists creating, sharing, and inspiring across the world.
          </p>
          <Link href="/auth/signin">
            <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
              Join Musa Residency
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}