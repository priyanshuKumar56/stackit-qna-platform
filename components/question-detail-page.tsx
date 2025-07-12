"use client"

import { useEffect } from "react"
import { Header } from "@/components/header"
import { Breadcrumb } from "@/components/breadcrumb"
import { QuestionDetail } from "@/components/question-detail"
import { QuestionSidebar } from "@/components/question-sidebar"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { setCurrentQuestion } from "@/store/questionsSlice"

interface QuestionDetailPageProps {
  questionId: string
}

export function QuestionDetailPage({ questionId }: QuestionDetailPageProps) {
  const dispatch = useAppDispatch()
  const { questions, currentQuestion } = useAppSelector((state) => state.questions)

  useEffect(() => {
    const question = questions.find((q) => q.id === questionId)
    dispatch(setCurrentQuestion(question || null))
  }, [questionId, questions, dispatch])

  if (!currentQuestion) {
    return <div>Question not found</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-16">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumb />
          <div className="flex gap-8 mt-6">
            <div className="flex-1">
              <QuestionDetail question={currentQuestion} />
            </div>
            <div className="w-80">
              <QuestionSidebar />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
