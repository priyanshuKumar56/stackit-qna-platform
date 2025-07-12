"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RichTextEditor } from "@/components/rich-text-editor"
import { TagInput } from "@/components/tag-input"
import { useAuthStore } from "@/lib/auth"
import { questionsAPI } from "@/lib/api"
import { HelpCircle, Lightbulb } from "lucide-react"
import toast from "react-hot-toast"

interface QuestionModalProps {
  open: boolean
  onClose: () => void
  onQuestionCreated?: () => void
}

const categories = [
  { value: "Technology", label: "Technology" },
  { value: "Finance", label: "Finance" },
  { value: "Industry", label: "Industry" },
  { value: "SaaS Products", label: "SaaS Products" },
  { value: "Web Development", label: "Web Development" },
  { value: "Mobile Development", label: "Mobile Development" },
  { value: "Data Science", label: "Data Science" },
  { value: "DevOps", label: "DevOps" },
  { value: "UI/UX Design", label: "UI/UX Design" },
  { value: "Business", label: "Business" },
  { value: "Marketing", label: "Marketing" },
  { value: "Startups", label: "Startups" },
  { value: "General", label: "General" },
]

export default function QuestionModal({ open, onClose, onQuestionCreated }: QuestionModalProps) {
  const { isAuthenticated } = useAuthStore()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated) {
      toast.error("Please login to ask a question")
      return
    }

    if (!title.trim() || !content.trim() || !category) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)

    try {
      await questionsAPI.createQuestion({
        title: title.trim(),
        content,
        category,
        tags,
      })

      toast.success("Question posted successfully!")

      // Reset form
      setTitle("")
      setContent("")
      setCategory("")
      setTags([])

      onClose()
      onQuestionCreated?.()
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to post question")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
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
            <p className="text-xs text-gray-500">{title.length}/200 characters</p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-900">Category *</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-900">Question Details *</Label>
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
              onClick={onClose}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!title.trim() || !content.trim() || !category || isSubmitting}
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
