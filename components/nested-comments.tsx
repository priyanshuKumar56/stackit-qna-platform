"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TipTapEditor } from "./tiptap-editor"
import { ChevronUp, ChevronDown, MessageSquare, MoreHorizontal, Check, User } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { voteOnComment, createComment, acceptAnswer } from "@/store/commentsSlice"
import { updateUserReputation, incrementUserStats } from "@/store/usersSlice"
import { useAuthStore } from "@/lib/auth"
import toast from "react-hot-toast"
import type { Comment } from "@/store/commentsSlice"

interface NestedCommentsProps {
  comments: Comment[]
  questionId: string
}

export function NestedComments({ comments, questionId }: NestedCommentsProps) {
  const dispatch = useAppDispatch()
  const { isAuthenticated } = useAuthStore()
  const { currentUser } = useAppSelector((state) => state.users)
  const { submitting } = useAppSelector((state) => state.comments)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")

  const handleVote = async (commentId: string, voteType: "upvote" | "downvote") => {
    if (!isAuthenticated) {
      toast.error("Please login to vote")
      return
    }

    try {
      await dispatch(voteOnComment({ commentId, voteType })).unwrap()

      // Find comment author and update reputation
      const findCommentAuthor = (comments: Comment[]): string | null => {
        for (const comment of comments) {
          if (comment.id === commentId) {
            return comment.author.id
          }
          const authorId = findCommentAuthor(comment.replies)
          if (authorId) return authorId
        }
        return null
      }

      const authorId = findCommentAuthor(comments)
      if (authorId) {
        const reputationChange = voteType === "upvote" ? 2 : -1
        dispatch(updateUserReputation({ userId: authorId, amount: reputationChange }))
      }

      toast.success("Vote recorded!")
    } catch (error: any) {
      toast.error(error.message || "Failed to vote")
    }
  }

  const handleReply = async (parentId: string) => {
    if (!isAuthenticated) {
      toast.error("Please login to reply")
      return
    }

    if (!replyContent.trim()) {
      toast.error("Please enter a reply")
      return
    }

    try {
      await dispatch(
        createComment({
          content: replyContent,
          questionId,
          parentCommentId: parentId,
        }),
      ).unwrap()

      setReplyContent("")
      setReplyingTo(null)

      // Update user stats
      if (currentUser) {
        dispatch(incrementUserStats({ userId: currentUser.id, type: "answers" }))
        dispatch(updateUserReputation({ userId: currentUser.id, amount: 1 }))
      }

      toast.success("Reply posted successfully!")
    } catch (error: any) {
      toast.error(error.message || "Failed to post reply")
    }
  }

  const handleAcceptAnswer = async (commentId: string) => {
    if (!isAuthenticated) {
      toast.error("Please login to accept answers")
      return
    }

    try {
      await dispatch(acceptAnswer(commentId)).unwrap()

      // Find comment author and update reputation for accepted answer
      const findCommentAuthor = (comments: Comment[]): string | null => {
        for (const comment of comments) {
          if (comment.id === commentId) {
            return comment.author.id
          }
          const authorId = findCommentAuthor(comment.replies)
          if (authorId) return authorId
        }
        return null
      }

      const authorId = findCommentAuthor(comments)
      if (authorId) {
        dispatch(updateUserReputation({ userId: authorId, amount: 15 })) // Bonus for accepted answer
        dispatch(incrementUserStats({ userId: authorId, type: "acceptedAnswers" }))
      }

      toast.success("Answer accepted!")
    } catch (error: any) {
      toast.error(error.message || "Failed to accept answer")
    }
  }

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment.id} className={`${isReply ? "ml-12 mt-4" : "mb-6"}`}>
      <Card className={`${comment.isAccepted ? "border-green-200 bg-green-50" : "border-gray-200"}`}>
        <CardContent className="p-6">
          <div className="flex gap-4">
            {/* Vote Section */}
            <div className="flex flex-col items-center gap-1 min-w-[60px]">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote(comment.id, "upvote")}
                disabled={!isAuthenticated}
                className={`h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600 ${
                  comment.userVote === "upvote" ? "bg-green-50 text-green-600" : "text-gray-600"
                }`}
              >
                <ChevronUp className="w-4 h-4" />
              </Button>

              <span
                className={`text-lg font-semibold ${
                  comment.votes > 0 ? "text-green-600" : comment.votes < 0 ? "text-red-600" : "text-gray-600"
                }`}
              >
                {comment.votes}
              </span>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote(comment.id, "downvote")}
                disabled={!isAuthenticated}
                className={`h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 ${
                  comment.userVote === "downvote" ? "bg-red-50 text-red-600" : "text-gray-600"
                }`}
              >
                <ChevronDown className="w-4 h-4" />
              </Button>

              {comment.isAccepted && (
                <div className="mt-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                </div>
              )}
            </div>

            {/* Comment Content */}
            <div className="flex-1">
              {comment.isAccepted && (
                <Badge className="bg-green-100 text-green-800 border-green-200 mb-3">✓ Accepted Answer</Badge>
              )}

              <div className="prose prose-sm max-w-none mb-4" dangerouslySetInnerHTML={{ __html: comment.content }} />

              {/* Author and Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={comment.author.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
                      {comment.author.name}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">
                      {comment.author.reputation} rep • {comment.timestamp}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!comment.isAccepted && currentUser && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAcceptAnswer(comment.id)}
                      className="gap-1 text-green-600 hover:text-green-700 hover:bg-green-50"
                    >
                      <Check className="w-4 h-4" />
                      Accept
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    className="gap-1 text-gray-500 hover:text-gray-700"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Reply
                  </Button>

                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Reply Form */}
              {replyingTo === comment.id && (
                <div className="mt-4 space-y-3 p-4 bg-gray-50 rounded-lg">
                  <TipTapEditor
                    content={replyContent}
                    onChange={setReplyContent}
                    placeholder="Write your reply..."
                    className="min-h-[100px]"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleReply(comment.id)}
                      disabled={!replyContent.trim() || submitting}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {submitting ? "Posting..." : "Post Reply"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setReplyingTo(null)
                        setReplyContent("")
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Render Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-8 mt-4 space-y-4">{comment.replies.map((reply) => renderComment(reply, true))}</div>
      )}
    </div>
  )

  return <div className="space-y-6">{comments.map((comment) => renderComment(comment))}</div>
}
