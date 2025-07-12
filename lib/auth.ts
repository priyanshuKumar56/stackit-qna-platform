import { create } from "zustand"
import { persist } from "zustand/middleware"
import Cookies from "js-cookie"
import { authAPI } from "./api"
import toast from "react-hot-toast"

interface User {
  id: string
  name: string
  username: string
  email: string
  bio: string
  location: string
  website: string
  avatar: string
  reputation: number
  badges: {
    gold: number
    silver: number
    bronze: number
  }
  questionsCount: number
  answersCount: number
  votesReceived: number
  viewsCount: number
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: { name: string; username: string; email: string; password: string }) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true })
          const response = await authAPI.login({ email, password })
          const { token, user } = response.data

          Cookies.set("auth-token", token, { expires: 7 })
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          })

          toast.success("Login successful!")
        } catch (error: any) {
          set({ isLoading: false })
          toast.error(error.response?.data?.message || "Login failed")
          throw error
        }
      },

      register: async (data) => {
        try {
          set({ isLoading: true })
          const response = await authAPI.register(data)
          const { token, user } = response.data

          Cookies.set("auth-token", token, { expires: 7 })
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          })

          toast.success("Registration successful!")
        } catch (error: any) {
          set({ isLoading: false })
          toast.error(error.response?.data?.message || "Registration failed")
          throw error
        }
      },

      logout: () => {
        Cookies.remove("auth-token")
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        })
        toast.success("Logged out successfully")
      },

      updateUser: (userData) => {
        const currentUser = get().user
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData },
          })
        }
      },

      checkAuth: async () => {
        try {
          const token = Cookies.get("auth-token")
          if (!token) return

          const response = await authAPI.getCurrentUser()
          const { user } = response.data

          set({
            user,
            token,
            isAuthenticated: true,
          })
        } catch (error) {
          Cookies.remove("auth-token")
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          })
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
