import axios from "axios"
import Cookies from "js-cookie"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = Cookies.get("auth-token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("auth-token")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

// Auth API
export const authAPI = {
  register: (data: { name: string; username: string; email: string; password: string }) =>
    api.post("/auth/register", data),

  login: (data: { email: string; password: string }) => api.post("/auth/login", data),

  getCurrentUser: () => api.get("/auth/me"),
}

// Questions API
export const questionsAPI = {
  getQuestions: (params: {
    page?: number
    limit?: number
    category?: string
    tags?: string
    search?: string
    sort?: string
    filter?: string
  }) => api.get("/questions", { params }),

  getQuestion: (id: string) => api.get(`/questions/${id}`),

  createQuestion: (data: {
    title: string
    content: string
    category: string
    tags: string[]
  }) => api.post("/questions", data),

  subscribeToQuestion: (id: string) => api.post(`/questions/${id}/subscribe`),

  unsubscribeFromQuestion: (id: string) => api.delete(`/questions/${id}/subscribe`),

  bookmarkQuestion: (id: string) => api.post(`/questions/${id}/bookmark`),

  removeBookmark: (id: string) => api.delete(`/questions/${id}/bookmark`),
}

// Comments API
export const commentsAPI = {
  getComments: (questionId: string, params?: { page?: number; limit?: number }) =>
    api.get(`/comments/question/${questionId}`, { params }),

  createComment: (data: {
    content: string
    questionId: string
    parentCommentId?: string
  }) => api.post("/comments", data),

  acceptAnswer: (commentId: string) => api.post(`/comments/${commentId}/accept`),
}

// Votes API
export const votesAPI = {
  vote: (data: {
    targetId: string
    targetType: "Question" | "Comment"
    voteType: "upvote" | "downvote"
  }) => api.post("/votes", data),

  getUserVote: (targetType: string, targetId: string) => api.get(`/votes/${targetType}/${targetId}`),
}

// Users API
export const usersAPI = {
  getUser: (id: string) => api.get(`/users/${id}`),

  updateProfile: (data: {
    name: string
    bio: string
    location: string
    website: string
  }) => api.put("/users/profile", data),

  getLeaderboard: (params?: { type?: string; limit?: number }) => api.get("/users/leaderboard/top", { params }),
}

export default api
