"use client"

import { useEffect } from "react"
import { Header } from "@/components/header"
import { Breadcrumb } from "@/components/breadcrumb"
import { QuestionDetail } from "@/components/question-detail"
import { QuestionSidebar } from "@/components/question-sidebar"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchQuestion, clearCurrentQuestion } from "@/store/questionsSlice"
import { fetchComments, clearComments } from "@/store/commentsSlice"
// import { fetchCurrentUser } from "@/store/usersSlice"
import { useAuthStore } from "@/lib/auth"

interface QuestionDetailPageProps {
  questionId: string
}

export function QuestionDetailPage({ questionId }: QuestionDetailPageProps) {
  const dispatch = useAppDispatch()
  // const { isAuthenticated } = useAuthStore()
  const { currentQuestion, loading, error } = useAppSelector((state) => state.questions)
  const { comments } = useAppSelector((state) => state.comments)
  const { currentUser } = useAppSelector((state) => state.users)
  console.log("Current User:", currentUser)

  useEffect(() => {
    console.log("Fetching question and comments for ID:", questionId)
    // Fetch question and comments when component mounts
    dispatch(fetchQuestion(questionId))
    dispatch(fetchComments(questionId))

    // Fetch current user if authenticated
    // if ( !currentUser) {
    //   dispatch(fetchCurrentUser(currentUser?.id))
    // }

    // Cleanup when component unmounts
    return () => {
      dispatch(clearCurrentQuestion())
      dispatch(clearComments())
    }
  }, [questionId, dispatch, currentUser])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-16">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-16">
          <div className="container mx-auto px-4 py-6">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">{error || "Question not found"}</h3>
              <p className="text-gray-600">The question you're looking for doesn't exist or has been removed.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-16">
        <div className="container mx-auto px-4 py-6">
          <Breadcrumb />
          <div className="flex gap-8 mt-6">
            <div className="flex-1">
              <QuestionDetail question={currentQuestion} comments={comments} />
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
