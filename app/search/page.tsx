"use client"

import { Provider } from "react-redux"
import { store } from "@/store/store"
import { Header } from "@/components/header"
import { SearchResults } from "@/components/search-results"

export default function SearchPage({ searchParams }: { searchParams: { q: string } }) {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-16">
          <SearchResults query={searchParams.q || ""} />
        </div>
      </div>
    </Provider>
  )
}
