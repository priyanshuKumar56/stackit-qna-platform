"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"

export function Breadcrumb() {
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-600">
      <Link href="/" className="text-blue-600 hover:underline">
        Home
      </Link>
      <ChevronRight className="w-4 h-4" />
      <Link href="/forum" className="text-blue-600 hover:underline">
        Forum Support overview
      </Link>
      <ChevronRight className="w-4 h-4" />
      <Link href="/fin" className="text-blue-600 hover:underline">
        Fin
      </Link>
      <ChevronRight className="w-4 h-4" />
      <Link href="/fin/faqs" className="text-blue-600 hover:underline">
        Fin FAQs
      </Link>
      <ChevronRight className="w-4 h-4" />
      <span className="text-gray-900">What is Binance Referral Code</span>
    </nav>
  )
}
