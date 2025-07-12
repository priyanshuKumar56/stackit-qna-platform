"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import Placeholder from "@tiptap/extension-placeholder"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  LinkIcon,
  ImageIcon,
  Heading1,
  Heading2,
} from "lucide-react"

interface TipTapEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
}

export function TipTapEditor({ content, onChange, placeholder, className }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 hover:text-blue-800 underline",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg",
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || "Start writing...",
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4",
      },
    },
  })

  if (!editor) {
    return null
  }

  const addLink = () => {
    const url = window.prompt("Enter URL:")
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  const addImage = () => {
    const url = window.prompt("Enter image URL:")
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  return (
    <div className={`border rounded-lg bg-white shadow-sm ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-3 border-b bg-gray-50/50 flex-wrap rounded-t-lg">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`h-8 w-8 p-0 ${editor.isActive("heading", { level: 1 }) ? "bg-blue-100 text-blue-600" : ""}`}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`h-8 w-8 p-0 ${editor.isActive("heading", { level: 2 }) ? "bg-blue-100 text-blue-600" : ""}`}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`h-8 w-8 p-0 ${editor.isActive("bold") ? "bg-blue-100 text-blue-600" : ""}`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`h-8 w-8 p-0 ${editor.isActive("italic") ? "bg-blue-100 text-blue-600" : ""}`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`h-8 w-8 p-0 ${editor.isActive("strike") ? "bg-blue-100 text-blue-600" : ""}`}
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`h-8 w-8 p-0 ${editor.isActive("code") ? "bg-blue-100 text-blue-600" : ""}`}
          title="Code"
        >
          <Code className="w-4 h-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`h-8 w-8 p-0 ${editor.isActive("bulletList") ? "bg-blue-100 text-blue-600" : ""}`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`h-8 w-8 p-0 ${editor.isActive("orderedList") ? "bg-blue-100 text-blue-600" : ""}`}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`h-8 w-8 p-0 ${editor.isActive("blockquote") ? "bg-blue-100 text-blue-600" : ""}`}
          title="Quote"
        >
          <Quote className="w-4 h-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <Button type="button" variant="ghost" size="sm" onClick={addLink} className="h-8 w-8 p-0" title="Add Link">
          <LinkIcon className="w-4 h-4" />
        </Button>

        <Button type="button" variant="ghost" size="sm" onClick={addImage} className="h-8 w-8 p-0" title="Add Image">
          <ImageIcon className="w-4 h-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="h-8 w-8 p-0"
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="h-8 w-8 p-0"
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </Button>
      </div>

      {/* Editor */}
      <div className="min-h-[200px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
