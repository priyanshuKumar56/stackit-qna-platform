"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { RichTextEditor } from "@/components/rich-text-editor"
import { NestedComments } from "@/components/nested-comments"
import { ThumbsUp, Share, Quote, Bell } from "lucide-react"
import { useAppDispatch } from "@/store/hooks"
import { addComment } from "@/store/commentsSlice"
import type { Question } from "@/store/questionsSlice"

interface QuestionDetailProps {
  question: Question
}

export function QuestionDetail({ question }: QuestionDetailProps) {
  const dispatch = useAppDispatch()
  const [replyContent, setReplyContent] = useState("")

  const handleSubmitReply = () => {
    if (!replyContent.trim()) return

    const newComment = {
      id: Date.now().toString(),
      questionId: question.id,
      parentId: null,
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

    dispatch(addComment(newComment))
    setReplyContent("")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">QUESTION</Badge>
          </div>

          <h1 className="text-2xl font-bold mb-4">{question.title}</h1>

          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <span>{question.timestamp}</span>
            <span>•</span>
            <span>{question.replies} replies</span>
            <span>•</span>
            <span>{question.views} views</span>
          </div>

          <div className="flex gap-4 mb-6">
            <Avatar className="w-10 h-10">
              <AvatarImage src={question.author.avatar || "/placeholder.svg"} />
              <AvatarFallback>
                {question.author.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-blue-600">{question.author.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {question.author.badge}
                </Badge>
              </div>

              <p className="text-gray-700 mb-4">{question.content}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {question.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t">
            <Button variant="ghost" size="sm" className="gap-2">
              <ThumbsUp className="w-4 h-4" />
              Like
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <Quote className="w-4 h-4" />
              Quote
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <Bell className="w-4 h-4" />
              Subscribe
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <Share className="w-4 h-4" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>

          <NestedComments questionId={question.id} />
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Reply</h3>
          <RichTextEditor
            value={replyContent}
            onChange={setReplyContent}
            placeholder="Add as many details as possible, by providing details you'll make it easier for others to reply"
          />
          <div className="flex justify-end mt-4">
            <Button onClick={handleSubmitReply} disabled={!replyContent.trim()}>
              Submit
            </Button>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
