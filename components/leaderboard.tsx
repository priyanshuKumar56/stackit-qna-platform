"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trophy, Calendar } from "lucide-react"

export function Leaderboard() {
  const [timeframe, setTimeframe] = useState("all-time")

  const topUsers = [
    {
      rank: 1,
      name: "Sarah Chen",
      username: "sarahc",
      avatar: "/placeholder.svg",
      reputation: 15420,
      questionsAsked: 45,
      answersGiven: 234,
      votesReceived: 1890,
      badges: { gold: 12, silver: 34, bronze: 67 },
      specialties: ["React", "TypeScript", "Node.js"],
    },
    {
      rank: 2,
      name: "Michael Rodriguez",
      username: "mrodriguez",
      avatar: "/placeholder.svg",
      reputation: 12850,
      questionsAsked: 32,
      answersGiven: 198,
      votesReceived: 1654,
      badges: { gold: 8, silver: 28, bronze: 52 },
      specialties: ["Python", "Django", "PostgreSQL"],
    },
    {
      rank: 3,
      name: "Emily Johnson",
      username: "emilyjohnson",
      avatar: "/placeholder.svg",
      reputation: 11200,
      questionsAsked: 28,
      answersGiven: 176,
      votesReceived: 1432,
      badges: { gold: 6, silver: 24, bronze: 48 },
      specialties: ["Vue.js", "JavaScript", "CSS"],
    },
    {
      rank: 4,
      name: "David Kim",
      username: "davidkim",
      avatar: "/placeholder.svg",
      reputation: 9800,
      questionsAsked: 41,
      answersGiven: 145,
      votesReceived: 1298,
      badges: { gold: 5, silver: 19, bronze: 41 },
      specialties: ["Java", "Spring", "AWS"],
    },
    {
      rank: 5,
      name: "Lisa Wang",
      username: "lisawang",
      avatar: "/placeholder.svg",
      reputation: 8650,
      questionsAsked: 35,
      answersGiven: 132,
      votesReceived: 1156,
      badges: { gold: 4, silver: 16, bronze: 38 },
      specialties: ["React Native", "Mobile", "iOS"],
    },
  ]

  const topContributors = [
    {
      rank: 1,
      name: "Alex Thompson",
      username: "alexthompson",
      avatar: "/placeholder.svg",
      contributions: 456,
      helpfulAnswers: 234,
      questionsAnswered: 189,
      badges: { gold: 15, silver: 42, bronze: 78 },
    },
    {
      rank: 2,
      name: "Maria Garcia",
      username: "mariagarcia",
      avatar: "/placeholder.svg",
      contributions: 398,
      helpfulAnswers: 201,
      questionsAnswered: 167,
      badges: { gold: 11, silver: 35, bronze: 65 },
    },
    {
      rank: 3,
      name: "James Wilson",
      username: "jameswilson",
      avatar: "/placeholder.svg",
      contributions: 342,
      helpfulAnswers: 178,
      questionsAnswered: 145,
      badges: { gold: 9, silver: 28, bronze: 54 },
    },
  ]

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />
      case 2:
        return <Trophy className="w-6 h-6 text-gray-400" />
      case 3:
      case 2:
        return <Trophy className="w-6 h-6 text-gray-400" />
      case 3:
        return <Trophy className="w-6 h-6 text-amber-600" />
      default:
        return (
          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold">
            {rank}
          </div>
        )
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Community Leaderboard</h1>
        <p className="text-gray-600">Recognizing our most active and helpful community members</p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <Tabs defaultValue="reputation">
          <TabsList>
            <TabsTrigger value="reputation">Top by Reputation</TabsTrigger>
            <TabsTrigger value="contributors">Top Contributors</TabsTrigger>
            <TabsTrigger value="badges">Most Badges</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-time">All Time</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="this-week">This Week</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="reputation">
        <TabsContent value="reputation" className="space-y-4">
          {topUsers.map((user, index) => (
            <Card
              key={user.username}
              className={`hover:shadow-md transition-shadow ${
                index < 3 ? "border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-transparent" : ""
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    {getRankIcon(user.rank)}
                    <span className="text-2xl font-bold text-gray-400">#{user.rank}</span>
                  </div>

                  <Avatar className="w-16 h-16">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-lg">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold">{user.name}</h3>
                      <span className="text-gray-500">@{user.username}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {user.specialties.map((specialty) => (
                        <Badge key={specialty} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>

                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{user.reputation.toLocaleString()}</div>
                        <div className="text-gray-600">Reputation</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold">{user.questionsAsked}</div>
                        <div className="text-gray-600">Questions</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold">{user.answersGiven}</div>
                        <div className="text-gray-600">Answers</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold">{user.votesReceived}</div>
                        <div className="text-gray-600">Votes</div>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <span className="font-bold">{user.badges.gold}</span>
                      <Trophy className="w-4 h-4 text-gray-400" />
                      <span className="font-bold">{user.badges.silver}</span>
                      <Trophy className="w-4 h-4 text-amber-600" />
                      <span className="font-bold">{user.badges.bronze}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {user.badges.gold + user.badges.silver + user.badges.bronze} total badges
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="contributors" className="space-y-4">
          {topContributors.map((user, index) => (
            <Card
              key={user.username}
              className={`hover:shadow-md transition-shadow ${
                index < 3 ? "border-2 border-green-200 bg-gradient-to-r from-green-50 to-transparent" : ""
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    {getRankIcon(user.rank)}
                    <span className="text-2xl font-bold text-gray-400">#{user.rank}</span>
                  </div>

                  <Avatar className="w-16 h-16">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-lg">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="text-xl font-bold">{user.name}</h3>
                      <span className="text-gray-500">@{user.username}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{user.contributions}</div>
                        <div className="text-gray-600">Total Contributions</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold">{user.helpfulAnswers}</div>
                        <div className="text-gray-600">Helpful Answers</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold">{user.questionsAnswered}</div>
                        <div className="text-gray-600">Questions Answered</div>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <span className="font-bold">{user.badges.gold}</span>
                      <Trophy className="w-4 h-4 text-gray-400" />
                      <span className="font-bold">{user.badges.silver}</span>
                      <Trophy className="w-4 h-4 text-amber-600" />
                      <span className="font-bold">{user.badges.bronze}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {user.badges.gold + user.badges.silver + user.badges.bronze} total badges
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="badges">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topUsers.slice(0, 6).map((user, index) => (
              <Card key={user.username} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <Avatar className="w-16 h-16 mx-auto mb-3">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-lg">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <h3 className="font-bold mb-1">{user.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">@{user.username}</p>

                  <div className="flex justify-center items-center gap-3 mb-2">
                    <div className="flex items-center gap-1">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      <span className="font-bold text-lg">{user.badges.gold}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Trophy className="w-5 h-5 text-gray-400" />
                      <span className="font-bold text-lg">{user.badges.silver}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Trophy className="w-5 h-5 text-amber-600" />
                      <span className="font-bold text-lg">{user.badges.bronze}</span>
                    </div>
                  </div>

                  <div className="text-sm text-gray-500">
                    {user.badges.gold + user.badges.silver + user.badges.bronze} total badges
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
