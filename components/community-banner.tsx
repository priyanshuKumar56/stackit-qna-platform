"use client"

import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"

export function CommunityBanner() {
  return (
    <div className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" />
              <span>Ask questions and find answers</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" />
              <span>Learn from experts</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" />
              <span>Connect and get inspired</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button className="bg-blue-600 hover:bg-blue-700">JOIN THE COMMUNITY</Button>
            <Button variant="ghost" size="icon">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
