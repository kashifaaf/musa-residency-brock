import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="max-w-md w-full text-center space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-red-600">Authentication Error</h1>
          <p className="mt-2 text-gray-600">
            There was a problem signing you in. Please try again.
          </p>
        </div>
        <div>
          <Button asChild>
            <Link href="/auth/signin">Try Again</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}