import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { questionsAPI, votesAPI } from "@/lib/api"

export interface Question {
  id: string
  title: string
  content: string
  author: {
    id: string
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
  isSubscribed?: boolean
  isBookmarked?: boolean
  userVote?: "upvote" | "downvote" | null
  createdAt: string
  updatedAt: string
}

interface QuestionsState {
  questions: Question[]
  currentQuestion: Question | null
  relatedQuestions: Question[]
  loading: boolean
  error: string | null
  filter: string
  searchQuery: string
  currentPage: number
  totalPages: number
  totalQuestions: number
}

const initialState: QuestionsState = {
  questions: [],
  currentQuestion: null,
  relatedQuestions: [],
  loading: false,
  error: null,
  filter: "recent",
  searchQuery: "",
  currentPage: 1,
  totalPages: 1,
  totalQuestions: 0,
}

// Async thunks for API calls
export const fetchQuestions = createAsyncThunk(
  "questions/fetchQuestions",
  async (params: {
    page?: number
    limit?: number
    category?: string
    search?: string
    sort?: string
    filter?: string
  }) => {
    const response = await questionsAPI.getQuestions(params)
    return response.data
  },
)

export const fetchQuestion = createAsyncThunk("questions/fetchQuestion", async (questionId: string) => {
  const response = await questionsAPI.getQuestion(questionId)
  return response.data
})

export const createQuestion = createAsyncThunk(
  "questions/createQuestion",
  async (questionData: {
    title: string
    content: string
    category: string
    tags: string[]
  }) => {
    const response = await questionsAPI.createQuestion(questionData)
    return response.data
  },
)

export const voteOnQuestion = createAsyncThunk(
  "questions/voteOnQuestion",
  async (voteData: {
    questionId: string
    voteType: "upvote" | "downvote"
  }) => {
    const response = await votesAPI.vote({
      targetId: voteData.questionId,
      targetType: "Question",
      voteType: voteData.voteType,
    })
    return { questionId: voteData.questionId, ...response.data }
  },
)

export const bookmarkQuestion = createAsyncThunk("questions/bookmarkQuestion", async (questionId: string) => {
  const response = await questionsAPI.bookmarkQuestion(questionId)
  return { questionId, isBookmarked: response.data.isBookmarked }
})

export const subscribeToQuestion = createAsyncThunk("questions/subscribeToQuestion", async (questionId: string) => {
  const response = await questionsAPI.subscribeToQuestion(questionId)
  return { questionId, isSubscribed: response.data.isSubscribed }
})

export const searchQuestions = createAsyncThunk(
  "questions/searchQuestions",
  async (params: {
    query: string
    page?: number
    category?: string
  }) => {
    const response = await questionsAPI.searchQuestions(params)
    return response.data
  },
)

const questionsSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<string>) => {
      state.filter = action.payload
      state.currentPage = 1
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
      state.currentPage = 1
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload
    },
    clearCurrentQuestion: (state) => {
      state.currentQuestion = null
      state.relatedQuestions = []
    },
    clearError: (state) => {
      state.error = null
    },
    updateQuestionInList: (state, action: PayloadAction<Partial<Question> & { id: string }>) => {
      const index = state.questions.findIndex((q) => q.id === action.payload.id)
      if (index !== -1) {
        state.questions[index] = { ...state.questions[index], ...action.payload }
      }
    },
    incrementQuestionViews: (state, action: PayloadAction<string>) => {
      const question = state.questions.find((q) => q.id === action.payload)
      if (question) {
        question.views += 1
      }
      if (state.currentQuestion && state.currentQuestion.id === action.payload) {
        state.currentQuestion.views += 1
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch Questions
    builder
      .addCase(fetchQuestions.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.loading = false
        state.questions = action.payload.questions
        state.totalPages = action.payload.pagination.pages
        state.totalQuestions = action.payload.pagination.total
        state.currentPage = action.payload.pagination.page
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch questions"
      })

    // Fetch Single Question
    builder
      .addCase(fetchQuestion.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchQuestion.fulfilled, (state, action) => {
        state.loading = false
        state.currentQuestion = action.payload.question
        state.relatedQuestions = action.payload.relatedQuestions || []
      })
      .addCase(fetchQuestion.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch question"
      })

    // Create Question
    builder
      .addCase(createQuestion.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createQuestion.fulfilled, (state, action) => {
        state.loading = false
        state.questions.unshift(action.payload.question)
        state.totalQuestions += 1
      })
      .addCase(createQuestion.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to create question"
      })

    // Vote on Question
    builder.addCase(voteOnQuestion.fulfilled, (state, action) => {
      const { questionId, voteScore, userVote } = action.payload

      // Update in questions list
      const questionIndex = state.questions.findIndex((q) => q.id === questionId)
      if (questionIndex !== -1) {
        state.questions[questionIndex].votes = voteScore
        state.questions[questionIndex].userVote = userVote
      }

      // Update current question
      if (state.currentQuestion && state.currentQuestion.id === questionId) {
        state.currentQuestion.votes = voteScore
        state.currentQuestion.userVote = userVote
      }
    })

    // Bookmark Question
    builder.addCase(bookmarkQuestion.fulfilled, (state, action) => {
      const { questionId, isBookmarked } = action.payload

      // Update in questions list
      const questionIndex = state.questions.findIndex((q) => q.id === questionId)
      if (questionIndex !== -1) {
        state.questions[questionIndex].isBookmarked = isBookmarked
      }

      // Update current question
      if (state.currentQuestion && state.currentQuestion.id === questionId) {
        state.currentQuestion.isBookmarked = isBookmarked
      }
    })

    // Subscribe to Question
    builder.addCase(subscribeToQuestion.fulfilled, (state, action) => {
      const { questionId, isSubscribed } = action.payload

      // Update in questions list
      const questionIndex = state.questions.findIndex((q) => q.id === questionId)
      if (questionIndex !== -1) {
        state.questions[questionIndex].isSubscribed = isSubscribed
      }

      // Update current question
      if (state.currentQuestion && state.currentQuestion.id === questionId) {
        state.currentQuestion.isSubscribed = isSubscribed
      }
    })

    // Search Questions
    builder
      .addCase(searchQuestions.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(searchQuestions.fulfilled, (state, action) => {
        state.loading = false
        state.questions = action.payload.questions
        state.totalPages = action.payload.pagination.pages
        state.totalQuestions = action.payload.pagination.total
        state.currentPage = action.payload.pagination.page
      })
      .addCase(searchQuestions.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to search questions"
      })
  },
})

export const {
  setFilter,
  setSearchQuery,
  setCurrentPage,
  clearCurrentQuestion,
  clearError,
  updateQuestionInList,
  incrementQuestionViews,
} = questionsSlice.actions

export default questionsSlice.reducer
