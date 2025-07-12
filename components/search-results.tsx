"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MessageSquare, ThumbsUp, Eye, Clock, CheckCircle, User, Tag, Filter } from "lucide-react"
import Link from "next/link"

interface SearchResultsProps {
  query: string
}

export function SearchResults({ query }: SearchResultsProps) {
  const [activeTab, setActiveTab] = useState("all")
  const [sortBy, setSortBy] = useState("relevance")

  // Mock search results
  const searchResults = {
    questions: [
      {
        id: "1",
        title: "How to implement authentication in Next.js 14 with App Router?",
        content: "I'm trying to set up authentication in my Next.js 14 application using the new App Router...",
        author: {
          name: "Alice Johnson",
          avatar: "/placeholder.svg",
          reputation: 1250,
        },
        tags: ["Next.js", "Authentication", "React"],
        votes: 15,
        answers: 3,
        views: 234,
        timestamp: "2 hours ago",
        hasAcceptedAnswer: false,
      },
      {
        id: "2",
        title: "Best practices for React state management in large applications",
        content: "What are the current best practices for managing state in large-scale React applications?",
        author: {
          name: "Bob Smith",
          avatar: "/placeholder.svg",
          reputation: 890,
        },
        tags: ["React", "State Management", "Redux"],
        votes: 23,
        answers: 7,
        views: 456,
        timestamp: "4 hours ago",
        hasAcceptedAnswer: true,
      },
    ],
    users: [
      {
        id: "1",
        name: "John Doe",
        username: "johndoe",
        avatar: "/placeholder.svg",
        reputation: 2500,
        badges: { gold: 3, silver: 12, bronze: 25 },
        bio: "Full-stack developer with 5+ years experience",
      },
      {
        id: "2",
        name: "Jane Smith",
        username: "janesmith",
        avatar: "/placeholder.svg",
        reputation: 1800,
        badges: { gold: 1, silver: 8, bronze: 18 },
        bio: "Frontend specialist, React enthusiast",
      },
    ],
    tags: [
      { name: "React", count: 1234, description: "A JavaScript library for building user interfaces" },
      { name: "Next.js", count: 567, description: "The React framework for production" },
      { name: "JavaScript", count: 2345, description: "High-level programming language" },
      { name: "TypeScript", count: 890, description: "Typed superset of JavaScript" },
    ],
  }

  const totalResults = searchResults.questions.length + searchResults.users.length + searchResults.tags.length

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Search Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Search className="w-5 h-5 text-gray-500" />
          <h1 className="text-2xl font-bold">Search Results</h1>
        </div>
        <p className="text-gray-600">
          {totalResults} results for "<span className="font-medium">{query}</span>"
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All ({totalResults})</TabsTrigger>
            <TabsTrigger value="questions">Questions ({searchResults.questions.length})</TabsTrigger>
            <TabsTrigger value="users">Users ({searchResults.users.length})</TabsTrigger>
            <TabsTrigger value="tags">Tags ({searchResults.tags.length})</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="votes">Most Votes</SelectItem>
              <SelectItem value="activity">Recent Activity</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsContent value="all" className="space-y-6">
          {/* Questions Section */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Questions
            </h2>
            <div className="space-y-4">
              {searchResults.questions.map((question) => (
                <Card key={question.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <Link href={`/question/${question.id}`}>
                          <h3 className="text-lg font-semibold hover:text-blue-600 cursor-pointer mb-2">
                            {question.title}
                          </h3>
                        </Link>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{question.content}</p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {question.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <ThumbsUp className="w-4 h-4" />
                              <span>{question.votes}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="w-4 h-4" />
                              <span>{question.answers}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              <span>{question.views}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Clock className="w-4 h-4" />
                              <span>{question.timestamp}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={question.author.avatar || "/placeholder.svg"} />
                                <AvatarFallback>
                                  {question.author.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium">{question.author.name}</span>
                            </div>
                            {question.hasAcceptedAnswer && <CheckCircle className="w-5 h-5 text-green-500" />}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Users Section */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Users
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchResults.users.map((user) => (
                <Card key={user.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold">{user.name}</h3>
                        <p className="text-sm text-gray-600">@{user.username}</p>
                        <p className="text-sm text-gray-600 mt-1">{user.bio}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>{user.reputation} reputation</span>
                          <span>
                            {user.badges.gold}🥇 {user.badges.silver}🥈 {user.badges.bronze}🥉
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Tags Section */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Tags
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchResults.tags.map((tag) => (
                <Card key={tag.name} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Badge variant="outline" className="mb-2">
                          {tag.name}
                        </Badge>
                        <p className="text-sm text-gray-600">{tag.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold">{tag.count}</div>
                        <div className="text-xs text-gray-500">questions</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="questions">
          <div className="space-y-4">
            {searchResults.questions.map((question) => (
              <Card key={question.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  {/* Same question card content as above */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <Link href={`/question/${question.id}`}>
                        <h3 className="text-lg font-semibold hover:text-blue-600 cursor-pointer mb-2">
                          {question.title}
                        </h3>
                      </Link>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{question.content}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {question.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="w-4 h-4" />
                            <span>{question.votes}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" />
                            <span>{question.answers}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{question.views}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span>{question.timestamp}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={question.author.avatar || "/placeholder.svg"} />
                              <AvatarFallback>
                                {question.author.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{question.author.name}</span>
                          </div>
                          {question.hasAcceptedAnswer && <CheckCircle className="w-5 h-5 text-green-500" />}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="users">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {searchResults.users.map((user) => (
              <Card key={user.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold">{user.name}</h3>
                      <p className="text-sm text-gray-600">@{user.username}</p>
                      <p className="text-sm text-gray-600 mt-1">{user.bio}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>{user.reputation} reputation</span>
                        <span>
                          {user.badges.gold}🥇 {user.badges.silver}🥈 {user.badges.bronze}🥉
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tags">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {searchResults.tags.map((tag) => (
              <Card key={tag.name} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Badge variant="outline" className="mb-2">
                        {tag.name}
                      </Badge>
                      <p className="text-sm text-gray-600">{tag.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold">{tag.count}</div>
                      <div className="text-xs text-gray-500">questions</div>
                    </div>
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
