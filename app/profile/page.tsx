"use client"


import { Header } from "@/components/header"
import  UserProfile  from "@/components/user-profile"

export default function ProfilePage() {
  return (
    // <Provider store={store}>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-16">
          <UserProfile />
        </div>
      </div>
    // </Provider>
  )
}
