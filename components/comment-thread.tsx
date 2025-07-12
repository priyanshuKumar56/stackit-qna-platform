"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ThumbsUp, MessageSquare, MoreHorizontal } from "lucide-react"

interface Comment {
  id: string
  author: {
    name: string
    avatar: string
    reputation: number
  }
  content: string
  timestamp: string
  votes: number
  replies: Comment[]
}

interface CommentThreadProps {
  questionId: string
}

export function CommentThread({ questionId }: CommentThreadProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")

  const handleAddComment = () => {
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now().toString(),
      author: {
        name: "Current User",
        avatar: "/placeholder.svg",
        reputation: 100,
      },
      content: newComment,
      timestamp: "just now",
      votes: 0,
      replies: [],
    }

    setComments([...comments, comment])
    setNewComment("")
  }

  const handleAddReply = (parentId: string) => {
    if (!replyContent.trim()) return

    const reply: Comment = {
      id: Date.now().toString(),
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

    setComments(
      comments.map((comment) =>
        comment.id === parentId ? { ...comment, replies: [...comment.replies, reply] } : comment,
      ),
    )

    setReplyContent("")
    setReplyingTo(null)
  }

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment.id} className={`${isReply ? "ml-12 mt-4" : ""}`}>
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
                <span className="font-medium">{comment.author.name}</span>
                <span className="text-sm text-gray-500">• {comment.timestamp}</span>
                <span className="text-sm text-gray-500">• {comment.author.reputation} rep</span>
              </div>

              <p className="text-gray-700 mb-3">{comment.content}</p>

              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="gap-1 text-gray-500">
                  <ThumbsUp className="w-4 h-4" />
                  {comment.votes}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-gray-500"
                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                >
                  <MessageSquare className="w-4 h-4" />
                  Reply
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-500">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>

              {replyingTo === comment.id && (
                <div className="mt-4 space-y-3">
                  <Textarea
                    placeholder="Write a reply..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="min-h-[80px]"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleAddReply(comment.id)}>
                      Reply
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setReplyingTo(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {comment.replies.map((reply) => renderComment(reply, true))}
    </div>
  )

  return (
    <div className="space-y-6">
      {comments.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Comments ({comments.length})</h3>
          {comments.map((comment) => renderComment(comment))}
        </div>
      )}

      <Card>
        <CardContent className="p-4">
          <div className="space-y-3">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex justify-end">
              <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                Add Comment
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
