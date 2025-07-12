"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { HelpCircle } from "lucide-react"

const relatedTopics = [
  {
    title: "Livpure Smart Referral Code is FQQIUF",
    category: "Fin FAQs",
  },
  {
    title: "What is Phemex invitation code?",
    category: "Fin FAQs",
    hasAnswer: true,
  },
  {
    title: "What is Exness partner code?",
    category: "Fin FAQs",
    hasAnswer: true,
  },
  {
    title: "Reply and Note box Code",
    category: "Inbox",
    hasAnswer: true,
  },
  {
    title: "Deadlock on *[ICMBridge load]",
    category: "Mobile SDKs",
    hasAnswer: true,
  },
]

const helpfulMembers = [
  { name: "ChelseaRentPrep", likes: 4, avatar: "/placeholder.svg" },
  { name: "Christian S12", likes: 3, avatar: "/placeholder.svg" },
  { name: "Fred Walton", likes: 2, avatar: "/placeholder.svg" },
  { name: "Mahek", likes: 2, avatar: "/placeholder.svg" },
  { name: "Steeve Cayla", likes: 2, avatar: "/placeholder.svg" },
]

export function QuestionSidebar() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Related topics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {relatedTopics.map((topic, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="flex-shrink-0 mt-1">
                {topic.hasAnswer ? (
                  <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                  </div>
                ) : (
                  <HelpCircle className="w-4 h-4 text-blue-500" />
                )}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium hover:text-blue-600 cursor-pointer">{topic.title}</div>
                <div className="text-xs text-gray-500">{topic.category}</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Most helpful members this week</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {helpfulMembers.map((member, index) => (
            <div key={index} className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={member.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="text-sm font-medium">{member.name}</div>
                <div className="text-xs text-gray-500">{member.likes} likes</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
