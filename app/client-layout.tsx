"use client"

import type React from "react"
import { Provider } from "react-redux"
import { store } from "@/store/store"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Provider store={store}>
      {/* <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange> */}
        {children}
        <Toaster />
      {/* </ThemeProvider> */}
    </Provider>
  )
}
