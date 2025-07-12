"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Bold,
  Italic,
  Underline,
  Type,
  Code,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
  ImageIcon,
  Quote,
  MoreHorizontal,
} from "lucide-react"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const insertText = (before: string, after = "") => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end)

    onChange(newText)

    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, end + before.length)
    }, 0)
  }

  const toolbarButtons = [
    { icon: Bold, action: () => insertText("**", "**"), title: "Bold" },
    { icon: Italic, action: () => insertText("*", "*"), title: "Italic" },
    { icon: Underline, action: () => insertText("<u>", "</u>"), title: "Underline" },
    { icon: Type, action: () => insertText("~~", "~~"), title: "Strikethrough" },
    { icon: Code, action: () => insertText("`", "`"), title: "Code" },
  ]

  const listButtons = [
    { icon: List, action: () => insertText("• "), title: "Bullet List" },
    { icon: ListOrdered, action: () => insertText("1. "), title: "Numbered List" },
  ]

  const alignButtons = [
    { icon: AlignLeft, action: () => insertText(""), title: "Align Left" },
    { icon: AlignCenter, action: () => insertText(""), title: "Align Center" },
    { icon: AlignRight, action: () => insertText(""), title: "Align Right" },
  ]

  const insertButtons = [
    { icon: Link, action: () => insertText("[", "](url)"), title: "Link" },
    { icon: ImageIcon, action: () => insertText("![alt](", ")"), title: "Image" },
    { icon: Quote, action: () => insertText("> "), title: "Quote" },
  ]

  return (
    <div className="border rounded-md">
      <div className="flex items-center gap-1 p-2 border-b bg-gray-50">
        <Select defaultValue="paragraph">
          <SelectTrigger className="w-32 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="paragraph">Styles</SelectItem>
            <SelectItem value="heading1">Heading 1</SelectItem>
            <SelectItem value="heading2">Heading 2</SelectItem>
            <SelectItem value="heading3">Heading 3</SelectItem>
          </SelectContent>
        </Select>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {toolbarButtons.map((button, index) => (
          <Button
            key={index}
            type="button"
            variant="ghost"
            size="sm"
            onClick={button.action}
            title={button.title}
            className="h-8 w-8 p-0"
          >
            <button.icon className="w-4 h-4" />
          </Button>
        ))}

        <Separator orientation="vertical" className="h-6 mx-1" />

        {listButtons.map((button, index) => (
          <Button
            key={index}
            type="button"
            variant="ghost"
            size="sm"
            onClick={button.action}
            title={button.title}
            className="h-8 w-8 p-0"
          >
            <button.icon className="w-4 h-4" />
          </Button>
        ))}

        <Separator orientation="vertical" className="h-6 mx-1" />

        {alignButtons.map((button, index) => (
          <Button
            key={index}
            type="button"
            variant="ghost"
            size="sm"
            onClick={button.action}
            title={button.title}
            className="h-8 w-8 p-0"
          >
            <button.icon className="w-4 h-4" />
          </Button>
        ))}

        <Separator orientation="vertical" className="h-6 mx-1" />

        {insertButtons.map((button, index) => (
          <Button
            key={index}
            type="button"
            variant="ghost"
            size="sm"
            onClick={button.action}
            title={button.title}
            className="h-8 w-8 p-0"
          >
            <button.icon className="w-4 h-4" />
          </Button>
        ))}

        <Button type="button" variant="ghost" size="sm" title="More options" className="h-8 w-8 p-0">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>

      <div className="p-3">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-h-[200px] border-0 p-0 resize-none focus-visible:ring-0"
        />
      </div>
    </div>
  )
}
