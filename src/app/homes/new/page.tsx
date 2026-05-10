import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth/session";
import { CreateHomeForm } from "@/components/homes/CreateHomeForm";

export default async function NewHomePage() {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-3xl font-bold">List Your Home</h1>
        <CreateHomeForm userId={user.id} />
      </div>
    </div>
  );
}