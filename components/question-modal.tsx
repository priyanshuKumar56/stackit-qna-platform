"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RichTextEditor } from "@/components/rich-text-editor"
import { TagInput } from "@/components/tag-input"
import { useAppDispatch } from "@/store/hooks"
import { addQuestion } from "@/store/questionsSlice"
import { setQuestionModalOpen } from "@/store/uiSlice"
import { HelpCircle, Lightbulb } from "lucide-react"

interface QuestionModalProps {
  open: boolean
}

export function QuestionModal({ open }: QuestionModalProps) {
  const dispatch = useAppDispatch()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const newQuestion = {
      id: Date.now().toString(),
      title,
      content,
      author: {
        name: "Current User",
        avatar: "/placeholder.svg",
        badge: "Member",
        reputation: 100,
      },
      category: "General",
      tags,
      votes: 0,
      replies: 0,
      views: 0,
      timestamp: "just now",
      hasAcceptedAnswer: false,
    }

    dispatch(addQuestion(newQuestion))

    // Reset form
    setTitle("")
    setContent("")
    setTags([])
    setIsSubmitting(false)
    dispatch(setQuestionModalOpen(false))
  }

  return (
    <Dialog open={open} onOpenChange={(open) => dispatch(setQuestionModalOpen(open))}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b border-gray-200">
          <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            Ask a Question
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-1">Get help from our community by asking a detailed question</p>
        </DialogHeader>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Tips for a great question:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Be specific and clear in your title</li>
                <li>• Provide context and what you've tried</li>
                <li>• Add relevant tags to help others find your question</li>
                <li>• Include code examples if applicable</li>
              </ul>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-gray-900">
              Question Title *
            </Label>
            <Input
              id="title"
              placeholder="What's your question? Be specific and clear."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500">{title.length}/150 characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="text-sm font-medium text-gray-900">
              Question Details *
            </Label>
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Provide more details about your question. Include what you've tried, expected results, and any error messages."
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-900">Tags</Label>
            <TagInput tags={tags} onTagsChange={setTags} placeholder="Add up to 5 tags to describe your question" />
            <p className="text-xs text-gray-500">Tags help others find and answer your question</p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => dispatch(setQuestionModalOpen(false))}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!title.trim() || !content.trim() || isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              {isSubmitting ? "Publishing..." : "Publish Question"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
