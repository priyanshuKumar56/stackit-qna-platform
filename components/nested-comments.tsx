"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ThumbsUp, MessageSquare, MoreHorizontal } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { addComment, updateCommentVotes } from "@/store/commentsSlice"
import type { Comment } from "@/store/commentsSlice"

interface NestedCommentsProps {
  questionId: string
}

interface CommentItemProps {
  comment: Comment
  level: number
}

function CommentItem({ comment, level }: CommentItemProps) {
  const dispatch = useAppDispatch()
  const [isReplying, setIsReplying] = useState(false)
  const [replyContent, setReplyContent] = useState("")
  const [showReplies, setShowReplies] = useState(true)

  const handleVote = () => {
    dispatch(updateCommentVotes({ id: comment.id, votes: comment.votes + 1 }))
  }

  const handleReply = () => {
    if (!replyContent.trim()) return

    const newReply = {
      id: Date.now().toString(),
      questionId: comment.questionId,
      parentId: comment.id,
      author: {
        name: "Current User",
        avatar: "/placeholder.svg",
        reputation: 100,
      },
      content: replyContent,
      timestamp: "just now",
      votes: 0,
      replies: [],
    }

    dispatch(addComment(newReply))
    setReplyContent("")
    setIsReplying(false)
  }

  return (
    <div className={`${level > 0 ? "ml-8 mt-4" : ""}`}>
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={comment.author.avatar || "/placeholder.svg"} />
              <AvatarFallback>
                {comment.author.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-blue-600">{comment.author.name}</span>
                <span className="text-sm text-gray-500">• {comment.timestamp}</span>
                <span className="text-sm text-gray-500">• {comment.author.reputation} rep</span>
              </div>

              <p className="text-gray-700 mb-3">{comment.content}</p>

              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="gap-1 text-gray-500" onClick={handleVote}>
                  <ThumbsUp className="w-4 h-4" />
                  {comment.votes}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-gray-500"
                  onClick={() => setIsReplying(!isReplying)}
                >
                  <MessageSquare className="w-4 h-4" />
                  Reply
                </Button>
                {comment.replies.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500"
                    onClick={() => setShowReplies(!showReplies)}
                  >
                    {showReplies ? "Hide" : "Show"} {comment.replies.length} replies
                  </Button>
                )}
                <Button variant="ghost" size="sm" className="text-gray-500">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>

              {isReplying && (
                <div className="mt-4 space-y-3">
                  <Textarea
                    placeholder="Write a reply..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="min-h-[80px]"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleReply}>
                      Reply
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setIsReplying(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {showReplies && comment.replies.map((reply) => <CommentItem key={reply.id} comment={reply} level={level + 1} />)}
    </div>
  )
}

export function NestedComments({ questionId }: NestedCommentsProps) {
  const { comments } = useAppSelector((state) => state.comments)
  const questionComments = comments.filter((comment) => comment.questionId === questionId && !comment.parentId)

  if (questionComments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 bg-white shadow-sm rounded-lg">
        <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-medium mb-2">0 replies</h3>
        <p>Be the first to reply!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Replies ({questionComments.length})</h3>
      {questionComments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} level={0} />
      ))}
    </div>
  )
}
