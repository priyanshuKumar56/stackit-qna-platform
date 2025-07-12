"use client"

import { Provider } from "react-redux"
import { store } from "@/store/store"
import { Header } from "@/components/header"
import { NotificationCenter } from "@/components/notification-center"

export default function NotificationsPage() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-16">
          <NotificationCenter />
        </div>
      </div>
    </Provider>
  )
}
