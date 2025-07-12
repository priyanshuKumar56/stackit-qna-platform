"use client"

import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, CheckCircle } from "lucide-react"

const popularTopics = [
  {
    title: "What is your Fin success rate?",
    icon: MessageSquare,
    color: "text-blue-600",
  },
  {
    title: "Improving Fin AI responses to vague queries",
    icon: MessageSquare,
    color: "text-blue-600",
  },
  {
    title: "How do you improve your confirmed resolution rate?",
    icon: CheckCircle,
    color: "text-green-600",
  },
  {
    title: "What is considered a good Fin resolution rate?",
    icon: CheckCircle,
    color: "text-green-600",
  },
]

export function PopularTopics() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Engage in Popular Fin Topics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {popularTopics.map((topic, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <topic.icon className={`w-5 h-5 ${topic.color}`} />
                <span className="font-medium">{topic.title}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
