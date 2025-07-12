"use client"

import { Provider } from "react-redux"
import { store } from "@/store/store"
import { QuestionDetailPage } from "@/components/question-detail-page"

export default function QuestionPage({ params }: { params: { id: string } }) {
  return (
    <Provider store={store}>
      <QuestionDetailPage questionId={params.id} />
    </Provider>
  )
}
