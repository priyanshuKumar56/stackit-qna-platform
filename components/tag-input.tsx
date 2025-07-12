"use client"

import { useState, type KeyboardEvent } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface TagInputProps {
  tags: string[]
  onTagsChange: (tags: string[]) => void
  placeholder?: string
  maxTags?: number
}

const suggestedTags = [
  "React",
  "JavaScript",
  "TypeScript",
  "Next.js",
  "Node.js",
  "CSS",
  "HTML",
  "Python",
  "API",
  "Database",
]

export function TagInput({ tags, onTagsChange, placeholder, maxTags = 5 }: TagInputProps) {
  const [inputValue, setInputValue] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)

  const filteredSuggestions = suggestedTags.filter(
    (tag) => tag.toLowerCase().includes(inputValue.toLowerCase()) && !tags.includes(tag),
  )

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim()
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < maxTags) {
      onTagsChange([...tags, trimmedTag])
      setInputValue("")
      setShowSuggestions(false)
    }
  }

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTag(inputValue)
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1])
    }
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
            setShowSuggestions(true)
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={tags.length >= maxTags ? `Maximum ${maxTags} tags allowed` : placeholder}
          disabled={tags.length >= maxTags}
        />

        {showSuggestions && inputValue && filteredSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-10 bg-background border rounded-md shadow-lg mt-1 max-h-40 overflow-y-auto">
            {filteredSuggestions.slice(0, 8).map((tag) => (
              <button
                key={tag}
                type="button"
                className="w-full text-left px-3 py-2 hover:bg-accent text-sm"
                onClick={() => addTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1">
              {tag}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-auto p-0 w-4 h-4 hover:bg-transparent"
                onClick={() => removeTag(tag)}
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
