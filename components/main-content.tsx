"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ArrowUp, MessageSquare, Eye, Clock, CheckCircle, Filter, TrendingUp, Search, Plus } from "lucide-react"
import { questionsAPI } from "@/lib/api"
import { useAuthStore } from "@/lib/auth"
import Link from "next/link"
import toast from "react-hot-toast"

interface Question {
  id: string
  title: string
  content: string
  author: {
    id: string
    name: string
    avatar: string
    badge: string
    reputation: number
  }
  category: string
  tags: string[]
  votes: number
  replies: number
  views: number
  timestamp: string
  hasAcceptedAnswer: boolean
}

const tabs = [
  { id: "recent", label: "Recent", icon: Clock },
  { id: "trending", label: "Trending", icon: TrendingUp },
  { id: "unanswered", label: "Unanswered", icon: MessageSquare },
]

const categories = [
  { id: "all", label: "All Categories" },
  { id: "technology", label: "Technology" },
  { id: "finance", label: "Finance" },
  { id: "industry", label: "Industry" },
  { id: "saas", label: "SaaS Products" },
  { id: "web-dev", label: "Web Development" },
  { id: "mobile-dev", label: "Mobile Development" },
  { id: "data-science", label: "Data Science" },
  { id: "devops", label: "DevOps" },
  { id: "design", label: "UI/UX Design" },
  { id: "business", label: "Business" },
  { id: "marketing", label: "Marketing" },
  { id: "startups", label: "Startups" },
]

export function MainContent() {
  const { isAuthenticated } = useAuthStore()
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("recent")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("recent")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchQuestions()
  }, [activeTab, selectedCategory, sortBy, searchQuery, currentPage])

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      const params = {
        page: currentPage,
        limit: 10,
        category: selectedCategory !== "all" ? selectedCategory : undefined,
        search: searchQuery || undefined,
        sort: sortBy,
        filter: activeTab,
      }

      const response = await questionsAPI.getQuestions(params)
      setQuestions(response.data.questions)
      setTotalPages(response.data.pagination.pages)
    } catch (error: any) {
      console.error("Failed to fetch questions:", error)
      toast.error("Failed to load questions")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchQuestions()
  }

  const getFilterTitle = () => {
    switch (activeTab) {
      case "recent":
        return "Recent Questions"
      case "trending":
        return "Trending Questions"
      case "unanswered":
        return "Unanswered Questions"
      default:
        return "Questions"
    }
  }

  if (loading && questions.length === 0) {
    return (
      <div className="p-6 pt-8 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 pt-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{getFilterTitle()}</h1>
            <p className="text-gray-600 mt-1">{questions.length} questions found</p>
          </div>

          {isAuthenticated && (
            <Link href="/ask">
              <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
                <Plus className="w-4 h-4" />
                Ask Question
              </Button>
            </Link>
          )}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <form onSubmit={handleSearch} className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Search</Button>
          </form>

          <div className="flex flex-wrap gap-4 items-center">
            {/* Tabs */}
            <div className="flex gap-2">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    setActiveTab(tab.id)
                    setCurrentPage(1)
                  }}
                  className="gap-2"
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </Button>
              ))}
            </div>

            {/* Category Filter */}
            <Select
              value={selectedCategory}
              onValueChange={(value) => {
                setSelectedCategory(value)
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="votes">Most Votes</SelectItem>
                  <SelectItem value="views">Most Views</SelectItem>
                  <SelectItem value="activity">Most Active</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {questions.map((question) => (
            <Card
              key={question.id}
              className="hover:shadow-md transition-all duration-200 border border-gray-200 bg-white"
            >
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center gap-2 text-center min-w-[80px]">
                    <div className="flex flex-col items-center">
                      <ArrowUp className="w-5 h-5 text-gray-400 hover:text-blue-600 cursor-pointer" />
                      <span
                        className={`text-lg font-semibold ${
                          question.votes > 0 ? "text-green-600" : question.votes < 0 ? "text-red-600" : "text-gray-700"
                        }`}
                      >
                        {question.votes}
                      </span>
                      <span className="text-xs text-gray-500">votes</span>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={question.author.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-blue-100 text-blue-700 text-sm">
                          {question.author.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
                          {question.author.name}
                        </span>
                        <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                          {question.author.badge}
                        </Badge>
                        <span className="text-gray-500">• {question.author.reputation} rep</span>
                      </div>
                    </div>

                    <Link href={`/question/${question.id}`}>
                      <h3 className="font-semibold text-lg mb-3 hover:text-blue-600 cursor-pointer text-gray-900 leading-tight">
                        {question.title}
                      </h3>
                    </Link>

                    <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                      {question.content.replace(/<[^>]*>/g, "").substring(0, 200)}...
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {question.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-xs bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 cursor-pointer"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          <span>{question.replies} answers</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{question.views} views</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {question.category}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>{question.timestamp}</span>
                        </div>
                        {question.hasAcceptedAnswer && (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span className="text-sm text-green-600 font-medium">Solved</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              )
            })}

            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}

        {questions.length === 0 && !loading && (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
            {isAuthenticated && (
              <Link href="/ask">
                <Button className="bg-blue-600 hover:bg-blue-700">Ask the First Question</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
