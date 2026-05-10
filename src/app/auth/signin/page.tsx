import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { SignInForm } from '@/components/auth/SignInForm';

export default async function SignInPage() {
  const session = await auth();
  
  if (session?.user) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/20">
      <div className="max-w-md w-full mx-auto p-6">
        <div className="bg-card rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-center mb-6">Sign in to Musa Residency</h1>
          <p className="text-center text-muted-foreground mb-8">
            Connect with creative spaces worldwide
          </p>
          <SignInForm />
        </div>
      </div>
    </div>
  );
}