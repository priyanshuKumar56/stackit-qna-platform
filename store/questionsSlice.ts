import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface Question {
  id: string
  title: string
  content: string
  author: {
    id: string // Added author ID
    name: string
    avatar: string
    badge: string
    reputation: number
  }
  category: string
  tags: string[]
  votes: number
  replies: number
  views: number
  timestamp: string
  hasAcceptedAnswer: boolean
}

interface QuestionsState {
  questions: Question[]
  currentQuestion: Question | null
  loading: boolean
  filter: string
  searchQuery: string
}

const initialState: QuestionsState = {
  questions: [
    {
      id: "1",
      title: "What is Binance Referral Code",
      content: "Binance Referral Code is CPA_001BOE2Q3Q. Create an account",
      author: {
        id: "user-2", // Linked to user-2
        name: "HarHarMahadev108",
        avatar: "/placeholder.svg",
        badge: "New Participant",
        reputation: 10,
      },
      category: "Fin FAQs",
      tags: ["binance", "referral", "code"],
      votes: 0,
      replies: 1,
      views: 15,
      timestamp: "3 hours ago",
      hasAcceptedAnswer: false,
    },
    {
      id: "2",
      title: "Livpure Smart Referral Code is FQQIUF",
      content:
        "Livpure Smart Referral Code - FQQIUF | Use it while registering to instant discount on subscriptions. - Sign Up to Get 30 Days Free. - Zero Machine Cost With all plans.",
      author: {
        id: "user-2", // Linked to user-2
        name: "HarHarMahadev108",
        avatar: "/placeholder.svg",
        badge: "New Participant",
        reputation: 10,
      },
      category: "Fin FAQs",
      tags: ["livpure", "referral", "discount"],
      votes: 0,
      replies: 3,
      views: 28,
      timestamp: "3 hours ago",
      hasAcceptedAnswer: false,
    },
    {
      id: "3",
      title: "How to implement authentication in Next.js 14?",
      content:
        "I need help setting up authentication in my Next.js 14 application using the new App Router. What are the best practices?",
      author: {
        id: "user-3", // Linked to user-3
        name: "DevExpert",
        avatar: "/placeholder.svg",
        badge: "Expert",
        reputation: 1250,
      },
      category: "Product Q&A",
      tags: ["nextjs", "authentication", "app-router"],
      votes: 15,
      replies: 7,
      views: 234,
      timestamp: "5 hours ago",
      hasAcceptedAnswer: true,
    },
  ],
  currentQuestion: null,
  loading: false,
  filter: "all",
  searchQuery: "",
}

const questionsSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<string>) => {
      state.filter = action.payload
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    setCurrentQuestion: (state, action: PayloadAction<Question | null>) => {
      state.currentQuestion = action.payload
    },
    addQuestion: (state, action: PayloadAction<Question>) => {
      state.questions.unshift(action.payload)
    },
    updateQuestionVotes: (state, action: PayloadAction<{ id: string; votes: number }>) => {
      const question = state.questions.find((q) => q.id === action.payload.id)
      if (question) {
        question.votes = action.payload.votes
      }
    },
  },
})

export const { setFilter, setSearchQuery, setCurrentQuestion, addQuestion, updateQuestionVotes } =
  questionsSlice.actions
export default questionsSlice.reducer
