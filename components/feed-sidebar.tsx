"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const featuredTopics = [
  "Apps & Integrations",
  "Messages & Series",
  "Conversations",
  "API & Webhooks",
  "Messenger",
  "Mobile SDKs",
  "Workflows",
  "Article Help Center",
]

export function FeedSidebar() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3">Ask your question</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Featured Topics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {featuredTopics.map((topic) => (
              <Badge key={topic} variant="outline" className="cursor-pointer hover:bg-gray-100">
                {topic}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hire an Expert</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-r from-blue-600 to-cyan-400 rounded-lg p-4 text-white">
            <p className="text-sm mb-3">Need personalized help with your StackIt setup?</p>
            <Button variant="secondary" size="sm">
              Find an Expert
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
