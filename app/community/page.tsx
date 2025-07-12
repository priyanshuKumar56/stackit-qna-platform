"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { PopularTopics } from "@/components/popular-topics"
import { CommunityFeed } from "@/components/community-feed"
import { FeedSidebar } from "@/components/feed-sidebar"

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("recent-activity")

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <div className="container mx-auto px-4 py-8">
        <PopularTopics />
        <div className="flex gap-8 mt-8">
          <div className="flex-1">
            <CommunityFeed activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
          <div className="w-80">
            <FeedSidebar />
          </div>
        </div>
      </div>
    </div>
  )
}
