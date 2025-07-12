"use client"

import { QuestionDetailPage } from "@/components/question-detail-page"
import { useParams } from "next/navigation"

export default function QuestionPage() {
  const params = useParams()
  const questionId = params.id as string

  return <QuestionDetailPage questionId={questionId} />
}
