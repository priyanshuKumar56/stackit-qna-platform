import { create } from "zustand"
import { persist } from "zustand/middleware"
import Cookies from "js-cookie"
import { authAPI, usersAPI } from "./api"

interface User {
  id: string
  name: string
  username: string
  email: string
  avatar?: string
  reputation: number
  badges: string[]
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: { name: string; username: string; email: string; password: string }) => Promise<void>
  logout: () => void
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
          set({ user, token, isAuthenticated: true, isLoading: false })
        } catch (error: any) {
          set({ isLoading: false })
          throw new Error(error.response?.data?.message || "Login failed")
        }
      },

      register: async (data) => {
        try {
          set({ isLoading: true })
          const response = await authAPI.register(data)
          const { token, user } = response.data

          Cookies.set("auth-token", token, { expires: 7 })
          set({ user, token, isAuthenticated: true, isLoading: false })
        } catch (error: any) {
          set({ isLoading: false })
          throw new Error(error.response?.data?.message || "Registration failed")
        }
      },

      logout: () => {
        Cookies.remove("auth-token")
        set({ user: null, token: null, isAuthenticated: false })
      },

      checkAuth: async () => {
        try {
          const token = Cookies.get("auth-token")
          if (!token) return

          set({ isLoading: true })
          const response = await usersAPI.getCurrentUser()
          set({ user: response.data, token, isAuthenticated: true, isLoading: false })
        } catch (error) {
          Cookies.remove("auth-token")
          set({ user: null, token: null, isAuthenticated: false, isLoading: false })
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    },
  ),
)
