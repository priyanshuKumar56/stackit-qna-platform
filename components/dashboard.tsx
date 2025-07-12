"use client"

import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { MainContent } from "@/components/main-content"
import { QuestionModal } from "@/components/question-modal"
import { useAppSelector } from "@/store/hooks"

export function Dashboard() {
  const { sidebarCollapsed, isQuestionModalOpen } = useAppSelector((state) => state.ui)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className={`flex-1  transition-all duration-300 ${sidebarCollapsed ? "ml-16" : "ml-64"}`}>
          <MainContent />
        </main>
      </div>
      <QuestionModal open={isQuestionModalOpen} />
    </div>
  )
}
