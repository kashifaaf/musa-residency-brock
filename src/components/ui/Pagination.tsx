import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  searchParams?: Record<string, string>;
}

export function Pagination({ currentPage, totalPages, baseUrl, searchParams = {} }: PaginationProps) {
  const getPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  const pages = [];
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <nav className="flex items-center justify-center gap-1">
      <Link
        href={getPageUrl(Math.max(1, currentPage - 1))}
        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
          currentPage === 1
            ? "cursor-not-allowed text-gray-400"
            : "text-gray-700 hover:bg-gray-100"
        }`}
        aria-disabled={currentPage === 1}
      >
        <ChevronLeft className="h-5 w-5" />
      </Link>

      {startPage > 1 && (
        <>
          <Link
            href={getPageUrl(1)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100"
          >
            1
          </Link>
          {startPage > 2 && <span className="px-2 text-gray-500">...</span>}
        </>
      )}

      {pages.map((page) => (
        <Link
          key={page}
          href={getPageUrl(page)}
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${
            currentPage === page
              ? "bg-primary-600 text-white"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          {page}
        </Link>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2 text-gray-500">...</span>}
          <Link
            href={getPageUrl(totalPages)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100"
          >
            {totalPages}
          </Link>
        </>
      )}

      <Link
        href={getPageUrl(Math.min(totalPages, currentPage + 1))}
        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
          currentPage === totalPages
            ? "cursor-not-allowed text-gray-400"
            : "text-gray-700 hover:bg-gray-100"
        }`}
        aria-disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-5 w-5" />
      </Link>
    </nav>
  );
}