"use client"

import { Provider } from "react-redux"
import { store } from "@/store/store"
import { Dashboard } from "@/components/dashboard"

export default function HomePage() {
  return (
    // <Provider store={store}>
      <Dashboard />
    // </Provider>
  )
}
