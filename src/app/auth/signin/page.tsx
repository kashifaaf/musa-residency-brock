import { SignInForm } from "@/components/auth/SignInForm";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function SignInPage() {
  // Redirect to the main signin page to avoid duplicate routes
  redirect("/signin");
}