"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TipTapEditor } from "./tiptap-editor"
import { NestedComments } from "./nested-comments"
import {
  ChevronUp,
  ChevronDown,
  MessageSquare,
  Share2,
  Bookmark,
  BookmarkCheck,
  Bell,
  BellOff,
  Quote,
  Eye,
  Clock,
} from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { voteOnQuestion, bookmarkQuestion, subscribeToQuestion, updateQuestionInList } from "@/store/questionsSlice"
import { createComment } from "@/store/commentsSlice"
import { incrementUserStats, updateUserReputation } from "@/store/usersSlice"
import { useAuthStore } from "@/lib/auth"
import toast from "react-hot-toast"
import type { Question } from "@/store/questionsSlice"
import type { Comment } from "@/store/commentsSlice"

interface QuestionDetailProps {
  question: Question
  comments: Comment[]
}

export function QuestionDetail({ question, comments }: QuestionDetailProps) {
  const dispatch = useAppDispatch()
  
  // Use the useAuthStore hook - now it uses Redux users slice
  const { isAuthenticated, user: currentUser } = useAuthStore()
  const { submitting } = useAppSelector((state) => state.comments)
  const { relatedQuestions } = useAppSelector((state) => state.questions)

  const [newComment, setNewComment] = useState("")

  const handleVote = async (voteType: "upvote" | "downvote") => {
    if (!isAuthenticated) {
      toast.error("Please login to vote")
      return
    }

    try {
      await dispatch(voteOnQuestion({ questionId: question.id, voteType })).unwrap()

      // Update author reputation
      const reputationChange = voteType === "upvote" ? 5 : -2
      dispatch(updateUserReputation({ userId: question.author.id, amount: reputationChange }))

      toast.success("Vote recorded!")
    } catch (error: any) {
      toast.error(error.message || "Failed to vote")
    }
  }

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to bookmark")
      return
    }

    try {
      await dispatch(bookmarkQuestion(question.id)).unwrap()
      toast.success(question.isBookmarked ? "Bookmark removed" : "Question bookmarked")
    } catch (error: any) {
      toast.error(error.message || "Failed to update bookmark")
    }
  }

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to subscribe")
      return
    }

    try {
      await dispatch(subscribeToQuestion(question.id)).unwrap()
      toast.success(question.isSubscribed ? "Unsubscribed" : "Subscribed to notifications")
    } catch (error: any) {
      toast.error(error.message || "Failed to update subscription")
    }
  }

  const handleShare = async () => {
    const url = window.location.href

    if (navigator.share) {
      try {
        await navigator.share({
          title: question.title,
          text: question.content.replace(/<[^>]*>/g, "").substring(0, 100) + "...",
          url: url,
        })
      } catch (err) {
        navigator.clipboard.writeText(url)
        toast.success("Link copied to clipboard!")
      }
    } else {
      navigator.clipboard.writeText(url)
      toast.success("Link copied to clipboard!")
    }
  }

  const handleQuote = () => {
    const quotedText = `> ${question.content.replace(/<[^>]*>/g, "").substring(0, 100)}...\n\n`
    setNewComment(quotedText)
    toast.success("Question quoted in your reply!")
  }

  const handleAddComment = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to comment")
      return
    }

    if (!newComment.trim()) {
      toast.error("Please enter a comment")
      return
    }

    try {
      await dispatch(
        createComment({
          content: newComment,
          questionId: question.id,
        }),
      ).unwrap()

      setNewComment("")

      // Update user stats
      if (currentUser) {
        dispatch(incrementUserStats({ userId: currentUser.id, type: "answers" }))
        dispatch(updateUserReputation({ userId: currentUser.id, amount: 1 }))
      }

      // Update question reply count
      dispatch(updateQuestionInList({ id: question.id, replies: question.replies + 1 }))

      toast.success("Answer posted successfully!")
    } catch (error: any) {
      toast.error(error.message || "Failed to post answer")
    }
  }

  return (
    <div className="space-y-6">
      {/* Question Card */}
      <Card className="shadow-sm border-gray-200">
        <CardContent className="p-8">
          {/* Question Header */}
          <div className="flex items-center gap-2 mb-4">
            <Badge className="bg-blue-100 text-blue-800 border-blue-200 font-medium">QUESTION</Badge>
            <Badge variant="outline" className="text-gray-600">
              {question.category}
            </Badge>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">{question.title}</h1>

          {/* Question Meta */}
          <div className="flex items-center gap-6 text-sm text-gray-500 mb-8">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>Asked {question.timestamp}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              <span>{question.replies} answers</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{question.views} views</span>
            </div>
          </div>

          <div className="flex gap-6">
            {/* Voting Section */}
            <div className="flex flex-col items-center gap-2 min-w-[80px]">
              <Button
                variant="ghost"
                size="lg"
                onClick={() => handleVote("upvote")}
                disabled={!isAuthenticated}
                className={`hover:bg-green-50 hover:text-green-600 p-3 ${
                  question.userVote === "upvote" ? "bg-green-50 text-green-600" : "text-gray-600"
                }`}
              >
                <ChevronUp className="w-6 h-6" />
              </Button>

              <span
                className={`text-2xl font-bold ${
                  question.votes > 0 ? "text-green-600" : question.votes < 0 ? "text-red-600" : "text-gray-700"
                }`}
              >
                {question.votes}
              </span>

              <Button
                variant="ghost"
                size="lg"
                onClick={() => handleVote("downvote")}
                disabled={!isAuthenticated}
                className={`hover:bg-red-50 hover:text-red-600 p-3 ${
                  question.userVote === "downvote" ? "bg-red-50 text-red-600" : "text-gray-600"
                }`}
              >
                <ChevronDown className="w-6 h-6" />
              </Button>

              <Button
                variant="ghost"
                size="lg"
                onClick={handleBookmark}
                disabled={!isAuthenticated}
                className={`hover:bg-yellow-50 hover:text-yellow-600 p-3 mt-2 ${
                  question.isBookmarked ? "bg-yellow-50 text-yellow-600" : "text-gray-600"
                }`}
              >
                {question.isBookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
              </Button>
            </div>

            {/* Question Content */}
            <div className="flex-1">
              {/* Author Info */}
              <div className="flex items-center gap-3 mb-6">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={question.author.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-blue-100 text-blue-700">
                    {question.author.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-blue-600 hover:text-blue-800 cursor-pointer">
                      {question.author.name}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {question.author.badge}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">{question.author.reputation} reputation</p>
                </div>
              </div>

              {/* Question Content */}
              <div className="prose prose-lg max-w-none mb-6" dangerouslySetInnerHTML={{ __html: question.content }} />

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {question.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-sm bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 cursor-pointer"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
            <Button variant="ghost" size="sm" className="gap-2 text-gray-600 hover:text-gray-900" onClick={handleShare}>
              <Share2 className="w-4 h-4" />
              Share
            </Button>

            <Button variant="ghost" size="sm" className="gap-2 text-gray-600 hover:text-gray-900" onClick={handleQuote}>
              <Quote className="w-4 h-4" />
              Quote
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className={`gap-2 ${
                question.isSubscribed ? "text-blue-600 hover:text-blue-800" : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={handleSubscribe}
              disabled={!isAuthenticated}
            >
              {question.isSubscribed ? (
                <>
                  <BellOff className="w-4 h-4" />
                  Unsubscribe
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4" />
                  Subscribe
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add Answer Section */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader>
          <h3 className="text-xl font-semibold text-gray-900">Your Answer</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <TipTapEditor
            content={newComment}
            onChange={setNewComment}
            placeholder="Write your answer here. Be specific and provide examples if possible."
            className="min-h-[200px]"
          />
          <div className="flex justify-end">
            <Button
              onClick={handleAddComment}
              disabled={!newComment.trim() || !isAuthenticated || submitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {submitting ? "Posting..." : isAuthenticated ? "Post Your Answer" : "Login to Answer"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Answers Section */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader>
          <h3 className="text-xl font-semibold text-gray-900">
            {comments.length} Answer{comments.length !== 1 ? "s" : ""}
          </h3>
        </CardHeader>
        <CardContent>
          {comments.length > 0 ? (
            <NestedComments comments={comments} questionId={question.id} />
          ) : (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No answers yet. Be the first to answer!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Related Questions */}
      {relatedQuestions.length > 0 && (
        <Card className="shadow-sm border-gray-200">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Related Questions</h3>
            <div className="space-y-3">
              {relatedQuestions.map((related) => (
                <div key={related.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
                  <div className="flex-shrink-0 mt-1">
                    {related.hasAcceptedAnswer ? (
                      <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                      </div>
                    ) : (
                      <div className="w-4 h-4 bg-gray-200 rounded-full" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer">{related.title}</h4>
                    <p className="text-sm text-gray-500">{related.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}