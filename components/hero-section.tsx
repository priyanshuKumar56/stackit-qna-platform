"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface HeroSectionProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function HeroSection({ searchQuery, onSearchChange }: HeroSectionProps) {
  return (
    <div className="relative bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600 overflow-hidden">
      {/* Background shapes */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/20 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-300/30 rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-800/30 rounded-full translate-x-1/2 translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 translate-y-1/2" />
      </div>

      {/* Announcement banner */}
      <div className="relative bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-center gap-3 text-white">
            <Avatar className="w-6 h-6">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <span className="font-medium">The Fin Million Dollar Guarantee</span>
            <span className="text-white/80">18 days ago</span>
          </div>
        </div>
      </div>

      {/* Main hero content */}
      <div className="relative container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">StackIt Community</h1>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Connecting Customers, Partners, Developers and StackIt Teams together
        </p>

        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search or ask a question"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 py-3 text-lg bg-white"
            />
          </div>
        </div>

        <div className="flex items-center justify-between max-w-4xl mx-auto text-white">
          <div className="text-center">
            <div className="text-2xl font-bold">6,354</div>
            <div className="text-white/80">Topics</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">16,175</div>
            <div className="text-white/80">Replies</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">19,946</div>
            <div className="text-white/80">Members</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/80">Recently online</span>
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <Avatar key={i} className="w-8 h-8 border-2 border-white">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>{i}</AvatarFallback>
                </Avatar>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
