import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { CreateListingForm } from "@/components/host/CreateListingForm";

// Force dynamic rendering since this page requires authentication
export const dynamic = 'force-dynamic';

export default async function NewListingPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  if (session.user.role === "guest") {
    redirect("/host/become-a-host");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Create a new listing</h1>
        <CreateListingForm hostId={session.user.id} />
      </div>
    </div>
  );
}