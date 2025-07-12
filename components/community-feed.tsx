"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ThumbsUp, MessageSquare, Eye, Clock } from "lucide-react"

interface CommunityFeedProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const tabs = [
  { id: "recent-activity", label: "Recent activity" },
  { id: "help-others", label: "Help others" },
  { id: "categories", label: "Categories" },
]

const feedItems = [
  {
    id: 1,
    author: {
      name: "HarHarMahadev108",
      avatar: "/placeholder.svg",
      badge: "New Participant",
    },
    category: "Fin FAQs",
    title: "What is Binance Referral Code",
    content: "Binance Referral Code is CPA_001BOE2Q3Q. Create an account",
    votes: 0,
    replies: 1,
    views: 0,
    timestamp: "3 hours ago",
    hasAnswer: false,
  },
  {
    id: 2,
    author: {
      name: "HarHarMahadev108",
      avatar: "/placeholder.svg",
      badge: "New Participant",
    },
    category: "Fin FAQs",
    title: "Livpure Smart Referral Code is FQQIUF",
    content:
      "Livpure Smart Referral Code - FQQIUF | Use it while registering to instant discount on subscriptions. - Sign Up to Get 30 Days Free. - Zero Machine Cost With all plans. - Als...",
    votes: 0,
    replies: 3,
    views: 0,
    timestamp: "3 hours ago",
    hasAnswer: false,
  },
  {
    id: 3,
    author: {
      name: "HarHarMahadev108",
      avatar: "/placeholder.svg",
      badge: "New Participant",
    },
    category: "Fin FAQs",
    title: "Exness Partner Code: k23wxd5efm",
    content: "Detail Information Platform Exness Partner Code k23wxd5efm Signup Link Join Now",
    votes: 0,
    replies: 0,
    views: 0,
    timestamp: "3 hours ago",
    hasAnswer: false,
  },
]

export function CommunityFeed({ activeTab, onTabChange }: CommunityFeedProps) {
  return (
    <div>
      <div className="bg-gray-900 text-white rounded-t-lg">
        <div className="flex">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              className={`rounded-none ${
                activeTab === tab.id
                  ? "bg-gray-900 text-white border-b-2 border-white"
                  : "bg-gray-900 text-gray-300 hover:text-white"
              }`}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4 mt-4">
        {feedItems.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={item.author.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {item.author.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-blue-600">{item.author.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {item.author.badge}
                    </Badge>
                    <span className="text-sm text-gray-500">• Asked in {item.category}</span>
                  </div>

                  <h3 className="font-semibold text-lg mb-2 hover:text-blue-600 cursor-pointer">{item.title}</h3>

                  <p className="text-gray-600 mb-4">{item.content}</p>

                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{item.votes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{item.replies}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{item.views}</span>
                    </div>
                    <div className="flex items-center gap-1 ml-auto">
                      <Clock className="w-4 h-4" />
                      <span>{item.timestamp}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
