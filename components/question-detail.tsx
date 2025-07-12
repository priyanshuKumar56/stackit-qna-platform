"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
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
  Calendar,
  User,
} from "lucide-react"
import type { RootState } from "@/store/store"
import { addComment } from "@/store/commentsSlice"
import { voteOnQuestion, bookmarkQuestion, subscribeToQuestion } from "@/store/questionsSlice"
import toast from "react-hot-toast"

interface QuestionDetailProps {
  questionId: string
}

export function QuestionDetail({ questionId }: QuestionDetailProps) {
  const dispatch = useDispatch()
  const { questions } = useSelector((state: RootState) => state.questions)
  const { comments } = useSelector((state: RootState) => state.comments)
  const { currentUser } = useSelector((state: RootState) => state.users)

  const question = questions.find((q) => q.id === questionId)
  const questionComments = comments.filter((c) => c.questionId === questionId && !c.parentId)

  const [newComment, setNewComment] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null)

  useEffect(() => {
    if (question && currentUser) {
      setIsBookmarked(question.bookmarkedBy?.includes(currentUser.id) || false)
      setIsSubscribed(question.subscribedUsers?.includes(currentUser.id) || false)
      setUserVote(question.userVotes?.[currentUser.id] || null)
    }
  }, [question, currentUser])

  if (!question) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">Question not found</h3>
          <p className="text-gray-600">The question you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const handleVote = (voteType: "up" | "down") => {
    if (!currentUser) {
      toast.error("Please login to vote")
      return
    }

    const newVote = userVote === voteType ? null : voteType
    setUserVote(newVote)
    dispatch(
      voteOnQuestion({
        questionId: question.id,
        userId: currentUser.id,
        voteType: newVote,
      }),
    )

    toast.success(newVote ? `${voteType === "up" ? "Upvoted" : "Downvoted"}!` : "Vote removed")
  }

  const handleBookmark = () => {
    if (!currentUser) {
      toast.error("Please login to bookmark")
      return
    }

    setIsBookmarked(!isBookmarked)
    dispatch(bookmarkQuestion({ questionId: question.id, userId: currentUser.id }))
    toast.success(isBookmarked ? "Bookmark removed" : "Question bookmarked!")
  }

  const handleSubscribe = () => {
    if (!currentUser) {
      toast.error("Please login to subscribe")
      return
    }

    setIsSubscribed(!isSubscribed)
    dispatch(subscribeToQuestion({ questionId: question.id, userId: currentUser.id }))
    toast.success(isSubscribed ? "Unsubscribed from notifications" : "Subscribed to notifications!")
  }

  const handleShare = async () => {
    const url = window.location.href

    if (navigator.share) {
      try {
        await navigator.share({
          title: question.title,
          text: question.content.substring(0, 100) + "...",
          url: url,
        })
      } catch (err) {
        // Fallback to clipboard
        navigator.clipboard.writeText(url)
        toast.success("Link copied to clipboard!")
      }
    } else {
      navigator.clipboard.writeText(url)
      toast.success("Link copied to clipboard!")
    }
  }

  const handleQuote = () => {
    const quotedText = `> ${question.content.substring(0, 100)}...\n\n`
    setNewComment(quotedText)
    toast.success("Question quoted in your reply!")
  }

  const handleAddComment = () => {
    if (!currentUser) {
      toast.error("Please login to comment")
      return
    }

    if (!newComment.trim()) {
      toast.error("Please enter a comment")
      return
    }

    const comment = {
      id: Date.now().toString(),
      questionId: question.id,
      userId: currentUser.id,
      content: newComment,
      createdAt: new Date().toISOString(),
      votes: 0,
      parentId: null,
    }

    dispatch(addComment(comment))
    setNewComment("")
    toast.success("Comment added successfully!")
  }

  const voteScore = (question.upvotes || 0) - (question.downvotes || 0)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Question Card */}
      <Card className="shadow-sm border-0 bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-start gap-4">
            {/* Vote Section */}
            <div className="flex flex-col items-center space-y-2 min-w-[60px]">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote("up")}
                className={`h-10 w-10 p-0 rounded-full hover:bg-green-50 ${
                  userVote === "up" ? "bg-green-100 text-green-600" : "text-gray-600"
                }`}
              >
                <ChevronUp className="w-6 h-6" />
              </Button>

              <span
                className={`text-lg font-semibold ${
                  voteScore > 0 ? "text-green-600" : voteScore < 0 ? "text-red-600" : "text-gray-600"
                }`}
              >
                {voteScore}
              </span>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote("down")}
                className={`h-10 w-10 p-0 rounded-full hover:bg-red-50 ${
                  userVote === "down" ? "bg-red-100 text-red-600" : "text-gray-600"
                }`}
              >
                <ChevronDown className="w-6 h-6" />
              </Button>
            </div>

            {/* Question Content */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-3">{question.title}</h1>

              <div className="prose prose-sm max-w-none mb-4" dangerouslySetInnerHTML={{ __html: question.content }} />

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {question.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Question Meta */}
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{question.views || 0} views</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>{questionComments.length} answers</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Asked {new Date(question.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={question.author.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    <User className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900">{question.author.name}</p>
                  <p className="text-sm text-gray-600">{question.author.reputation || 0} reputation</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-4 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBookmark}
              className={`gap-2 ${isBookmarked ? "text-yellow-600 bg-yellow-50" : "text-gray-600"}`}
            >
              {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              {isBookmarked ? "Bookmarked" : "Bookmark"}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleSubscribe}
              className={`gap-2 ${isSubscribed ? "text-blue-600 bg-blue-50" : "text-gray-600"}`}
            >
              {isSubscribed ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
              {isSubscribed ? "Unsubscribe" : "Subscribe"}
            </Button>

            <Button variant="ghost" size="sm" onClick={handleShare} className="gap-2 text-gray-600">
              <Share2 className="w-4 h-4" />
              Share
            </Button>

            <Button variant="ghost" size="sm" onClick={handleQuote} className="gap-2 text-gray-600">
              <Quote className="w-4 h-4" />
              Quote
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Add Answer Section */}
      <Card className="shadow-sm border-0">
        <CardHeader>
          <h3 className="text-lg font-semibold">Your Answer</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <TipTapEditor
            content={newComment}
            onChange={setNewComment}
            placeholder="Write your answer here..."
            className="min-h-[200px]"
          />
          <div className="flex justify-end">
            <Button onClick={handleAddComment} className="bg-blue-600 hover:bg-blue-700">
              Post Your Answer
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Answers Section */}
      <Card className="shadow-sm border-0">
        <CardHeader>
          <h3 className="text-lg font-semibold">
            {questionComments.length} Answer{questionComments.length !== 1 ? "s" : ""}
          </h3>
        </CardHeader>
        <CardContent>
          {questionComments.length > 0 ? (
            <NestedComments comments={questionComments} questionId={question.id} />
          ) : (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No answers yet. Be the first to answer!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
