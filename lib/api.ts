import axios from "axios"
import Cookies from "js-cookie"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
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
      // Clear invalid token and user data
      Cookies.remove("auth-token")
      localStorage.removeItem("currentUser")
      
      // Only redirect to login if not already on login/register pages
      const currentPath = window.location.pathname
      if (currentPath !== "/login" && currentPath !== "/register") {
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  },
)

// Questions API
export const questionsAPI = {
  getQuestions: (params: {
    page?: number
    limit?: number
    category?: string
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
  
  updateQuestion: (id: string, data: any) => api.put(`/questions/${id}`, data),
  
  deleteQuestion: (id: string) => api.delete(`/questions/${id}`),
  
  bookmarkQuestion: (id: string) => api.post(`/questions/${id}/bookmark`),
  
  removeBookmark: (id: string) => api.delete(`/questions/${id}/bookmark`),
  
  subscribeToQuestion: (id: string) => api.post(`/questions/${id}/subscribe`),
  
  unsubscribeFromQuestion: (id: string) => api.delete(`/questions/${id}/subscribe`),
  
  searchQuestions: (params: {
    query: string
    page?: number
    category?: string
  }) => api.get("/questions/search", { params }),
}

// Comments API
export const commentsAPI = {
  getComments: (questionId: string) => api.get(`comments/question/${questionId}`),
  
  createComment: (data: {
    content: string
    questionId: string
    parentCommentId?: string
  }) => api.post("/comments", data),
  
  updateComment: (id: string, data: { content: string }) => api.put(`/comments/${id}`, data),
  
  deleteComment: (id: string) => api.delete(`/comments/${id}`),
  
  acceptAnswer: (id: string) => api.post(`/comments/${id}/accept`),
}

// Votes API
export const votesAPI = {
  vote: (data: {
    targetId: string
    targetType: "Question" | "Comment"
    voteType: "upvote" | "downvote"
  }) => api.post("/votes", data),
  
  getVotes: (targetId: string, targetType: string) => api.get(`/votes/${targetType}/${targetId}`),
}

// Users API
export const usersAPI = {
  // Get user profile by ID (for viewing other users)
  getUserProfile: (id: string) => api.get(`/users/${id}`),
  
  // Update current user's profile
  updateProfile: (data: {
    name?: string
    bio?: string
    location?: string
    website?: string
    avatar?: string
  }) => api.put("/users/profile", data),
  
  getLeaderboard: (params: {
    period?: "week" | "month" | "year" | "all"
    limit?: number
  }) => api.get("/users/leaderboard", { params }),
  
  followUser: (id: string) => api.post(`/users/${id}/follow`),
  
  unfollowUser: (id: string) => api.delete(`/users/${id}/follow`),
  
  searchUsers: (params: {
    query: string
    page?: number
    limit?: number
  }) => api.get("/users/search", { params }),
}

// Auth API
export const authAPI = {
  login: (data: { email: string; password: string }) => api.post("/auth/login", data),
  
  register: (data: {
    name: string
    username: string
    email: string
    password: string
  }) => api.post("/auth/register", data),
  
  logout: () => api.post("/auth/logout"),
  
  refreshToken: () => api.post("/auth/refresh"),
  
  forgotPassword: (data: { email: string }) => api.post("/auth/forgot-password", data),
  
  resetPassword: (data: {
    token: string
    password: string
  }) => api.post("/auth/reset-password", data),
  
  // Verify token and get current user
  verifyToken: () => api.get("/auth/verify"),
}

export default api