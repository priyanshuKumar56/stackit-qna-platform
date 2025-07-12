"use client"

import { Provider } from "react-redux"
import { store } from "@/store/store"
import { Header } from "@/components/header"
import { SettingsPage } from "@/components/settings-page"

export default function Settings() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-16">
          <SettingsPage />
        </div>
      </div>
    </Provider>
  )
}
