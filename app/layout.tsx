import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google" // Import Inter font
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" }) // Configure Inter font

export const metadata: Metadata = {
  title: "StackIt QA Platform",
  description: "A minimal Q&A platform for community support",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body> {/* Apply Inter font */}
    </html>
  )
}
