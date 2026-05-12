"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { SearchBar } from "@/components/search/SearchBar";

export function ListingSearch() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // The SearchBar component handles the search logic
  return <SearchBar />;
}