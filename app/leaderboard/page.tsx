"use client"

import { Provider } from "react-redux"
import { store } from "@/store/store"
import { Header } from "@/components/header"
import { Leaderboard } from "@/components/leaderboard"

export default function LeaderboardPage() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-16">
          <Leaderboard />
        </div>
      </div>
    </Provider>
  )
}
