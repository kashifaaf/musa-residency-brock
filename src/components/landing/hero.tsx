import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function Hero() {
  return (
    <div className="bg-gradient-to-r from-primary-50 to-orange-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Home Exchange for</span>
            <span className="block text-primary-600">Creative Professionals</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Connect with like-minded remote workers and creatives. Stay in unique homes designed for inspiration and productivity.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Button asChild size="lg">
                <Link href="/search">
                  Start Exploring
                </Link>
              </Button>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <Button asChild variant="outline" size="lg">
                <Link href="/register">
                  List Your Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}