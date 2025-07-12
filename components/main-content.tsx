"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUp, MessageSquare, Eye, Clock, CheckCircle, Filter, TrendingUp } from "lucide-react"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { setActiveTab } from "@/store/uiSlice"
import Link from "next/link"

const tabs = [
  { id: "recent-activity", label: "Recent activity", icon: Clock },
  { id: "help-others", label: "Help others", icon: MessageSquare },
  { id: "categories", label: "Categories", icon: TrendingUp },
]

export function MainContent() {
  const dispatch = useAppDispatch()
  const { questions, filter } = useAppSelector((state) => state.questions)
  const { activeTab, searchQuery } = useAppSelector((state) => state.ui)
  const [sortBy, setSortBy] = useState("recent")

  const filteredQuestions = questions.filter((question) => {
    if (searchQuery) {
      return (
        question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        question.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }
    if (filter === "all") return true
    if (filter === "trending") return question.votes > 10
    if (filter === "unanswered") return question.replies === 0
    if (filter === "recent") return true
    return question.category.toLowerCase().includes(filter.replace("-", " "))
  })

  const getFilterTitle = () => {
    switch (filter) {
      case "all":
        return "All Questions"
      case "trending":
        return "Trending Questions"
      case "recent":
        return "Recent Questions"
      case "unanswered":
        return "Unanswered Questions"
      case "my-questions":
        return "My Questions"
      case "fin-qa":
        return "Fin Q&A"
      case "fin-community":
        return "Fin Community"
      case "product-qa":
        return "Product Q&A"
      case "product-wishlist":
        return "Product Wishlist"
      case "groups":
        return "Groups"
      case "user-tips":
        return "User Tips"
      default:
        return "Questions"
    }
  }

  return (
    <div className="p-6 pt-8 mt-9 bg-gray-50 ">
      <div className="max-w-6xl mx-auto">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                className={`rounded-none border-b-2 ${
                  activeTab === tab.id
                    ? "bg-white text-blue-600 border-blue-600 hover:bg-blue-50"
                    : "bg-white text-gray-600 border-transparent hover:text-gray-900 hover:bg-gray-50"
                }`}
                onClick={() => dispatch(setActiveTab(tab.id))}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{getFilterTitle()}</h1>
            <p className="text-gray-600 mt-1">{filteredQuestions.length} questions found</p>
          </div>

          <div className="flex items-center gap-3">
            <Filter className="w-4 h-4 text-gray-500" />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40 bg-white border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="votes">Most Votes</SelectItem>
                <SelectItem value="answers">Most Answers</SelectItem>
                <SelectItem value="views">Most Views</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {filteredQuestions.map((question) => (
            <Card
              key={question.id}
              className="hover:shadow-md transition-all duration-200 border border-gray-200 bg-white"
            >
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center gap-2 text-center min-w-[60px]">
                    <div className="flex flex-col items-center">
                      <ArrowUp className="w-5 h-5 text-gray-400 hover:text-blue-600 cursor-pointer" />
                      <span className="text-lg font-semibold text-gray-700">{question.votes}</span>
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
                        <span className="text-gray-500">• Asked in {question.category}</span>
                      </div>
                    </div>

                    <Link href={`/question/${question.id}`}>
                      <h3 className="font-semibold text-lg mb-3 hover:text-blue-600 cursor-pointer text-gray-900 leading-tight">
                        {question.title}
                      </h3>
                    </Link>

                    <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">{question.content}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {question.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-xs bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
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

        {filteredQuestions.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}
