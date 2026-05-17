'use client'

import React from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
  searchParams?: Record<string, string | undefined>
}

export function Pagination({ currentPage, totalPages, baseUrl, searchParams = {} }: PaginationProps) {
  if (totalPages <= 1) return null

  const getPageUrl = (page: number) => {
    const params = new URLSearchParams()
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && key !== 'page') {
        params.set(key, value)
      }
    })
    if (page > 1) {
      params.set('page', page.toString())
    }
    const queryString = params.toString()
    return `${baseUrl}${queryString ? `?${queryString}` : ''}`
  }

  const getPageNumbers = () => {
    const pages = []
    const delta = 2
    const rangeStart = Math.max(1, currentPage - delta)
    const rangeEnd = Math.min(totalPages, currentPage + delta)

    if (rangeStart > 1) {
      pages.push(1)
      if (rangeStart > 2) {
        pages.push('...')
      }
    }

    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i)
    }

    if (rangeEnd < totalPages) {
      if (rangeEnd < totalPages - 1) {
        pages.push('...')
      }
      pages.push(totalPages)
    }

    return pages
  }

  return (
    <nav className="flex items-center justify-center space-x-1">
      {currentPage > 1 && (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="relative inline-flex items-center px-2 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
      )}

      {getPageNumbers().map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700">
              ...
            </span>
          ) : (
            <Link
              href={getPageUrl(page as number)}
              className={cn(
                'relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md',
                currentPage === page
                  ? 'z-10 bg-primary-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              )}
            >
              {page}
            </Link>
          )}
        </React.Fragment>
      ))}

      {currentPage < totalPages && (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="relative inline-flex items-center px-2 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          <ChevronRight className="h-5 w-5" />
        </Link>
      )}
    </nav>
  )
}