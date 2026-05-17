import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Musa Residency</h3>
            <p className="text-gray-400">
              Connecting artists worldwide through home exchange.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">For Guests</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/homes" className="hover:text-white">Browse Homes</Link></li>
              <li><Link href="/how-it-works" className="hover:text-white">How It Works</Link></li>
              <li><Link href="/trust-safety" className="hover:text-white">Trust & Safety</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">For Hosts</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/host" className="hover:text-white">List Your Home</Link></li>
              <li><Link href="/host/guide" className="hover:text-white">Host Guide</Link></li>
              <li><Link href="/host/insurance" className="hover:text-white">Insurance</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/about" className="hover:text-white">About</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Musa Residency. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}